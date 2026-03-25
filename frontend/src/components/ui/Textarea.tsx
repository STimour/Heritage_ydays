import { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn("w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm", props.className)} />;
}
