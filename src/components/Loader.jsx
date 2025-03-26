import { Loader2 } from 'lucide-react';
import React from 'react';

export default function Loader() {
  return (
    <div className="flex w-full justify-center mt-5">
      <Loader2 className="w-6 h-6 text-sky-500 animate-spin" />
    </div>
  );
}
