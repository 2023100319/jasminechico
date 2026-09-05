import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";
import { ORDER_STATUS_COLORS } from "@/types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase inline-flex items-center justify-center",
        ORDER_STATUS_COLORS[status],
        className
      )}
    >
      {status}
    </span>
  );
}
