import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET cost analysis
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

    // Get all stock purchases in the date range
    const purchases = await prisma.stockPurchase.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      include: {
        inventoryItem: {
          select: {
            id: true,
            name: true,
            category: {
              select: { name: true },
            },
          },
        },
      },
    });

    // Group by category
    const costByCategory = new Map<
      string,
      {
        category: string;
        totalCost: number;
        itemCount: number;
        purchaseCount: number;
        items: Array<{
          itemId: number;
          name: string;
          totalCost: number;
          quantity: number;
          avgUnitCost: number;
        }>;
      }
    >();

    purchases.forEach((purchase) => {
      const category = purchase.inventoryItem.category.name;

      if (!costByCategory.has(category)) {
        costByCategory.set(category, {
          category,
          totalCost: 0,
          itemCount: 0,
          purchaseCount: 0,
          items: [],
        });
      }

      const catData = costByCategory.get(category)!;
      catData.totalCost += Number(purchase.totalCost);
      catData.purchaseCount += 1;

      // Check if item already exists in items array
      const existingItem = catData.items.find(
        (i) => i.itemId === purchase.inventoryItem.id
      );
      if (existingItem) {
        existingItem.totalCost += Number(purchase.totalCost);
        existingItem.quantity += Number(purchase.quantity);
        existingItem.avgUnitCost = existingItem.totalCost / existingItem.quantity;
      } else {
        catData.items.push({
          itemId: purchase.inventoryItem.id,
          name: purchase.inventoryItem.name,
          totalCost: Number(purchase.totalCost),
          quantity: Number(purchase.quantity),
          avgUnitCost: Number(purchase.unitCost),
        });
        catData.itemCount += 1;
      }
    });

    const categoryData = Array.from(costByCategory.values()).sort(
      (a, b) => b.totalCost - a.totalCost
    );

    // Calculate total spending
    const totalSpending = categoryData.reduce((sum, cat) => sum + cat.totalCost, 0);

    // Get top 10 most expensive items
    const allItems = categoryData.flatMap((cat) => cat.items);
    const topExpensive = allItems
      .sort((a, b) => b.totalCost - a.totalCost)
      .slice(0, 10);

    return NextResponse.json({
      period: `Last ${days} days`,
      totalSpending: Number(totalSpending.toFixed(2)),
      byCategory: categoryData.map((cat) => ({
        ...cat,
        totalCost: Number(cat.totalCost.toFixed(2)),
        items: cat.items.map((item) => ({
          ...item,
          totalCost: Number(item.totalCost.toFixed(2)),
          avgUnitCost: Number(item.avgUnitCost.toFixed(2)),
        })),
      })),
      topExpensiveItems: topExpensive.map((item) => ({
        ...item,
        totalCost: Number(item.totalCost.toFixed(2)),
        avgUnitCost: Number(item.avgUnitCost.toFixed(2)),
      })),
    });
  } catch (error) {
    console.error("[COSTS_ANALYSIS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
