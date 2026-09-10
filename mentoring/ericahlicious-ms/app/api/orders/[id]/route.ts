import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Helper to calculate and update inventory status
async function updateInventoryStatus(inventoryItemId: number) {
  const item = await prisma.inventoryItem.findUnique({
    where: { id: inventoryItemId },
  });

  if (!item) return;

  let status = "GOOD";
  if (item.stock <= 0) {
    status = "OUT_OF_STOCK";
  } else if (item.stock <= item.reorderLevel) {
    status = "LOW";
  }

  await prisma.inventoryItem.update({
    where: { id: inventoryItemId },
    data: { status },
  });
}

// Helper to deduct inventory when order completes
async function deductInventoryForOrder(orderId: number, userId: number) {
  try {
    // Get order with items
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            menuItem: {
              include: {
                ingredients: true,
              },
            },
          },
        },
      },
    });

    if (!order) return;

    // For this MVP, we'll track sales by menu item quantity
    // In a full system, we'd track ingredient usage via recipes
    for (const orderItem of order.items) {
      const menuItem = orderItem.menuItem;

      // Find an inventory item that matches the menu item name
      // (simplified matching - in production you'd have explicit recipe relationships)
      const matchingInventory = await prisma.inventoryItem.findFirst({
        where: {
          name: {
            contains: menuItem.name.split(" ")[0], // Match first word
          },
        },
      });

      if (matchingInventory) {
        const before = matchingInventory.stock;
        const change = -orderItem.quantity; // Negative for deduction
        const after = before + change;

        // Create SALES_DEDUCT movement
        await prisma.stockMovement.create({
          data: {
            inventoryItemId: matchingInventory.id,
            type: "SALES_DEDUCT",
            change,
            before,
            after,
            reason: `Order ${order.orderCode} completed - sold ${orderItem.quantity}x ${menuItem.name}`,
            createdById: userId,
          },
        });

        // Update inventory stock
        await prisma.inventoryItem.update({
          where: { id: matchingInventory.id },
          data: { stock: after },
        });

        // Update status
        await updateInventoryStatus(matchingInventory.id);
      }
    }
  } catch (error) {
    console.error("[DEDUCT_INVENTORY]", error);
    // Don't block order completion if inventory deduction fails
  }
}

// PATCH: Update order status
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
    const orderId = parseInt(idParam);
    const body = await req.json();
    const { status, isPaid } = body;

    if (!status && isPaid === undefined) {
      return new NextResponse("No updates provided", { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (isPaid !== undefined) updateData.isPaid = isPaid;

    // If status is changing to COMPLETED, deduct from inventory
    if (status === "COMPLETED" && order.status !== "COMPLETED") {
      await deductInventoryForOrder(orderId, parseInt(session.user.id ?? "0"));
    }

    // If marking as paid and completed, create payment record
    if (isPaid && status === "COMPLETED") {
      const existingPayment = await prisma.payment.findUnique({
        where: { orderId },
      });

      if (!existingPayment) {
        await prisma.payment.create({
          data: {
            orderId,
            amount: order.total,
          },
        });
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
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
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("[ORDER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// GET: Retrieve single order
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id: idParam } = await params;
    const orderId = parseInt(idParam);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
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
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDER_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE: Cancel order
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id: idParam } = await params;
    const orderId = parseInt(idParam);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Update to CANCELLED instead of deleting
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("[ORDER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
