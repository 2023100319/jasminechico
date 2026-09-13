import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET purchase orders (with filtering)
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const itemId = searchParams.get("itemId");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";

    const whereClause: Record<string, unknown> = {};
    if (status) {
      whereClause.status = status;
    }
    if (itemId) {
      whereClause.inventoryItemId = parseInt(itemId);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [purchases, total] = await Promise.all([
      prisma.purchaseOrder.findMany({
        where: whereClause,
        include: {
          inventoryItem: { select: { id: true, name: true } },
          purchasedBy: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit),
      }),
      prisma.purchaseOrder.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      data: purchases,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("[PURCHASES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST a new purchase order
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { inventoryItemId, quantity, unitCost, supplier, expectedDate } = body;

    if (!inventoryItemId || !quantity || unitCost === undefined) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Verify inventory item exists
    const item = await prisma.inventoryItem.findUnique({
      where: { id: parseInt(inventoryItemId) },
    });

    if (!item) {
      return new NextResponse("Inventory item not found", { status: 404 });
    }

    if (quantity <= 0) {
      return new NextResponse("Quantity must be greater than 0", { status: 400 });
    }

    if (unitCost < 0) {
      return new NextResponse("Unit cost cannot be negative", { status: 400 });
    }

    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        inventoryItemId: parseInt(inventoryItemId),
        quantity: parseFloat(quantity),
        unitCost: parseFloat(unitCost),
        supplier: supplier || null,
        expectedDate: expectedDate ? new Date(expectedDate) : null,
        purchasedById: parseInt(session.user.id ?? "0"),
      },
      include: {
        inventoryItem: { select: { id: true, name: true } },
        purchasedBy: { select: { name: true } },
      },
    });

    return NextResponse.json(purchaseOrder);
  } catch (error) {
    console.error("[PURCHASES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
