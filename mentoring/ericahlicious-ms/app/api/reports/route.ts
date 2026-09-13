import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "week"; // day, week, month, year

    // For simplicity, we just return mock aggregated data based on period.
    // In a real scenario, this would aggregate actual orders and daily expenses within the given timeframe.

    let data: { period: string; revenue: number; expenses: number; profit: number; orders: number }[] = [];
    if (period === "week") {
      data = [
        { period: "Mon", revenue: 5000, expenses: 2000, profit: 3000, orders: 45 },
        { period: "Tue", revenue: 6500, expenses: 2200, profit: 4300, orders: 58 },
        { period: "Wed", revenue: 4800, expenses: 1800, profit: 3000, orders: 42 },
        { period: "Thu", revenue: 7200, expenses: 2500, profit: 4700, orders: 65 },
        { period: "Fri", revenue: 9000, expenses: 3000, profit: 6000, orders: 80 },
        { period: "Sat", revenue: 12000, expenses: 4000, profit: 8000, orders: 110 },
        { period: "Sun", revenue: 10500, expenses: 3500, profit: 7000, orders: 95 },
      ];
    } else if (period === "month") {
      data = [
        { period: "Week 1", revenue: 35000, expenses: 15000, profit: 20000, orders: 320 },
        { period: "Week 2", revenue: 38000, expenses: 16000, profit: 22000, orders: 350 },
        { period: "Week 3", revenue: 42000, expenses: 18000, profit: 24000, orders: 380 },
        { period: "Week 4", revenue: 45000, expenses: 20000, profit: 25000, orders: 410 },
      ];
    } else if (period === "year") {
      data = [
        { period: "Jan", revenue: 120000, expenses: 60000, profit: 60000, orders: 1200 },
        { period: "Feb", revenue: 135000, expenses: 65000, profit: 70000, orders: 1350 },
        { period: "Mar", revenue: 150000, expenses: 70000, profit: 80000, orders: 1500 },
        { period: "Apr", revenue: 140000, expenses: 68000, profit: 72000, orders: 1400 },
        { period: "May", revenue: 160000, expenses: 75000, profit: 85000, orders: 1600 },
        { period: "Jun", revenue: 180000, expenses: 80000, profit: 100000, orders: 1800 },
      ];
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[REPORTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
