'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Search } from 'lucide-react';

export const MobileHeader: React.FC = () => {
  return (
    <header className="w-full bg-[#080809] border-b border-zinc-900 px-4 py-3 sticky top-0 z-40 flex items-center justify-between">
      {/* Brand Logo */}
      <Link href="/" className="font-display text-3xl font-black text-[#CCFF00] tracking-wider">
        KONSTANZ
      </Link>

      {/* Location & Actions */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 text-xs font-semibold px-2.5 py-1.5 rounded-full text-zinc-200">
          <MapPin className="w-3.5 h-3.5 text-[#CCFF00]" />
          <span>Konstanz</span>
        </button>

        <button className="p-2 text-zinc-300 hover:text-white">
          <Search className="w-5 h-5" />
        </button>

        <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-700">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};
