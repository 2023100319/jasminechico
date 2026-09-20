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
    const period = searchParams.get("period") || "week"; // day, week, month, year

    let data: { period: string; revenue: number; expenses: number; profit: number; orders: number }[] = [];
    
    const now = new Date();
    let startDate = new Date();
    
    if (period === "week") {
      startDate.setDate(now.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
    } else if (period === "month") {
      startDate.setDate(now.getDate() - 29);
      startDate.setHours(0, 0, 0, 0);
    } else if (period === "year") {
      startDate.setMonth(now.getMonth() - 11);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
    } else if (period === "day") {
      startDate.setHours(0, 0, 0, 0);
    }

    const orders = await prisma.order.findMany({
      where: { status: "COMPLETED", isPaid: true, createdAt: { gte: startDate } },
      select: { createdAt: true, total: true },
    });

    const expenses = await prisma.dailyExpense.findMany({
      where: { date: { gte: startDate } },
      select: { date: true, amount: true },
    });

    const periodMap = new Map();

    if (period === "day") {
      for (let i = 0; i < 24; i++) {
        const label = `${i.toString().padStart(2, '0')}:00`;
        periodMap.set(label, { period: label, revenue: 0, expenses: 0, profit: 0, orders: 0 });
      }
      orders.forEach(o => {
        const label = `${o.createdAt.getHours().toString().padStart(2, '0')}:00`;
        if (periodMap.has(label)) {
          periodMap.get(label).revenue += Number(o.total);
          periodMap.get(label).orders += 1;
        }
      });
      expenses.forEach(e => {
        const label = `${e.date.getHours().toString().padStart(2, '0')}:00`;
        if (periodMap.has(label)) {
          periodMap.get(label).expenses += Number(e.amount);
        }
      });
    } else if (period === "year") {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const label = `${months[d.getMonth()]} ${d.getFullYear()}`;
        periodMap.set(label, { period: label, revenue: 0, expenses: 0, profit: 0, orders: 0 });
      }
      orders.forEach(o => {
        const label = `${months[o.createdAt.getMonth()]} ${o.createdAt.getFullYear()}`;
        if (periodMap.has(label)) {
          periodMap.get(label).revenue += Number(o.total);
          periodMap.get(label).orders += 1;
        }
      });
      expenses.forEach(e => {
        const label = `${months[e.date.getMonth()]} ${e.date.getFullYear()}`;
        if (periodMap.has(label)) {
          periodMap.get(label).expenses += Number(e.amount);
        }
      });
    } else {
      // week and month (Group by day)
      const numDays = period === "week" ? 7 : 30;
      for (let i = numDays - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const label = `${d.getMonth()+1}/${d.getDate()}`;
        periodMap.set(label, { period: label, revenue: 0, expenses: 0, profit: 0, orders: 0 });
      }
      orders.forEach(o => {
        const label = `${o.createdAt.getMonth()+1}/${o.createdAt.getDate()}`;
        if (periodMap.has(label)) {
          periodMap.get(label).revenue += Number(o.total);
          periodMap.get(label).orders += 1;
        }
      });
      expenses.forEach(e => {
        const label = `${e.date.getMonth()+1}/${e.date.getDate()}`;
        if (periodMap.has(label)) {
          periodMap.get(label).expenses += Number(e.amount);
        }
      });
    }
    
    data = Array.from(periodMap.values()).map(e => ({
      period: e.period,
      revenue: e.revenue,
      expenses: e.expenses,
      profit: e.revenue - e.expenses,
      orders: e.orders
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("[REPORTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
