import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const body = await req.json();
    const { name, stock, supplier, expiry, status, categoryId } = body;

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (stock) updateData.stock = stock;
    if (supplier !== undefined) updateData.supplier = supplier;
    if (expiry !== undefined) updateData.expiry = expiry ? new Date(expiry) : null;
    if (status) updateData.status = status;
    if (categoryId) updateData.categoryId = parseInt(categoryId);

    updateData.updatedById = parseInt(session.user.id ?? "0");

    const inventoryItem = await prisma.inventoryItem.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    return NextResponse.json(inventoryItem);
  } catch (error) {
    console.error("[INVENTORY_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
