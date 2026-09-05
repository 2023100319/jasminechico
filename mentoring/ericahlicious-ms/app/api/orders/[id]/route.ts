import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { Role } from "@/types";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: Role })?.role;
    if (!session || !role) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const body = await req.json();
    const { status, isPaid } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (isPaid !== undefined) updateData.isPaid = isPaid;

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    if (isPaid && status === "COMPLETED") {
       // Ideally here we'd create a payment record if it doesn't exist
       const existingPayment = await prisma.payment.findUnique({
         where: { orderId: id }
       });
       if (!existingPayment) {
           await prisma.payment.create({
               data: {
                   orderId: id,
                   amount: order.total
               }
           });
       }
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
