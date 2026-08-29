'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WebHeader } from '@/components/layout/WebHeader';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { ViewportSwitcher } from '@/components/layout/ViewportSwitcher';
import { Calendar, Wallet, Ticket, Heart, ChevronRight } from 'lucide-react';

export default function WeekendPage() {
  const [viewMode, setViewMode] = useState<'auto' | 'mobile' | 'web'>('auto');
  const [selectedDay, setSelectedDay] = useState<'Today' | 'Tomorrow' | 'Fri' | 'Sat' | 'Sun'>('Sat');

  const days: ('Today' | 'Tomorrow' | 'Fri' | 'Sat' | 'Sun')[] = ['Today', 'Tomorrow', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="min-h-screen bg-[#080809] text-zinc-100 flex flex-col pb-20 md:pb-0">
      <ViewportSwitcher viewMode={viewMode} setViewMode={setViewMode} />

      {/* WEB DESKTOP VIEW */}
      <div className={`${viewMode === 'mobile' ? 'hidden' : viewMode === 'web' ? 'block' : 'hidden md:block'}`}>
        <WebHeader />

        <main className="max-w-7xl mx-auto px-8 py-8 flex flex-col gap-8">
          {/* Header Title & Day Selector */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
            <h1 className="font-display text-4xl font-black text-white tracking-wide">
              My Weekend
            </h1>

            <div className="flex items-center gap-8">
              {days.map((day) => {
                const isActive = selectedDay === day;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`relative py-1 font-bold text-base transition-colors ${
                      isActive ? 'text-[#CCFF00]' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {day}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#CCFF00] rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timeline Schedule Card */}
          <div className="bg-[#141417] border border-zinc-800/80 rounded-3xl p-8 flex flex-col gap-6 shadow-xl">
            {/* Item 1 */}
            <div className="flex items-center gap-8 relative pl-6 border-l-2 border-zinc-800">
              <span className="absolute -left-[9px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#CCFF00] glow-neon" />
              <span className="font-bold text-2xl text-white w-20">22:00</span>
              
              <div className="flex-1 flex items-center justify-between bg-[#1a1a1f] border border-zinc-800 p-4 rounded-2xl">
                <div className="flex items-center gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=150&q=80"
                    alt="Student Night"
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-white text-lg">Student Night</h3>
                    <p className="text-sm text-zinc-400">Club XYZ</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="bg-[#CCFF00] text-black font-extrabold px-3.5 py-1.5 rounded-xl text-sm">
                    €5
                  </span>
                  <button className="p-2.5 bg-rose-500/20 text-rose-500 border border-rose-500/40 rounded-xl hover:bg-rose-500 hover:text-white transition-colors">
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-8 relative pl-6 border-l-2 border-dashed border-zinc-800">
              <span className="absolute -left-[9px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#CCFF00] glow-neon" />
              <span className="font-bold text-2xl text-white w-20">23:30</span>
              
              <div className="flex-1 flex items-center justify-between bg-[#1a1a1f] border border-zinc-800 p-4 rounded-2xl">
                <div className="flex items-center gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=150&q=80"
                    alt="Summer Party"
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-white text-lg">Summer Party</h3>
                    <p className="text-sm text-zinc-400">Hafenbar</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="bg-[#CCFF00] text-black font-extrabold px-3.5 py-1.5 rounded-xl text-sm">
                    €10
                  </span>
                  <button className="p-2.5 bg-rose-500/20 text-rose-500 border border-rose-500/40 rounded-xl hover:bg-rose-500 hover:text-white transition-colors">
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3-Column Summary Stats Bar */}
          <div className="grid grid-cols-3 gap-6 bg-[#141417] border border-zinc-800 p-6 rounded-3xl">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-[#CCFF00]">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-white text-xl">3 events</h4>
                <p className="text-xs text-zinc-400">events planned</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-l border-zinc-800/80 pl-6">
              <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-[#CCFF00]">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-white text-xl">€15 total</h4>
                <p className="text-xs text-zinc-400">total spend</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-l border-zinc-800/80 pl-6">
              <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-[#CCFF00]">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-white text-xl">1 free</h4>
                <p className="text-xs text-zinc-400">free events</p>
              </div>
            </div>
          </div>

          {/* Sunday Reminder Empty Card */}
          <div className="bg-[#141417] border border-zinc-800/80 p-8 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl border-2 border-zinc-700 bg-zinc-900 flex flex-col items-center justify-center">
                <Calendar className="w-5 h-5 text-zinc-400" />
                <span className="text-[11px] font-extrabold text-zinc-400 mt-1 uppercase tracking-wider">SUN</span>
              </div>
              <div>
                <h3 className="font-bold text-white text-xl">Nothing saved for Sunday yet.</h3>
                <p className="text-sm text-zinc-400 mt-1">Plan ahead and discover the best events.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/discover"
                className="bg-[#CCFF00] text-black font-extrabold px-6 py-3 rounded-2xl hover:bg-[#b8e600] transition-colors text-sm"
              >
                Find something
              </Link>
              <Link
                href="/discover"
                className="flex items-center gap-2 border border-zinc-700 text-zinc-200 font-semibold px-5 py-3 rounded-2xl hover:border-zinc-500 transition-colors text-sm"
              >
                <span>Discover events</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* MOBILE PHONE VIEW */}
      <div className={`${viewMode === 'web' ? 'hidden' : viewMode === 'mobile' ? 'block' : 'block md:hidden'} max-w-md mx-auto w-full`}>
        <div className="p-4 border-b border-zinc-900 sticky top-0 bg-[#080809] z-40">
          <h1 className="font-display text-4xl font-black text-white tracking-wide">
            My Weekend
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">Plan your nights out</p>
        </div>

        <main className="p-4 flex flex-col gap-6">
          {/* Day Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedDay === day
                    ? 'bg-[#CCFF00] text-black shadow-md'
                    : 'bg-[#141417] text-zinc-300 border border-zinc-800'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Grouped Schedule Items */}
          {/* FRIDAY SECTION */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest">FRIDAY</h4>
            <div className="bg-[#141417] border border-zinc-800 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#CCFF00]" />
              <div className="flex items-center gap-4 pl-2">
                <span className="font-bold text-lg text-white">23:00</span>
                <div>
                  <h3 className="font-bold text-white text-base">Techno Friday</h3>
                  <p className="text-xs text-zinc-400">Club XYZ</p>
                  <p className="text-xs font-bold text-[#CCFF00] mt-1">🎟️ €8</p>
                </div>
              </div>
              <button className="text-zinc-400 p-2">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* SATURDAY SECTION */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest">SATURDAY</h4>
            
            <div className="bg-[#141417] border border-zinc-800 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden mb-2">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#CCFF00]" />
              <div className="flex items-center gap-4 pl-2">
                <span className="font-bold text-lg text-white">22:00</span>
                <div>
                  <h3 className="font-bold text-white text-base">Student Night</h3>
                  <p className="text-xs text-zinc-400">Club XYZ</p>
                  <p className="text-xs font-bold text-[#CCFF00] mt-1">🎟️ €5</p>
                </div>
              </div>
              <button className="text-zinc-400 p-2">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#141417] border border-zinc-800 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#CCFF00]" />
              <div className="flex items-center gap-4 pl-2">
                <span className="font-bold text-lg text-white">01:00</span>
                <div>
                  <h3 className="font-bold text-white text-base">Afterparty</h3>
                  <p className="text-xs text-zinc-400">Bar Central</p>
                  <p className="text-xs font-bold text-[#CCFF00] mt-1">🎟️ Free</p>
                </div>
              </div>
              <button className="text-zinc-400 p-2">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* SUNDAY SECTION */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest">SUNDAY</h4>
            <div className="bg-[#141417] border border-zinc-800 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#CCFF00]" />
              <div className="flex items-center gap-4 pl-2">
                <span className="font-bold text-lg text-white">21:00</span>
                <div>
                  <h3 className="font-bold text-white text-base">House Sundays</h3>
                  <p className="text-xs text-zinc-400">Kulturhaus</p>
                  <p className="text-xs font-bold text-[#CCFF00] mt-1">🎟️ €5</p>
                </div>
              </div>
              <button className="text-zinc-400 p-2">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </main>

        <MobileBottomNav />
      </div>
    </div>
  );
}
