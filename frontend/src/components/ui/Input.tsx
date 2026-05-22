import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm", props.className)} />;
}
