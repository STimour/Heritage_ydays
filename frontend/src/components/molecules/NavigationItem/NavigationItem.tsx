import React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export interface NavigationItemProps {
  label: string;
  href: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  badge?: string | number;
  collapsed?: boolean;
  onClick?: () => void;
  className?: string;
}

export function NavigationItem({
  label,
  href,
  icon,
  isActive = false,
  badge,
  collapsed = false,
  onClick,
  className,
}: NavigationItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      title={collapsed ? label : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        isActive
          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
          : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800",
        collapsed && "justify-center px-2",
        className
      )}
    >
      {icon && (
        <span className="shrink-0" aria-hidden>
          {icon}
        </span>
      )}
      {!collapsed && <span className="flex-1 truncate">{label}</span>}
      {!collapsed && badge !== undefined && (
        <span className="ml-auto rounded-full bg-neutral-200 px-2 py-0.5 text-xs dark:bg-neutral-700">
          {badge}
        </span>
      )}
    </Link>
  );
}
