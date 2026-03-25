/**
 * App Layout - Wraps all protected pages
 */

import { AppShell } from '@/components/organisms/AppShell';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
