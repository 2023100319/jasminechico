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

// PATCH: Receive a purchase order
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
    const purchaseId = parseInt(idParam);

    // Get the purchase order
    const purchase = await prisma.purchaseOrder.findUnique({
      where: { id: purchaseId },
      include: { inventoryItem: true },
    });

    if (!purchase) {
      return new NextResponse("Purchase order not found", { status: 404 });
    }

    if (purchase.status !== "PENDING") {
      return new NextResponse("Purchase order is not pending", { status: 400 });
    }

    // Get current inventory item
    const item = purchase.inventoryItem;
    const before = item.stock;
    const after = before + purchase.quantity;

    // Create stock movement for receiving
    await prisma.stockMovement.create({
      data: {
        inventoryItemId: purchase.inventoryItemId,
        type: "STOCK_IN",
        change: purchase.quantity,
        before,
        after,
        reason: `Purchase received from ${purchase.supplier || "supplier"}`,
        createdById: parseInt(session.user.id ?? "0"),
      },
    });

    // Update inventory item stock
    await prisma.inventoryItem.update({
      where: { id: purchase.inventoryItemId },
      data: {
        stock: after,
        lastPurchaseDate: new Date(),
        unitCost: purchase.unitCost,
      },
    });

    // Create stock purchase record for history
    await prisma.stockPurchase.create({
      data: {
        inventoryItemId: purchase.inventoryItemId,
        quantity: purchase.quantity,
        unitCost: purchase.unitCost,
        totalCost: purchase.quantity * purchase.unitCost,
        supplier: purchase.supplier,
        purchasedById: parseInt(session.user.id ?? "0"),
      },
    });

    // Update purchase order status
    const updatedPurchase = await prisma.purchaseOrder.update({
      where: { id: purchaseId },
      data: {
        status: "RECEIVED",
        receivedAt: new Date(),
      },
      include: {
        inventoryItem: { select: { id: true, name: true } },
        purchasedBy: { select: { name: true } },
      },
    });

    // Update status based on new stock levels
    await updateInventoryStatus(purchase.inventoryItemId);

    return NextResponse.json({
      message: "Purchase order received successfully",
      purchase: updatedPurchase,
    });
  } catch (error) {
    console.error("[PURCHASE_RECEIVE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
