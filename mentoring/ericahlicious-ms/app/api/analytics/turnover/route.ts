import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET stock turnover analysis
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "30");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all inventory items with sales deduction count
    const items = await prisma.inventoryItem.findMany({
      select: {
        id: true,
        name: true,
        stock: true,
        reorderLevel: true,
        unitCost: true,
        status: true,
        category: {
          select: { name: true },
        },
      },
    });

    // Get movement counts per item (SALES_DEDUCT type)
    const movements = await prisma.stockMovement.groupBy({
      by: ["inventoryItemId"],
      where: {
        type: "SALES_DEDUCT",
        createdAt: { gte: startDate },
      },
      _sum: {
        change: true,
      },
      _count: true,
    });

    // Create a map for quick lookup
    const movementMap = new Map<number, { count: number; totalChange: number }>(
      movements.map((m: any) => [
        m.inventoryItemId,
        { count: m._count, totalChange: Number(m._sum.change ?? 0) },
      ])
    );

    // Build turnover data
    const turnoverData = items
      .map((item: typeof items[number]) => ({
        id: item.id,
        name: item.name,
        category: item.category.name,
        currentStock: item.stock,
        reorderLevel: item.reorderLevel,
        unitCost: item.unitCost,
        salesCount: movementMap.get(item.id)?.count ?? 0,
        totalSalesQty: Math.abs(movementMap.get(item.id)?.totalChange ?? 0),
      }))
      .sort((a: any, b: any) => b.salesCount - a.salesCount);

    // Get top 10 fastest moving
    const topMovers = turnoverData.slice(0, 10);

    // Calculate turnover ratio (sales / current stock)
    const turnoverRatio = topMovers.map((item: typeof turnoverData[number]) => ({
      ...item,
      ratio:
        item.currentStock > 0
          ? (item.totalSalesQty / item.currentStock).toFixed(2)
          : "N/A",
    }));

    return NextResponse.json({
      period: `Last ${days} days`,
      topMovers: turnoverRatio,
      allItems: turnoverData,
    });
  } catch (error) {
    console.error("[TURNOVER_ANALYSIS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
