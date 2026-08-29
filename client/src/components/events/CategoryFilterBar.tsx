'use client';

import React from 'react';
import { CATEGORIES } from '@/data/mockEvents';
import { GraduationCap, PartyPopper, Building2, Utensils, Music, Globe } from 'lucide-react';

interface CategoryFilterBarProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

const ICON_MAP = {
  GraduationCap: GraduationCap,
  PartyPopper: PartyPopper,
  Building2: Building2,
  Utensils: Utensils,
  Music: Music,
  Globe: Globe,
};

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-2">
      {CATEGORIES.map((cat) => {
        const IconComponent = ICON_MAP[cat.icon as keyof typeof ICON_MAP] || Globe;
        const isActive = activeCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              isActive
                ? 'bg-[#CCFF00] text-black border-[#CCFF00] shadow-lg shadow-[#CCFF00]/20'
                : 'bg-[#141417] text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white'
            }`}
          >
            <IconComponent className="w-3.5 h-3.5" />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
