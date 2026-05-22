import React from "react";
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/atoms/Avatar";

export interface UserInfoRowProps {
  name: string;
  username?: string;
  info?: string;
  avatarUrl?: string;
  size?: "sm" | "md";
  className?: string;
  onClick?: () => void;
}

export function UserInfoRow({
  name,
  username,
  info,
  avatarUrl,
  size = "md",
  className,
  onClick,
}: UserInfoRowProps) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      className={cn(
        "flex items-center gap-3",
        onClick &&
          "cursor-pointer rounded-md p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors",
        className
      )}
    >
      <Avatar
        src={avatarUrl}
        name={name}
        size={size === "sm" ? "sm" : "md"}
      />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "font-medium text-neutral-900 dark:text-neutral-100 truncate",
            size === "sm" ? "text-sm" : "text-base"
          )}
        >
          {name}
        </p>
        {(username ?? info) && (
          <p
            className={cn(
              "text-neutral-500 dark:text-neutral-400 truncate",
              size === "sm" ? "text-xs" : "text-sm"
            )}
          >
            {info ?? (username ? `@${username}` : null)}
          </p>
        )}
      </div>
    </div>
  );
}
