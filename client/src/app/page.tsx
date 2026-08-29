'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { MOCK_EVENTS } from '@/data/mockEvents';
import { WebHeader } from '@/components/layout/WebHeader';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { EventCardWeb } from '@/components/events/EventCardWeb';
import { EventCardMobile } from '@/components/events/EventCardMobile';
import { CategoryFilterBar } from '@/components/events/CategoryFilterBar';

export default function HomePage() {
  const [selectedDay, setSelectedDay] = useState<'Today' | 'Tomorrow' | 'Fri' | 'Sat' | 'Sun'>('Today');
  const [selectedCategory, setSelectedCategory] = useState<string>('Student');

  // Featured events from mock data
  const featuredEvent = MOCK_EVENTS.find((e) => e.id === 'techno-friday') || MOCK_EVENTS[1];
  const heroMobileEvent = MOCK_EVENTS.find((e) => e.id === 'student-night') || MOCK_EVENTS[0];
  const weekendEvents = MOCK_EVENTS.filter((e) => e.dayOfWeek === 'Sat' || e.dayOfWeek === 'Fri').slice(0, 3);
  const popularEvents = MOCK_EVENTS.filter((e) => e.isPopular).slice(0, 4);

  const days: ('Today' | 'Tomorrow' | 'Fri' | 'Sat' | 'Sun')[] = ['Today', 'Tomorrow', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="min-h-screen bg-[#080809] text-zinc-100 flex flex-col pb-20 md:pb-0">
      {/* WEB DESKTOP VIEW */}
      <div className="hidden md:block">
        <WebHeader />

        <main className="max-w-7xl mx-auto px-8 py-8 flex flex-col gap-10">
          {/* Top Hero Banner */}
          <EventCardWeb event={featuredEvent} variant="hero" />

          {/* Section 1: THIS WEEKEND */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-black text-[#CCFF00] tracking-wider uppercase">
                THIS WEEKEND
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {weekendEvents.map((event) => (
                <EventCardWeb key={event.id} event={event} variant="grid" />
              ))}
            </div>
          </section>

          {/* Section 2: POPULAR */}
          <section className="flex flex-col gap-4">
            <h2 className="font-display text-2xl font-black text-[#CCFF00] tracking-wider uppercase">
              POPULAR
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {popularEvents.map((event) => (
                <EventCardWeb key={event.id} event={event} variant="compact" />
              ))}
            </div>
          </section>

          {/* Category Filter Pills at Bottom */}
          <div className="mt-4 pt-6 border-t border-zinc-800/60">
            <CategoryFilterBar
              activeCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        </main>
      </div>

      {/* MOBILE PHONE VIEW */}
      <div className="block md:hidden max-w-md mx-auto w-full">
        <MobileHeader />

        <main className="p-4 flex flex-col gap-6">
          {/* Day Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedDay === day
                    ? 'bg-[#CCFF00] text-black shadow-md shadow-[#CCFF00]/20'
                    : 'bg-[#141417] text-zinc-300 border border-zinc-800'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Featured Hero Mobile Card */}
          <EventCardMobile event={heroMobileEvent} variant="hero" />

          {/* Section: This Weekend */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-black text-white tracking-wide">
                This Weekend
              </h3>
              <Link href="/discover" className="text-xs font-extrabold text-[#CCFF00] hover:underline">
                See all
              </Link>
            </div>

            {/* Horizontal Scroll Cards */}
            <motion.div
              layoutScroll
              className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2"
            >
              {weekendEvents.map((event) => (
                <EventCardMobile key={event.id} event={event} variant="horizontal" />
              ))}
            </motion.div>
          </section>

          {/* Category Filter Pills */}
          <div className="pt-2">
            <CategoryFilterBar
              activeCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        </main>

        <MobileBottomNav />
      </div>
    </div>
  );
}
