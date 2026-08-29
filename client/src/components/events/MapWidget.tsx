'use client';

import React from 'react';
import { MapPin, ChevronRight, ExternalLink } from 'lucide-react';

interface MapWidgetProps {
  venueName?: string;
  cityName?: string;
  interactive?: boolean;
}

export const MapWidget: React.FC<MapWidgetProps> = ({
  venueName = 'Blechnerei',
  cityName = 'Konstanz',
  interactive = true,
}) => {
  return (
    <div className="relative w-full h-[260px] rounded-3xl overflow-hidden bg-[#0e0e11] border border-zinc-800 shadow-xl group">
      {/* Dark Map Vector Simulation Canvas */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(204, 255, 0, 0.08) 0%, transparent 60%),
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 30px 30px, 30px 30px',
        }}
      >
        {/* Simulated Map Streets & River */}
        <svg className="w-full h-full text-zinc-800/80 stroke-current fill-none stroke-[2]">
          <path d="M 0 100 Q 200 120 400 90 T 800 140 T 1200 100" className="text-zinc-700/60 stroke-[8]" />
          <path d="M 120 0 L 140 300" />
          <path d="M 320 0 L 300 300" />
          <path d="M 550 0 L 580 300" />
          <path d="M 800 0 L 760 300" />
          <path d="M 0 180 L 1000 190" />
        </svg>
      </div>

      {/* Neon Map Pins */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <MapPin className="w-7 h-7 text-[#CCFF00] fill-[#CCFF00]/30 drop-shadow-[0_0_8px_rgba(204,255,0,0.8)]" />
        <span className="text-[10px] font-bold text-zinc-400 mt-0.5 bg-black/80 px-1.5 py-0.5 rounded border border-zinc-800">
          Döbele
        </span>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 scale-110">
        <MapPin className="w-8 h-8 text-[#CCFF00] fill-[#CCFF00] drop-shadow-[0_0_12px_rgba(204,255,0,1)] animate-bounce" />
        <span className="text-xs font-black text-white bg-black/90 px-2 py-0.5 rounded-md border border-[#CCFF00]/50 tracking-wide mt-1">
          {cityName}
        </span>
      </div>

      <div className="absolute bottom-1/4 right-1/3 flex flex-col items-center">
        <MapPin className="w-6 h-6 text-[#CCFF00] fill-[#CCFF00]/30 drop-shadow-[0_0_6px_rgba(204,255,0,0.6)]" />
        <span className="text-[10px] font-bold text-zinc-400 mt-0.5 bg-black/80 px-1.5 py-0.5 rounded border border-zinc-800">
          Petershausen
        </span>
      </div>

      {/* Overlay Venue Card (Right side floating preview) */}
      {interactive && (
        <div className="absolute bottom-4 right-4 bg-[#141417]/95 backdrop-blur-md border border-zinc-800 p-3.5 rounded-2xl flex items-center gap-3.5 shadow-2xl max-w-sm">
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
            <img
              src="https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?auto=format&fit=crop&w=150&q=80"
              alt={venueName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">{venueName}</h4>
            <p className="text-xs text-zinc-400">Popular · 3 upcoming events</p>
            <button className="flex items-center gap-1 text-xs font-extrabold text-[#CCFF00] hover:underline mt-1.5">
              <span>View venue</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
