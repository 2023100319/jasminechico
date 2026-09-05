"use client";

import { cn } from "@/lib/utils";

interface ReportFilterBarProps {
  period: "day" | "week" | "month" | "year";
  onPeriodChange: (period: "day" | "week" | "month" | "year") => void;
}

const periods = [
  { id: "day", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "year", label: "This Year" },
] as const;

export function ReportFilterBar({ period, onPeriodChange }: ReportFilterBarProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-1.5 inline-flex">
      {periods.map((p) => (
        <button
          key={p.id}
          onClick={() => onPeriodChange(p.id)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            period === p.id
              ? "bg-blue-50 text-blue-700 shadow-sm"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
