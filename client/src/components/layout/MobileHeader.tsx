'use client';

import React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

export const MobileHeader: React.FC = () => {
  return (
    <header className="w-full bg-[#080809] border-b border-zinc-900 px-4 py-3 sticky top-0 z-40 flex items-center justify-between">
      {/* Brand Logo */}
      <Link href="/" className="font-display text-3xl font-black text-[#CCFF00] tracking-wider">
        KONSTANZ
      </Link>

      <button className="p-2 text-zinc-300 hover:text-white">
        <Search className="w-5 h-5" />
      </button>
    </header>
  );
};
