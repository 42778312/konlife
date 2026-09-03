# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are students and locals in Konstanz planning a night out tonight or this weekend. They open the app to see what is happening in the city — clubs, student nights, bars, live music, parties — and decide where to go. Organizers, ticket buyers, and authenticated accounts are out of scope.

## Product Purpose

KONSTANZ shows nightlife and going-out events in Konstanz so people can discover what is on, when, and where. Success is finding a real night worth attending without creating an account, buying a ticket, or publishing an event.

## Positioning

A city-specific going-out guide for Konstanz nightlife, not a generic ticket marketplace. The catalog is local venues and nights (Club XYZ, Blechnerei, Hafenbar, student campus, lakefront bars), not conferences, family programming, or global listings.

## Operating Context

Expo app (`mobile/`) with expo-router, currently also runnable on iOS and Android. Product priority is a responsive web experience (desktop, laptop, tablet, phone). Native remains a secondary companion, not a second product. Listings come from the public Party Insider events API, filtered in-app so only Konstanz venues appear.

## Capabilities and Constraints

- Discover, filter, search, and open event details for nights in Konstanz.
- Estimate a taxi home: type start and end in Konstanz, see the driving path and the official Landkreis tariff, then call a local dispatcher. No in-app booking or payments.
- Save/bookmark events locally in the client. No accounts, sign-in, or profiles.
- No payments, ticketing, QR codes, or booking status.
- No create-event, organizer publishing, or organizer profiles.
- Live catalog: The Events Calendar REST at party-insider.com. The app paginates the dated list, then keeps only events whose `venue.city` is exactly `Konstanz`. Other cities are never shown.
- Saved IDs stay in memory for the session (local storage still undecided).

## Brand Commitments

- Product name: KONSTANZ (app.json).
- Place: Konstanz, Germany.
- Voice of the current copy is nightlife-direct (“plan your nights out”); keep that register, not corporate event-platform language.
- User-stated visual intent for the redesign (not a locked palette): premium, modern, editorial, energetic, trustworthy, social, easy to navigate; restrained palette with one strong brand/accent; suitable for discovering real-world nights out. Visual world is decided in new-work, not here.

## Evidence on Hand

- Live catalog from Party Insider (`mobile/lib/partyInsider/`), gated to `venue.city === "Konstanz"`.
- Mock catalog remains in `mobile/data/mockEvents.ts` as type/shape reference only; screens do not read it as inventory.
- No first-party photography. Event images are hosted by Party Insider.

## Product Principles

- City first: every screen is about going out in Konstanz tonight or this weekend.
- Show, don’t transact: discovery and details only; never a checkout or publish flow.
- Local and specific: real venues, genres, and nights beat generic “event platform” categories.
- Fast to decide: date, place, price, and vibe must be scannable without an account.
- Web-responsive first: layouts must work as a site, not a stretched phone shell.
