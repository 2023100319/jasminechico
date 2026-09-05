import { cn } from "@/lib/utils";
import type { Role } from "@/types";
import { ROLE_COLORS, ROLE_LABELS } from "@/types";

interface UserRoleBadgeProps {
  role: Role;
  className?: string;
}

export function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase inline-flex items-center justify-center",
        ROLE_COLORS[role],
        className
      )}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}
