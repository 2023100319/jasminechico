import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { TopMenuItems } from "@/components/dashboard/TopMenuItems";
import { InventoryStatus } from "@/components/dashboard/InventoryStatus";
import { DecisionInsights } from "@/components/dashboard/DecisionInsights";
import { StockHealthWidget } from "@/components/dashboard/StockHealthWidget";
import { TurnoverWidget } from "@/components/dashboard/TurnoverWidget";
import { CostAnalysisWidget } from "@/components/dashboard/CostAnalysisWidget";
import { ReorderRecommendationsWidget } from "@/components/dashboard/ReorderRecommendationsWidget";
import { DollarSign, ShoppingBag, TrendingUp, Users } from "lucide-react";

export default async function OwnerDashboard() {
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

  // Mock data for charts
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

  const inventoryItems = await prisma.inventoryItem.findMany({
    include: { category: true, updatedBy: { select: { name: true } } }
  });
  const lowStockItems = inventoryItems.filter((i: { status: string }) => i.status === "LOW" || i.status === "OUT_OF_STOCK");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Owner Dashboard</h1>
        <p className="text-sm text-slate-500">Overview of today's performance</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InventoryStatus items={inventoryItems} />
        <DecisionInsights lowStockItems={lowStockItems} />
      </div>

      {/* Decision Support Analytics Section */}
      <div className="mt-8 pt-8 border-t border-slate-200">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Decision Support Analytics</h2>
          <p className="text-sm text-slate-500 mt-1">Inventory insights and recommendations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StockHealthWidget />
          <TurnoverWidget />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <CostAnalysisWidget />
          <ReorderRecommendationsWidget />
        </div>
      </div>
    </div>
  );
}
