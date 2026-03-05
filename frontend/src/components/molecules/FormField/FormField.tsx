import React, { useId } from "react";
import { cn } from "@/lib/cn";
import { Label } from "@/components/atoms/Label";
import { Input, type InputProps } from "@/components/atoms/Input";

export interface FormFieldProps extends Omit<InputProps, "id"> {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
}

export function FormField({
  label,
  error,
  hint,
  required,
  className,
  ...inputProps
}: FormFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>

      <Input
        id={id}
        isError={!!error}
        aria-describedby={
          error ? errorId : hint ? hintId : undefined
        }
        aria-invalid={!!error}
        aria-required={required}
        {...inputProps}
      />

      {error ? (
        <p id={errorId} role="alert" className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-neutral-500 dark:text-neutral-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
