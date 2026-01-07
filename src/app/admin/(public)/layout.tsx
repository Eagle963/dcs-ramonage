'use client';

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function PublicWidgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-secondary-50 to-white ${inter.className}`}>
      {children}
    </div>
  );
}
