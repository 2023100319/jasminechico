import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { TopMenuItems } from "@/components/dashboard/TopMenuItems";
import { InventoryStatus } from "@/components/dashboard/InventoryStatus";
import { DecisionInsights } from "@/components/dashboard/DecisionInsights";
import { DollarSign, ShoppingBag, TrendingUp, Package } from "lucide-react";

export default async function SupervisorDashboard() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = await prisma.order.count({
    where: { createdAt: { gte: today } },
  });

  const totalRevenueData = await prisma.order.aggregate({
    _sum: { total: true },
    where: { isPaid: true, status: "COMPLETED", createdAt: { gte: today } },
  });
  const todayRevenue = Number(totalRevenueData._sum.total || 0);

  const pendingOrders = await prisma.order.count({
    where: { status: "PENDING" },
  });

  const inventoryItems = await prisma.inventoryItem.findMany({
    include: { category: true, updatedBy: { select: { name: true } } },
  });
  const lowStockCount = inventoryItems.filter(
    (i: { status: string }) => i.status === "LOW" || i.status === "OUT_OF_STOCK"
  ).length;
  const lowStockItems = inventoryItems.filter(
    (i: { status: string }) => i.status === "LOW" || i.status === "OUT_OF_STOCK"
  );

  const revenueData = [
    { period: "Mon", revenue: 5000, expenses: 2000, profit: 3000, orders: 45 },
    { period: "Tue", revenue: 6500, expenses: 2200, profit: 4300, orders: 58 },
    { period: "Wed", revenue: 4800, expenses: 1800, profit: 3000, orders: 42 },
    { period: "Thu", revenue: 7200, expenses: 2500, profit: 4700, orders: 65 },
    { period: "Fri", revenue: 9000, expenses: 3000, profit: 6000, orders: 80 },
    { period: "Sat", revenue: 12000, expenses: 4000, profit: 8000, orders: 110 },
    { period: "Sun", revenue: 10500, expenses: 3500, profit: 7000, orders: 95 },
  ];

  const topItems = [
    { name: "Chicken Alfredo Pasta", count: 145, revenue: 40600 },
    { name: "Spanish Latte", count: 120, revenue: 22200 },
    { name: "Filipino Breakfast Danggit", count: 95, revenue: 30400 },
    { name: "Matcha Latte", count: 80, revenue: 15200 },
    { name: "Blueberry Cheesecake", count: 65, revenue: 13000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Supervisor Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Monitor operations and today&apos;s performance</p>
        </div>
        <span className="px-3 py-1.5 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full">
          Supervisor View
        </span>
      </div>

      {/* Stat Cards */}
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
          label="Pending Orders"
          value={pendingOrders}
          icon={TrendingUp}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatCard
          label="Low Stock Items"
          value={lowStockCount}
          icon={Package}
          iconColor="text-red-600"
          iconBg="bg-red-50"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} />
        </div>
        <div>
          <TopMenuItems items={topItems} />
        </div>
      </div>

      {/* Inventory Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InventoryStatus items={inventoryItems} />
        <DecisionInsights lowStockItems={lowStockItems} />
      </div>
    </div>
  );
}
