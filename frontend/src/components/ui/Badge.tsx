export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700">{children}</span>;
}
