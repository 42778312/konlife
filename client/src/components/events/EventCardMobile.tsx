'use client';

import React from 'react';
import Link from 'next/link';
import { Bookmark, Heart, Tag } from 'lucide-react';
import { EventItem } from '@/data/mockEvents';

interface EventCardMobileProps {
  event: EventItem;
  variant?: 'hero' | 'horizontal' | 'list';
}

export const EventCardMobile: React.FC<EventCardMobileProps> = ({ event, variant = 'list' }) => {
  // HERO FEATURED VARIANT (Mobile Home Main Banner)
  if (variant === 'hero') {
    return (
      <div className="relative w-full h-[380px] rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
        <img
          src={event.image}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h2 className="font-display text-4xl font-black text-white tracking-wide mb-1">
            {event.title}
          </h2>
          <p className="text-zinc-300 font-semibold text-sm mb-1">{event.venue}</p>
          <p className="text-zinc-400 text-xs mb-3">{event.date}</p>

          <div className="flex items-center justify-between">
            <span className="bg-zinc-900/80 border border-zinc-700 text-zinc-300 text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
              {event.tags.join(' · ')}
            </span>
            <span className="font-display text-3xl font-black text-[#CCFF00]">
              {event.price}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // HORIZONTAL CAROUSEL CARD VARIANT (Mobile Home "This Weekend")
  if (variant === 'horizontal') {
    return (
      <Link
        href={`/event/${event.id}`}
        className="w-[170px] shrink-0 bg-[#141417] border border-zinc-800 rounded-2xl overflow-hidden flex flex-col block"
      >
        <div className="relative h-44 w-full overflow-hidden">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        </div>
        <div className="p-3 flex flex-col flex-1 justify-between">
          <div>
            <h4 className="font-bold text-white text-sm line-clamp-1">{event.title}</h4>
            <p className="text-[11px] text-zinc-400 mt-0.5">{event.venue}</p>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="font-bold text-xs text-[#CCFF00]">{event.price}</span>
            <button className="text-zinc-400 hover:text-white p-1">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>
    );
  }

  // LIST CARD VARIANT (Mobile Discover Screen)
  return (
    <div className="bg-[#141417] border border-zinc-800/80 rounded-2xl overflow-hidden flex h-36 relative">
      {/* Thumbnail Left */}
      <Link href={`/event/${event.id}`} className="w-36 h-full shrink-0 relative block">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
      </Link>

      {/* Info Right */}
      <div className="p-3 flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-1">
            <Link href={`/event/${event.id}`}>
              <h3 className="font-bold text-white text-base truncate">{event.title}</h3>
            </Link>
            <button className="text-zinc-400 hover:text-red-500 p-1">
              <Heart className="w-4.5 h-4.5" />
            </button>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">{event.venue}</p>
          <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
            <span>📅 {event.date}</span>
          </p>
          <p className="text-xs text-[#CCFF00] font-bold mt-1">
            🏷️ {event.price}
          </p>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-semibold text-[#CCFF00] bg-zinc-900 border border-[#CCFF00]/40 px-2 py-0.5 rounded-full whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
