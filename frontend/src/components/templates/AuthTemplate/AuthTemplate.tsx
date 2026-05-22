import React from "react";
import { cn } from "@/lib/cn";

export interface AuthTemplateProps {
  children: React.ReactNode;
  brand?: React.ReactNode;
  illustration?: React.ReactNode;
  className?: string;
}

/**
 * AuthTemplate — centered form on the left, optional illustration on the right.
 * No business logic; purely structural.
 */
export function AuthTemplate({
  children,
  brand,
  illustration,
  className,
}: AuthTemplateProps) {
  return (
    <div className={cn("flex min-h-screen", className)}>
      {/* Form side */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-20 xl:px-24">
        {brand && (
          <div className="mb-10" aria-label="Brand">
            {brand}
          </div>
        )}
        <main id="main-content" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
      </div>

      {/* Illustration side */}
      {illustration && (
        <div
          aria-hidden
          className="relative hidden flex-1 lg:block bg-neutral-100 dark:bg-neutral-900"
        >
          {illustration}
        </div>
      )}
    </div>
  );
}
