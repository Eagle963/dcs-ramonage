'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/calendrier');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-secondary-500">Redirection...</div>
    </div>
  );
}
