import React from "react";
import { cn } from "@/lib/cn";

type TitleLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: TitleLevel;
  as?: React.ElementType;
}

export interface SubtitleProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: React.ElementType;
}

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: React.ElementType;
  size?: "xs" | "sm" | "base" | "lg";
  muted?: boolean;
  truncate?: boolean;
}

const titleSizes: Record<TitleLevel, string> = {
  1: "text-4xl font-bold tracking-tight",
  2: "text-3xl font-bold tracking-tight",
  3: "text-2xl font-semibold",
  4: "text-xl font-semibold",
  5: "text-lg font-semibold",
  6: "text-base font-semibold",
};

export function Title({ level = 1, as, className, children, ...props }: TitleProps) {
  const Tag = as ?? (`h${level}` as React.ElementType);
  return (
    <Tag
      className={cn(
        "text-neutral-900 dark:text-neutral-100",
        titleSizes[level],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function Subtitle({ as: Tag = "p", className, children, ...props }: SubtitleProps) {
  return (
    <Tag
      className={cn(
        "text-lg font-medium text-neutral-600 dark:text-neutral-400",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

const textSizeStyles = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
};

export function Text({
  as: Tag = "p",
  size = "base",
  muted = false,
  truncate = false,
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Tag
      className={cn(
        "leading-relaxed",
        textSizeStyles[size],
        muted
          ? "text-neutral-500 dark:text-neutral-400"
          : "text-neutral-700 dark:text-neutral-300",
        truncate && "truncate",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
