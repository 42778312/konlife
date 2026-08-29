'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Heart, Bookmark } from 'lucide-react';
import { EventItem } from '@/data/mockEvents';
import { EventExpandLink } from '@/components/events/EventExpandLink';
import { EVENT_EXPAND_TRANSITION, eventLayoutIds } from '@/lib/eventMotion';

interface EventCardWebProps {
  event: EventItem;
  variant?: 'hero' | 'grid' | 'compact';
  instanceId?: string;
}

export const EventCardWeb: React.FC<EventCardWebProps> = ({
  event,
  variant = 'grid',
  instanceId: instanceIdProp,
}) => {
  const instanceId = instanceIdProp ?? `web-${variant}`;
  const ids = eventLayoutIds(event.id, instanceId);

  if (variant === 'hero') {
    return (
      <div className="relative w-full h-[340px]">
        <motion.div
          layoutId={ids.container}
          transition={EVENT_EXPAND_TRANSITION}
          className="relative w-full h-full overflow-hidden border border-zinc-800/80 group"
          style={{ borderRadius: 24 }}
        >
          <motion.div
            layoutId={ids.image}
            transition={EVENT_EXPAND_TRANSITION}
            className="absolute inset-0"
          >
            <img
              src={event.image}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent" />

          <div className="absolute inset-0 p-8 flex flex-col justify-end max-w-xl">
            <span className="text-[#CCFF00] font-bold text-xs tracking-widest uppercase mb-2">
              TONIGHT · FRIDAY
            </span>
            <motion.h1
              layoutId={ids.title}
              layout="position"
              transition={EVENT_EXPAND_TRANSITION}
              className="font-display text-5xl font-black tracking-wide text-white mb-2 origin-left"
            >
              {event.title}
            </motion.h1>
            <p className="text-zinc-300 font-medium text-lg mb-6">
              {event.venue} · {event.time}
            </p>

            <div className="relative z-20 flex items-center gap-3">
              <span className="bg-[#CCFF00] text-black font-extrabold px-5 py-2.5 rounded-xl text-sm">
                {event.price}
              </span>
              <button
                type="button"
                className="flex items-center gap-2 bg-black/60 border border-zinc-700 backdrop-blur-md text-white font-semibold px-4 py-2.5 rounded-xl hover:border-[#CCFF00] transition-colors text-sm"
              >
                <Bookmark className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
          <EventExpandLink eventId={event.id} instanceId={instanceId} label={event.title} />
        </motion.div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="relative">
        <motion.div
          layoutId={ids.container}
          transition={EVENT_EXPAND_TRANSITION}
          className="flex items-center gap-4 bg-[#141417] border border-zinc-800/70 p-3 hover:border-zinc-700 hover:bg-[#1a1a1f] group"
          style={{ borderRadius: 16 }}
        >
          <motion.div
            layoutId={ids.image}
            transition={EVENT_EXPAND_TRANSITION}
            className="w-20 h-20 overflow-hidden shrink-0"
            style={{ borderRadius: 12 }}
          >
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="flex-1 min-w-0">
            <motion.h3
              layoutId={ids.title}
              layout="position"
              transition={EVENT_EXPAND_TRANSITION}
              className="font-bold text-white text-base truncate group-hover:text-[#CCFF00] origin-left"
            >
              {event.title}
            </motion.h3>
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
          <EventExpandLink eventId={event.id} instanceId={instanceId} label={event.title} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.div
        layoutId={ids.container}
        transition={EVENT_EXPAND_TRANSITION}
        className="relative bg-[#141417] border border-zinc-800/70 overflow-hidden flex flex-col group hover:border-zinc-700"
        style={{ borderRadius: 16 }}
      >
        <motion.div
          layoutId={ids.image}
          transition={EVENT_EXPAND_TRANSITION}
          className="relative h-44 w-full overflow-hidden"
        >
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-3 right-3 bg-[#CCFF00] text-black font-black text-xs px-2.5 py-1 rounded-md shadow-md">
            {event.price}
          </span>
        </motion.div>

        <div className="p-4 flex items-center justify-between">
          <div>
            <motion.h3
              layoutId={ids.title}
              layout="position"
              transition={EVENT_EXPAND_TRANSITION}
              className="font-bold text-white text-lg group-hover:text-[#CCFF00] origin-left"
            >
              {event.title}
            </motion.h3>
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

          <button
            type="button"
            className="relative z-20 text-zinc-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-zinc-800"
          >
            <Heart className="w-5 h-5" />
          </button>
        </div>
        <EventExpandLink eventId={event.id} instanceId={instanceId} label={event.title} />
      </motion.div>
    </div>
  );
};
