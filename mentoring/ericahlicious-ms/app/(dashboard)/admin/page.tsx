import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { TopMenuItems } from "@/components/dashboard/TopMenuItems";
import { DollarSign, ShoppingBag, TrendingUp, Users } from "lucide-react";

export default async function AdminDashboard() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Stats
  const todayOrders = await prisma.order.count({
    where: { createdAt: { gte: today } },
  });
  
  const totalRevenueData = await prisma.order.aggregate({
    _sum: { total: true },
    where: { isPaid: true, status: "COMPLETED", createdAt: { gte: today } }
  });
  const todayRevenue = Number(totalRevenueData._sum.total || 0);

  const activeUsers = await prisma.user.count({
    where: { status: "ACTIVE" }
  });

  // Real data for charts (Last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const recentOrders = await prisma.order.findMany({
    where: { status: "COMPLETED", isPaid: true, createdAt: { gte: sevenDaysAgo } },
    select: { createdAt: true, total: true },
  });

  const recentExpenses = await prisma.dailyExpense.findMany({
    where: { date: { gte: sevenDaysAgo } },
    select: { date: true, amount: true },
  });

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const revenueMap = new Map();
  
  // Initialize last 7 days
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    const label = daysOfWeek[d.getDay()];
    revenueMap.set(label, { period: label, revenue: 0, expenses: 0, profit: 0, orders: 0, date: d });
  }

  recentOrders.forEach((o) => {
    const label = daysOfWeek[o.createdAt.getDay()];
    if (revenueMap.has(label)) {
      const entry = revenueMap.get(label);
      entry.revenue += Number(o.total);
      entry.orders += 1;
    }
  });

  recentExpenses.forEach((e) => {
    const label = daysOfWeek[e.date.getDay()];
    if (revenueMap.has(label)) {
      revenueMap.get(label).expenses += Number(e.amount);
    }
  });

  const revenueData = Array.from(revenueMap.values()).map(e => {
    const profit = e.revenue - e.expenses;
    return {
      period: e.period,
      revenue: e.revenue,
      expenses: e.expenses,
      profit: profit,
      orders: e.orders
    };
  });

  // Top Items
  const topOrderItems = await prisma.orderItem.groupBy({
    by: ['menuItemId'],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 5,
  });

  const topItems = [];
  for (const item of topOrderItems) {
    const menuItem = await prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
    if (menuItem) {
      topItems.push({
        name: menuItem.name,
        count: item._sum.quantity || 0,
        revenue: Number(menuItem.price) * (item._sum.quantity || 0),
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-sm text-slate-500">Overview of today&apos;s performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Today's Revenue"
          value={`₱${todayRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 12.5, label: "vs yesterday" }}
          iconColor="text-green-600"
          iconBg="bg-green-50"
        />
        <StatCard
          label="Orders Today"
          value={todayOrders}
          icon={ShoppingBag}
          trend={{ value: 5.2, label: "vs yesterday" }}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          label="Avg. Order Value"
          value={`₱${todayOrders > 0 ? Math.round(todayRevenue / todayOrders).toLocaleString() : 0}`}
          icon={TrendingUp}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
        <StatCard
          label="Active Staff"
          value={activeUsers}
          icon={Users}
          iconColor="text-orange-600"
          iconBg="bg-orange-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} />
        </div>
        <div>
          <TopMenuItems items={topItems} />
        </div>
      </div>
    </div>
  );
}
