import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const isPaid = searchParams.get("isPaid");

    const whereClause: any = {};
    if (status) whereClause.status = status;
    if (isPaid !== null) whereClause.isPaid = isPaid === "true";

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        createdBy: {
          select: { name: true },
        },
        payment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("[ORDERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { tableNum, type, items } = body;

    if (!items || !items.length) {
      return new NextResponse("Order must have items", { status: 400 });
    }

    // Calculate total
    let total = 0;
    const orderItemsData = [];

    for (const item of items) {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
      });
      if (!menuItem) {
        return new NextResponse(`Menu item ${item.menuItemId} not found`, { status: 400 });
      }
      total += Number(menuItem.price) * item.quantity;
      orderItemsData.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
      });
    }

    const nextOrder = await prisma.order.count() + 1;
    const orderCode = `ORD-${String(nextOrder).padStart(3, "0")}`;

    const order = await prisma.order.create({
      data: {
        orderCode,
        tableNum,
        type,
        status: "PENDING",
        total,
        createdById: parseInt(session.user.id ?? "0"),
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
