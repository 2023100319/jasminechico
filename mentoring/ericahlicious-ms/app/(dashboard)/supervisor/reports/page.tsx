"use client";

import { useState, useEffect, useCallback } from "react";
import { ReportFilterBar } from "@/components/reports/ReportFilterBar";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { TopMenuItems } from "@/components/dashboard/TopMenuItems";
import { StatCard } from "@/components/dashboard/StatCard";
import { DollarSign, ShoppingBag, TrendingUp, TrendingDown, Download, Printer } from "lucide-react";
import type { ReportData } from "@/types";

interface ReportStats {
  revenue: number;
  expenses: number;
  profit: number;
  orders: number;
}

export default function SupervisorReportsPage() {
  const [period, setPeriod] = useState<"day" | "week" | "month" | "year">("week");
  const [chartData, setChartData] = useState<ReportData[]>([]);
  const [stats, setStats] = useState<ReportStats>({ revenue: 0, expenses: 0, profit: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  const topItems = [
    { name: "Chicken Alfredo Pasta", count: 145, revenue: 40600 },
    { name: "Spanish Latte", count: 120, revenue: 22200 },
    { name: "Filipino Breakfast Danggit", count: 95, revenue: 30400 },
    { name: "Matcha Latte", count: 80, revenue: 15200 },
    { name: "Blueberry Cheesecake", count: 65, revenue: 13000 },
  ];

  const loadReport = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reports?period=${period}`);
      if (!res.ok) throw new Error("Failed to load report");
      const data = await res.json();
      setChartData(data);

      // Aggregate totals
      const totals = (data as ReportData[]).reduce(
        (acc, row) => ({
          revenue: acc.revenue + row.revenue,
          expenses: acc.expenses + row.expenses,
          profit: acc.profit + row.profit,
          orders: acc.orders + row.orders,
        }),
        { revenue: 0, expenses: 0, profit: 0, orders: 0 }
      );
      setStats(totals);
    } catch {
      console.error("Failed to load report");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const handlePrint = () => window.print();

  const handleDownload = () => {
    const rows = [
      ["Period", "Revenue", "Expenses", "Profit", "Orders"],
      ...chartData.map((d) => [d.period, d.revenue, d.expenses, d.profit, d.orders]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ericahlicious-report-${period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="text-sm text-slate-500 mt-0.5">Revenue, expenses, and performance analytics</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 flex items-center gap-2 text-sm font-medium transition-all"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl flex items-center gap-2 text-sm font-medium transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download CSV
          </button>
        </div>
      </div>

      {/* Period filter */}
      <ReportFilterBar period={period} onPeriodChange={setPeriod} />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Revenue"
          value={`₱${stats.revenue.toLocaleString()}`}
          icon={DollarSign}
          iconColor="text-green-600"
          iconBg="bg-green-50"
        />
        <StatCard
          label="Total Expenses"
          value={`₱${stats.expenses.toLocaleString()}`}
          icon={TrendingDown}
          iconColor="text-red-500"
          iconBg="bg-red-50"
        />
        <StatCard
          label="Net Profit"
          value={`₱${stats.profit.toLocaleString()}`}
          icon={TrendingUp}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          label="Total Orders"
          value={stats.orders}
          icon={ShoppingBag}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
        />
      </div>

      {/* Charts */}
      {loading ? (
        <div className="h-64 bg-white rounded-2xl border border-slate-100 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart data={chartData} />
          </div>
          <div>
            <TopMenuItems items={topItems} />
          </div>
        </div>
      )}

      {/* Profit margin note */}
      <div className="bg-gradient-to-r from-violet-50 to-blue-50 border border-violet-100 rounded-2xl p-5">
        <p className="text-sm font-semibold text-violet-900 mb-1">Profit Margin</p>
        <p className="text-3xl font-bold text-violet-700">
          {stats.revenue > 0 ? ((stats.profit / stats.revenue) * 100).toFixed(1) : "0.0"}%
        </p>
        <p className="text-xs text-violet-500 mt-1">
          Net profit ÷ total revenue for the selected period
        </p>
      </div>
    </div>
  );
}
