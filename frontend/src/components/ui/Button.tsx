import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
