import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { mapApiEvent, startParts } from './mapEvent.ts';
import type { ApiEvent } from './types.ts';

const sample: ApiEvent = {
  id: 15105,
  title: 'L’Aperitivo – Historische Fähre Konstanz',
  description: 'Drinks on the ferry.',
  url: 'https://www.party-insider.com/event/aperitivo/',
  start_date: '2026-09-02T17:00:00+02:00',
  end_date: '2026-09-02T22:00:00+02:00',
  timezone: 'Europe/Zurich',
  all_day: false,
  status: 'upcoming',
  is_current: false,
  is_upcoming: true,
  is_past: false,
  is_party: true,
  party_score: 0.55,
  cost: '€5',
  website: 'https://example.com',
  image: 'http://www.party-insider.com/photo.jpg',
  venue: {
    id: 13070,
    name: 'Historische Fähre Konstanz',
    city: 'Konstanz',
    country: 'Switzerland',
    address: 'Hafenstrasse 1',
    zip: '78462',
    latitude: 47.6602,
    longitude: 9.1758,
    website: 'https://faehre.example',
  },
  organizers: [],
  categories: [{ id: 34, name: 'Pane E Amore', slug: 'paneeamore' }],
  tags: [{ id: 1, name: 'House' }, { id: 2, name: '  ' }],
  featured: true,
  ticketed: false,
  is_virtual: false,
  source: { name: 'Party-Insider', url: 'https://www.party-insider.com' },
};

describe('startParts', () => {
  it('reads ymd and door time from an offset ISO string', () => {
    const parts = startParts('2026-09-02T17:00:00+02:00');
    assert.deepEqual(parts, { ymd: '2026-09-02', time: '17:00' });
  });

  it('returns null for missing or invalid dates', () => {
    assert.equal(startParts(null), null);
    assert.equal(startParts(''), null);
    assert.equal(startParts('not-a-date'), null);
  });
});

describe('mapApiEvent', () => {
  it('maps a Konlife event onto EventItem', () => {
    const mapped = mapApiEvent(sample);
    assert.ok(mapped);
    assert.equal(mapped!.id, '15105');
    assert.equal(mapped!.title, 'L’Aperitivo');
    assert.equal(mapped!.venue, 'Historische Fähre');
    assert.equal(mapped!.city, 'Konstanz');
    assert.equal(mapped!.time, '17:00');
    assert.equal(mapped!.startDate, '2026-09-02');
    assert.match(mapped!.date, /02/);
    assert.equal(mapped!.price, '€5');
    assert.equal(mapped!.isFree, false);
    assert.equal(mapped!.category, 'Pane E Amore');
    assert.deepEqual(mapped!.tags, ['House']);
    assert.equal(mapped!.image, 'https://www.party-insider.com/photo.jpg');
    assert.equal(mapped!.description, 'Drinks on the ferry.');
    assert.equal(mapped!.isFeatured, true);
    assert.equal(mapped!.lat, 47.6602);
    assert.equal(mapped!.lng, 9.1758);
    assert.equal(mapped!.sourceUrl, 'https://www.party-insider.com/event/aperitivo/');
    assert.equal(mapped!.website, 'https://example.com');
    assert.equal(mapped!.venueAddress, 'Hafenstrasse 1');
    assert.equal(mapped!.venueZip, '78462');
    assert.equal(mapped!.isParty, true);
    assert.equal(mapped!.partyScore, 0.55);
    assert.equal(mapped!.status, 'upcoming');
  });

  it('marks free nights and skips events without a start', () => {
    const free = mapApiEvent({ ...sample, cost: 'Gratis' });
    assert.equal(free?.isFree, true);
    assert.equal(mapApiEvent({ ...sample, start_date: null }), null);
  });

  it('falls back to venue name for category and city', () => {
    const mapped = mapApiEvent({
      ...sample,
      categories: [],
      tags: [],
      venue: { id: 1, name: 'K9 Konstanz', city: undefined },
    });
    assert.equal(mapped?.category, 'K9');
    assert.equal(mapped?.city, 'Konstanz');
    assert.equal(mapped?.venue, 'K9');
  });
});
