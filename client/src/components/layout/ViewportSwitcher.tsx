'use client';

import React from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface ViewportSwitcherProps {
  viewMode: 'auto' | 'mobile' | 'web';
  setViewMode: (mode: 'auto' | 'mobile' | 'web') => void;
}

export const ViewportSwitcher: React.FC<ViewportSwitcherProps> = ({ viewMode, setViewMode }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1 bg-[#141417]/90 border border-zinc-800 backdrop-blur-md p-1.5 rounded-full shadow-2xl">
      <button
        onClick={() => setViewMode('auto')}
        className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
          viewMode === 'auto' ? 'bg-[#CCFF00] text-black' : 'text-zinc-400 hover:text-white'
        }`}
      >
        Auto Responsive
      </button>
      <button
        onClick={() => setViewMode('mobile')}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
          viewMode === 'mobile' ? 'bg-[#CCFF00] text-black' : 'text-zinc-400 hover:text-white'
        }`}
      >
        <Smartphone className="w-3.5 h-3.5" />
        Mobile View
      </button>
      <button
        onClick={() => setViewMode('web')}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
          viewMode === 'web' ? 'bg-[#CCFF00] text-black' : 'text-zinc-400 hover:text-white'
        }`}
      >
        <Monitor className="w-3.5 h-3.5" />
        Web View
      </button>
    </div>
  );
};
