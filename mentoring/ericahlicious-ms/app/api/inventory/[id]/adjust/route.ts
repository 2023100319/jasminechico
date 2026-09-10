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

// PATCH: Quick adjustment endpoint
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
    const itemId = parseInt(idParam);
    const body = await req.json();
    const { quantity, type, reason } = body;

    if (quantity === undefined || !type) {
      return new NextResponse("Missing required fields (quantity, type)", { status: 400 });
    }

    const validTypes = ["ADJUSTMENT", "WASTAGE", "EXPIRY"];
    if (!validTypes.includes(type)) {
      return new NextResponse("Invalid adjustment type", { status: 400 });
    }

    // Get current inventory item
    const item = await prisma.inventoryItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return new NextResponse("Inventory item not found", { status: 404 });
    }

    const before = item.stock;
    const change = -Math.abs(quantity); // Always negative for adjustments/wastage/expiry
    const after = before + change;

    if (after < 0) {
      return new NextResponse(
        `Insufficient stock. Current: ${before}, Requested change: ${change}`,
        { status: 400 }
      );
    }

    // Create movement record
    const movement = await prisma.stockMovement.create({
      data: {
        inventoryItemId: itemId,
        type,
        change,
        before,
        after,
        reason: reason || `${type.toLowerCase()} recorded`,
        createdById: parseInt(session.user.id ?? "0"),
      },
      include: {
        inventoryItem: { select: { name: true } },
        createdBy: { select: { name: true } },
      },
    });

    // Update the inventory item stock
    await prisma.inventoryItem.update({
      where: { id: itemId },
      data: { stock: after },
    });

    // Update status based on new stock levels
    await updateInventoryStatus(itemId);

    return NextResponse.json({
      message: "Adjustment recorded successfully",
      movement,
    });
  } catch (error) {
    console.error("[ADJUST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
