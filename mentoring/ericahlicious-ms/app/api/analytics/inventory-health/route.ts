import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET inventory health metrics
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get stock status distribution
    const statusCounts = await prisma.inventoryItem.groupBy({
      by: ["status"],
      _count: true,
    });

    // Get detailed items in each status
    const items = await prisma.inventoryItem.findMany({
      select: {
        id: true,
        name: true,
        stock: true,
        reorderLevel: true,
        status: true,
        category: {
          select: { name: true },
        },
      },
    });

    // Count items by status
    const distribution = {
      GOOD: 0,
      LOW: 0,
      OUT_OF_STOCK: 0,
    };

    statusCounts.forEach((count) => {
      distribution[count.status as keyof typeof distribution] = count._count;
    });

    // Get items below reorder level
    const lowStockItems = items.filter(
      (item) => item.stock <= item.reorderLevel
    );

    // Get out of stock items
    const outOfStockItems = items.filter((item) => item.stock <= 0);

    return NextResponse.json({
      distribution,
      totalItems: items.length,
      lowStockItems: lowStockItems.map((item) => ({
        id: item.id,
        name: item.name,
        current: item.stock,
        reorderLevel: item.reorderLevel,
        suggested: Math.ceil(item.reorderLevel * 2.5),
        category: item.category.name,
      })),
      outOfStockItems: outOfStockItems.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category.name,
      })),
    });
  } catch (error) {
    console.error("[INVENTORY_HEALTH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
