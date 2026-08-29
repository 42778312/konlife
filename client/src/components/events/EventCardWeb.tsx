'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Bookmark } from 'lucide-react';
import { EventItem } from '@/data/mockEvents';

interface EventCardWebProps {
  event: EventItem;
  variant?: 'hero' | 'grid' | 'compact';
}

export const EventCardWeb: React.FC<EventCardWebProps> = ({ event, variant = 'grid' }) => {
  // HERO BANNER VARIANT (Desktop Home Top Banner)
  if (variant === 'hero') {
    return (
      <div className="relative w-full h-[340px] rounded-3xl overflow-hidden border border-zinc-800/80 group">
        <img
          src={event.image}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 p-8 flex flex-col justify-end max-w-xl">
          <span className="text-[#CCFF00] font-bold text-xs tracking-widest uppercase mb-2">
            TONIGHT · FRIDAY
          </span>
          <h1 className="font-display text-5xl font-black tracking-wide text-white mb-2">
            {event.title}
          </h1>
          <p className="text-zinc-300 font-medium text-lg mb-6">
            {event.venue} · {event.time}
          </p>

          <div className="flex items-center gap-3">
            <Link
              href={`/event/${event.id}`}
              className="bg-[#CCFF00] text-black font-extrabold px-5 py-2.5 rounded-xl hover:bg-[#b8e600] transition-colors text-sm"
            >
              {event.price}
            </Link>
            <button className="flex items-center gap-2 bg-black/60 border border-zinc-700 backdrop-blur-md text-white font-semibold px-4 py-2.5 rounded-xl hover:border-[#CCFF00] transition-colors text-sm">
              <Bookmark className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // COMPACT VARIANT (Desktop Home "Popular" Grid Card)
  if (variant === 'compact') {
    return (
      <Link
        href={`/event/${event.id}`}
        className="flex items-center gap-4 bg-[#141417] border border-zinc-800/70 p-3 rounded-2xl hover:border-zinc-700 hover:bg-[#1a1a1f] transition-all group"
      >
        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-base truncate group-hover:text-[#CCFF00] transition-colors">
            {event.title}
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            {event.venue} · {event.time}
          </p>
          {event.tags.length > 0 && (
            <div className="mt-2.5">
              <span className="inline-block text-[11px] font-semibold text-zinc-300 bg-zinc-800/80 px-2.5 py-0.5 rounded-md border border-zinc-700/60">
                {event.tags[0]}
              </span>
            </div>
          )}
        </div>
      </Link>
    );
  }

  // STANDARD GRID VARIANT (Desktop Home "This Weekend" & Discover Grid)
  return (
    <div className="relative bg-[#141417] border border-zinc-800/70 rounded-2xl overflow-hidden flex flex-col group hover:border-zinc-700 transition-all">
      {/* Image Thumbnail */}
      <Link href={`/event/${event.id}`} className="relative h-44 w-full overflow-hidden block">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Price Badge */}
        <span className="absolute bottom-3 right-3 bg-[#CCFF00] text-black font-black text-xs px-2.5 py-1 rounded-md shadow-md">
          {event.price}
        </span>
      </Link>

      {/* Card Info */}
      <div className="p-4 flex items-center justify-between">
        <div>
          <Link href={`/event/${event.id}`}>
            <h3 className="font-bold text-white text-lg group-hover:text-[#CCFF00] transition-colors">
              {event.title}
            </h3>
          </Link>
          <p className="text-xs text-zinc-400 mt-1">
            {event.venue} · {event.date}
          </p>
          {event.tags.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2.5">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-semibold text-zinc-300 bg-zinc-800/90 px-2 py-0.5 rounded-md border border-zinc-700/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <button className="text-zinc-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-zinc-800">
          <Heart className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
