'use client';

import React, { useState } from 'react';
import { MOCK_EVENTS } from '@/data/mockEvents';
import { WebHeader } from '@/components/layout/WebHeader';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { ViewportSwitcher } from '@/components/layout/ViewportSwitcher';
import { EventCardWeb } from '@/components/events/EventCardWeb';
import { EventCardMobile } from '@/components/events/EventCardMobile';
import { Bookmark } from 'lucide-react';

export default function SavedPage() {
  const [viewMode, setViewMode] = useState<'auto' | 'mobile' | 'web'>('auto');
  const savedEvents = MOCK_EVENTS.filter((e) => e.isSaved);

  return (
    <div className="min-h-screen bg-[#080809] text-zinc-100 flex flex-col pb-20 md:pb-0">
      <ViewportSwitcher viewMode={viewMode} setViewMode={setViewMode} />

      {/* WEB DESKTOP VIEW */}
      <div className={`${viewMode === 'mobile' ? 'hidden' : viewMode === 'web' ? 'block' : 'hidden md:block'}`}>
        <WebHeader />

        <main className="max-w-7xl mx-auto px-8 py-8 flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <Bookmark className="w-7 h-7 text-[#CCFF00]" />
            <h1 className="font-display text-4xl font-black text-white tracking-wide">
              Saved Events
            </h1>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {savedEvents.map((event) => (
              <EventCardWeb key={event.id} event={event} variant="grid" />
            ))}
          </div>
        </main>
      </div>

      {/* MOBILE PHONE VIEW */}
      <div className={`${viewMode === 'web' ? 'hidden' : viewMode === 'mobile' ? 'block' : 'block md:hidden'} max-w-md mx-auto w-full`}>
        <MobileHeader />

        <main className="p-4 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <Bookmark className="w-6 h-6 text-[#CCFF00]" />
            <h1 className="font-display text-3xl font-black text-white tracking-wide">
              Saved Events
            </h1>
          </div>

          <div className="flex flex-col gap-3">
            {savedEvents.map((event) => (
              <EventCardMobile key={event.id} event={event} variant="list" />
            ))}
          </div>
        </main>

        <MobileBottomNav />
      </div>
    </div>
  );
}
