'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

export default function GoBack({ title = 'Back', subtitle = '' }) {
  const router = useRouter();

  return (
    <div className="sticky top-0 left-0 right-0 z-50 bg-[rgba(0,0,0,0.7)] backdrop-blur-md px-2 py-2">
      <div className="flex items-center gap-5">
        <Button variant="outline" size="icon" className="border-none w-[30px] h-[30px] p-3 rounded-full hover:bg-gray-900" onClick={() => router.back()}>
          <ArrowLeft className="text-[var(--white)]" />
        </Button>
        <div className="flex flex-col">
          <p className="text-base font-semibold text-[var(--white)]">{title}</p>
          {subtitle && <p className="text-xs text-[var(--textSubtitle)]">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
