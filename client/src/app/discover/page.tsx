'use client';

import React, { useState } from 'react';
import { MOCK_EVENTS } from '@/data/mockEvents';
import { WebHeader } from '@/components/layout/WebHeader';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { EventCardWeb } from '@/components/events/EventCardWeb';
import { EventCardMobile } from '@/components/events/EventCardMobile';
import { MapWidget } from '@/components/events/MapWidget';
import { Search, X, List, Map, ChevronDown } from 'lucide-react';

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'list' | 'map'>('list');

  // Active filter tags shown in desktop screenshot
  const [filters, setFilters] = useState([
    { label: 'Tonight', isDropdown: true, isActive: true },
    { label: 'Category', isDropdown: true, isActive: false },
    { label: 'Techno', isRemovable: true, isActive: true },
    { label: 'House', isRemovable: false, isActive: false },
    { label: 'Free', isRemovable: true, isActive: true },
    { label: 'Distance', isDropdown: true, isActive: false },
  ]);

  const discoverEvents = MOCK_EVENTS.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#080809] text-zinc-100 flex flex-col pb-20 md:pb-0">
      {/* WEB DESKTOP VIEW */}
      <div className="hidden md:block">
        <WebHeader />

        <main className="max-w-7xl mx-auto px-8 py-8 flex flex-col gap-6">
          {/* Search & View Mode Controls */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search events, clubs and bars..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#141417] border border-zinc-800 rounded-2xl pl-12 pr-10 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#CCFF00] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Segmented View Toggle (List / Map) */}
            <div className="flex items-center bg-[#141417] border border-zinc-800 p-1 rounded-2xl">
              <button
                onClick={() => setActiveView('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeView === 'list' ? 'bg-[#CCFF00] text-black shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
                <span>List</span>
              </button>
              <button
                onClick={() => setActiveView('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeView === 'map' ? 'bg-[#CCFF00] text-black shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Map className="w-4 h-4" />
                <span>Map</span>
              </button>
            </div>
          </div>

          {/* Filter Chips Bar */}
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
            {filters.map((filter, index) => (
              <button
                key={index}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                  filter.isActive
                    ? 'bg-[#CCFF00] text-black border-[#CCFF00]'
                    : 'bg-[#141417] text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white'
                }`}
              >
                <span>{filter.label}</span>
                {filter.isDropdown && <ChevronDown className="w-3.5 h-3.5" />}
                {filter.isRemovable && <X className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>

          {/* Event Grid (3 columns) */}
          <div className="grid grid-cols-3 gap-6">
            {discoverEvents.map((event) => (
              <EventCardWeb key={event.id} event={event} variant="grid" />
            ))}
          </div>

          {/* Bottom Dark Map Panel */}
          <div className="mt-6">
            <MapWidget venueName="Blechnerei" cityName="Konstanz" interactive={true} />
          </div>
        </main>
      </div>

      {/* MOBILE PHONE VIEW */}
      <div className="block md:hidden max-w-md mx-auto w-full">
        <div className="p-4 flex items-center justify-between border-b border-zinc-900 sticky top-0 bg-[#080809] z-40">
          <h1 className="font-display text-4xl font-black text-white tracking-wide">
            Discover
          </h1>
          {/* List/Map Toggle Icon */}
          <div className="flex items-center bg-[#141417] border border-zinc-800 p-1 rounded-2xl">
            <button
              onClick={() => setActiveView('list')}
              className={`p-2 rounded-xl transition-all ${
                activeView === 'list' ? 'bg-[#CCFF00] text-black' : 'text-zinc-400'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveView('map')}
              className={`p-2 rounded-xl transition-all ${
                activeView === 'map' ? 'bg-[#CCFF00] text-black' : 'text-zinc-400'
              }`}
            >
              <Map className="w-4 h-4" />
            </button>
          </div>
        </div>

        <main className="p-4 flex flex-col gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search events, clubs and bars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141417] border border-zinc-800 rounded-2xl pl-10 pr-9 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#CCFF00]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdown Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {['Date ⌵', 'Category ⌵', 'Music ⌵', 'Price ⌵', 'Distance ⌵'].map((chip, idx) => (
              <button
                key={idx}
                className="bg-[#141417] border border-zinc-800 text-zinc-300 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap hover:border-zinc-700"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Vertical Event List Stack */}
          {activeView === 'list' ? (
            <div className="flex flex-col gap-3">
              {discoverEvents.map((event) => (
                <EventCardMobile key={event.id} event={event} variant="list" />
              ))}
            </div>
          ) : (
            <div className="mt-2">
              <MapWidget venueName="Blechnerei" cityName="Konstanz" interactive={true} />
            </div>
          )}
        </main>

        <MobileBottomNav />
      </div>
    </div>
  );
}
