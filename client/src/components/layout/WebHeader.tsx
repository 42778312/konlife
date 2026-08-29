'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';

export const WebHeader: React.FC = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/discover', label: 'Discover' },
    { href: '/weekend', label: 'Weekend' },
    { href: '/saved', label: 'Saved' },
  ];

  return (
    <header className="w-full bg-[#080809]/95 border-b border-zinc-800/80 sticky top-0 z-40 backdrop-blur-md px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-3xl font-black tracking-wider text-white hover:text-[#CCFF00] transition-colors">
            KONSTANZ
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 font-medium text-base transition-colors ${
                  isActive ? 'text-[#CCFF00]' : 'text-zinc-300 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#CCFF00] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <button className="text-zinc-300 hover:text-[#CCFF00] transition-colors p-2">
          <Search className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
