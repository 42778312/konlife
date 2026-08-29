'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Calendar, Bookmark } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/discover', label: 'Discover', icon: Compass },
    { href: '/weekend', label: 'Weekend', icon: Calendar },
    { href: '/saved', label: 'Saved', icon: Bookmark },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#080809]/95 border-t border-zinc-800/80 backdrop-blur-lg px-3 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          if (isActive) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-0.5 bg-[#CCFF00] text-black px-4 py-1.5 rounded-full transition-all"
              >
                <Icon className="w-5 h-5 stroke-[2.5]" />
                <span className="text-[10px] font-extrabold tracking-wide uppercase">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 text-zinc-400 hover:text-white px-3 py-1 transition-colors"
            >
              <Icon className="w-5 h-5 stroke-[1.8]" />
              <span className="text-[11px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
