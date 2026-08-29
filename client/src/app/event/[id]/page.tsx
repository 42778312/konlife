'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MOCK_EVENTS } from '@/data/mockEvents';
import { WebHeader } from '@/components/layout/WebHeader';
import { ViewportSwitcher } from '@/components/layout/ViewportSwitcher';
import { EventCardWeb } from '@/components/events/EventCardWeb';
import { MapWidget } from '@/components/events/MapWidget';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Ticket,
  GraduationCap,
  ExternalLink,
  Bookmark,
  Share2,
  Heart,
  MapPin,
} from 'lucide-react';

export default function EventDetailPage() {
  const params = useParams();
  const [viewMode, setViewMode] = useState<'auto' | 'mobile' | 'web'>('auto');
  const [isSaved, setIsSaved] = useState(false);

  const eventId = params?.id as string;
  const event = MOCK_EVENTS.find((e) => e.id === eventId) || MOCK_EVENTS[0];
  const relatedEvents = MOCK_EVENTS.filter((e) => e.id !== event.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#080809] text-zinc-100 flex flex-col pb-20 md:pb-0">
      <ViewportSwitcher viewMode={viewMode} setViewMode={setViewMode} />

      {/* WEB DESKTOP VIEW */}
      <div className={`${viewMode === 'mobile' ? 'hidden' : viewMode === 'web' ? 'block' : 'hidden md:block'}`}>
        <WebHeader />

        <main className="max-w-7xl mx-auto px-8 py-8 flex flex-col gap-8">
          {/* Back Link */}
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-semibold w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          {/* Hero Banner */}
          <div className="relative w-full h-[360px] rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
            <img
              src={event.image}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col gap-3">
              <h1 className="font-display text-6xl font-black text-white tracking-wide">
                {event.title}
              </h1>

              <div className="flex items-center gap-4">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#CCFF00] text-black font-extrabold text-xs px-3.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                <span className="text-zinc-300 font-semibold text-lg flex items-center gap-1.5">
                  <MapPin className="w-5 h-5 text-[#CCFF00]" />
                  {event.venue}
                </span>
              </div>
            </div>
          </div>

          {/* Two Column Grid */}
          <div className="grid grid-cols-3 gap-8">
            {/* Left Column (Main Info & Map) */}
            <div className="col-span-2 flex flex-col gap-6">
              {/* 4-Column Metadata Card */}
              <div className="bg-[#141417] border border-zinc-800/80 rounded-3xl p-6 grid grid-cols-4 gap-4">
                <div className="flex flex-col items-start gap-2 border-r border-zinc-800/80 pr-4">
                  <Calendar className="w-5 h-5 text-[#CCFF00]" />
                  <div>
                    <p className="text-xs text-zinc-400 font-medium">Date</p>
                    <p className="font-bold text-white text-sm mt-0.5">{event.fullDate}</p>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-2 border-r border-zinc-800/80 pr-4">
                  <Clock className="w-5 h-5 text-[#CCFF00]" />
                  <div>
                    <p className="text-xs text-zinc-400 font-medium">Time</p>
                    <p className="font-bold text-white text-sm mt-0.5">{event.time}</p>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-2 border-r border-zinc-800/80 pr-4">
                  <Ticket className="w-5 h-5 text-[#CCFF00]" />
                  <div>
                    <p className="text-xs text-zinc-400 font-medium">Price</p>
                    <p className="font-bold text-white text-sm mt-0.5">{event.price}</p>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-2">
                  <GraduationCap className="w-5 h-5 text-[#CCFF00]" />
                  <div>
                    <p className="text-xs text-zinc-400 font-medium">Type</p>
                    <p className="font-bold text-white text-sm mt-0.5">{event.category}</p>
                  </div>
                </div>
              </div>

              {/* Description Card */}
              <div className="bg-[#141417] border border-zinc-800/80 rounded-3xl p-6 flex flex-col gap-4">
                <p className="text-zinc-300 text-base leading-relaxed">{event.description}</p>
                <a
                  href="#view"
                  className="flex items-center gap-2 text-[#CCFF00] font-extrabold text-sm hover:underline w-fit"
                >
                  <span>View original event</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Map Card */}
              <div className="bg-[#141417] border border-zinc-800/80 rounded-3xl p-6 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-white text-xl">{event.venue}</h3>
                  <p className="text-sm text-zinc-400">{event.city}</p>
                  <button className="flex items-center gap-1 text-[#CCFF00] font-extrabold text-xs hover:underline mt-2">
                    <span>Open map</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="w-64 h-24 rounded-2xl overflow-hidden border border-zinc-800">
                  <MapWidget venueName={event.venue} cityName={event.city} interactive={false} />
                </div>
              </div>
            </div>

            {/* Right Column (Action Buttons Box) */}
            <div className="flex flex-col gap-4 bg-[#141417] border border-zinc-800/80 rounded-3xl p-6 h-fit">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className="w-full bg-[#CCFF00] text-black font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#b8e600] transition-colors text-base"
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-black' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              <button className="w-full border border-zinc-700 text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:border-zinc-500 transition-colors text-base">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Bottom Section: MORE THIS WEEKEND */}
          <section className="flex flex-col gap-4 mt-6">
            <h2 className="font-display text-2xl font-black text-[#CCFF00] tracking-wider uppercase">
              MORE THIS WEEKEND
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {relatedEvents.map((relEvent) => (
                <EventCardWeb key={relEvent.id} event={relEvent} variant="grid" />
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* MOBILE PHONE VIEW */}
      <div className={`${viewMode === 'web' ? 'hidden' : viewMode === 'mobile' ? 'block' : 'block md:hidden'} max-w-md mx-auto w-full`}>
        {/* Mobile Header Bar */}
        <div className="p-4 flex items-center justify-between border-b border-zinc-900 sticky top-0 bg-[#080809] z-40">
          <Link href="/" className="p-2 bg-zinc-900 border border-zinc-800 rounded-full text-white">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="font-bold text-white text-base">Event Detail</span>
          <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-full text-white">
            <Bookmark className="w-4 h-4" />
          </button>
        </div>

        <main className="p-4 flex flex-col gap-4">
          {/* Mobile Image Banner */}
          <div className="relative w-full h-[280px] rounded-3xl overflow-hidden border border-zinc-800">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
              <h1 className="font-display text-4xl font-black text-white">{event.title}</h1>
              <div className="flex items-center gap-2">
                {event.tags.map((tag) => (
                  <span key={tag} className="bg-[#CCFF00] text-black font-extrabold text-[10px] px-3 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-xs text-zinc-300 flex items-center gap-1 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-[#CCFF00]" />
                {event.venue}
              </p>
            </div>
          </div>

          {/* 4-Column Metadata Grid */}
          <div className="bg-[#141417] border border-zinc-800 rounded-2xl p-4 grid grid-cols-4 gap-2 text-center">
            <div className="flex flex-col items-center gap-1 border-r border-zinc-800">
              <Calendar className="w-4 h-4 text-[#CCFF00]" />
              <span className="text-[10px] text-zinc-400">Date</span>
              <span className="text-xs font-bold text-white truncate w-full">{event.fullDate}</span>
            </div>

            <div className="flex flex-col items-center gap-1 border-r border-zinc-800">
              <Clock className="w-4 h-4 text-[#CCFF00]" />
              <span className="text-[10px] text-zinc-400">Time</span>
              <span className="text-xs font-bold text-white">{event.time}</span>
            </div>

            <div className="flex flex-col items-center gap-1 border-r border-zinc-800">
              <Ticket className="w-4 h-4 text-[#CCFF00]" />
              <span className="text-[10px] text-zinc-400">Price</span>
              <span className="text-xs font-bold text-white">{event.price}</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <GraduationCap className="w-4 h-4 text-[#CCFF00]" />
              <span className="text-[10px] text-zinc-400">Type</span>
              <span className="text-xs font-bold text-white">{event.category}</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#141417] border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3">
            <p className="text-xs text-zinc-300 leading-relaxed">{event.description}</p>
            <a href="#link" className="flex items-center gap-1 text-[#CCFF00] font-bold text-xs">
              <span>View original event</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="bg-[#CCFF00] text-black font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 text-sm"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-black' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            <button className="border border-zinc-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 text-sm">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>

          {/* Venue Card */}
          <div className="bg-[#141417] border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white text-sm">{event.venue}</h4>
              <p className="text-xs text-zinc-400">{event.city}</p>
              <button className="flex items-center gap-1 text-[#CCFF00] font-bold text-xs mt-2">
                <span>Open map</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <div className="w-32 h-16 rounded-xl overflow-hidden border border-zinc-800">
              <MapWidget venueName={event.venue} cityName={event.city} interactive={false} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
