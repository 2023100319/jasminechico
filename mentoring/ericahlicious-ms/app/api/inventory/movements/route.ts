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

// GET all stock movements for an item (with pagination and filtering)
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("itemId");
    const type = searchParams.get("type");
    const days = searchParams.get("days") || "30";
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";

    const whereClause: Record<string, unknown> = {};
    if (itemId) {
      whereClause.inventoryItemId = parseInt(itemId);
    }
    if (type) {
      whereClause.type = type;
    }

    // Filter by date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    whereClause.createdAt = { gte: startDate };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [movements, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where: whereClause,
        include: {
          inventoryItem: { select: { name: true } },
          createdBy: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit),
      }),
      prisma.stockMovement.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      data: movements,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("[MOVEMENTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST a new stock movement
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { inventoryItemId, type, change, reason } = body;

    if (!inventoryItemId || !type || change === undefined) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    if (!["STOCK_IN", "ADJUSTMENT", "WASTAGE", "EXPIRY", "SALES_DEDUCT"].includes(type)) {
      return new NextResponse("Invalid movement type", { status: 400 });
    }

    // Get current inventory item
    const item = await prisma.inventoryItem.findUnique({
      where: { id: parseInt(inventoryItemId) },
    });

    if (!item) {
      return new NextResponse("Inventory item not found", { status: 404 });
    }

    const before = item.stock;
    const after = before + change;

    // Prevent negative stock for most types (allow for SALES_DEDUCT to show debt)
    if (change > 0) {
      // Stock in operations always allowed
    } else if (after < 0 && type !== "SALES_DEDUCT") {
      return new NextResponse(
        `Insufficient stock. Current: ${before}, Requested change: ${change}`,
        { status: 400 }
      );
    }

    // Create the movement record
    const movement = await prisma.stockMovement.create({
      data: {
        inventoryItemId: parseInt(inventoryItemId),
        type,
        change,
        before,
        after,
        reason: reason || null,
        createdById: parseInt(session.user.id ?? "0"),
      },
      include: {
        inventoryItem: { select: { name: true } },
        createdBy: { select: { name: true } },
      },
    });

    // Update the inventory item stock
    await prisma.inventoryItem.update({
      where: { id: parseInt(inventoryItemId) },
      data: { stock: after },
    });

    // Update status based on new stock levels
    await updateInventoryStatus(parseInt(inventoryItemId));

    return NextResponse.json(movement);
  } catch (error) {
    console.error("[MOVEMENTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
