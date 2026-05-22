'use client';

import ToastContainer from '@/components/ui/ToastContainer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}
