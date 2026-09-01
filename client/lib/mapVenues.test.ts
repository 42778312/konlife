import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { EventItem } from '../data/mockEvents.ts';
import { groupEventsByVenue, hasCoords, regionForPins } from './mapVenues.ts';

function event(partial: Partial<EventItem> & Pick<EventItem, 'id' | 'venue'>): EventItem {
  return {
    title: partial.title ?? partial.venue,
    city: 'Konstanz',
    date: 'Tonight',
    time: '22:00',
    price: '',
    category: 'Club',
    tags: [],
    image: '',
    description: '',
    dayOfWeek: 'Fri',
    ...partial,
  };
}

describe('hasCoords', () => {
  it('accepts finite lat/lng', () => {
    assert.equal(hasCoords(event({ id: '1', venue: 'Hafen', lat: 47.66, lng: 9.17 })), true);
  });

  it('rejects missing or non-finite coords', () => {
    assert.equal(hasCoords(event({ id: '1', venue: 'Hafen' })), false);
    assert.equal(hasCoords(event({ id: '1', venue: 'Hafen', lat: Number.NaN, lng: 9.17 })), false);
  });
});

describe('groupEventsByVenue', () => {
  it('omits events without coords', () => {
    const pins = groupEventsByVenue([
      event({ id: 'a', venue: 'Unknown' }),
      event({ id: 'b', venue: 'Hafen', lat: 47.66, lng: 9.17 }),
    ]);
    assert.equal(pins.length, 1);
    assert.equal(pins[0].venue, 'Hafen');
    assert.deepEqual(
      pins[0].events.map((item) => item.id),
      ['b'],
    );
  });

  it('clusters nights that share a venue coordinate', () => {
    const pins = groupEventsByVenue([
      event({ id: 'a', venue: 'Blechnerei', lat: 47.6618, lng: 9.1772, title: 'One' }),
      event({ id: 'b', venue: 'Blechnerei', lat: 47.6618, lng: 9.1772, title: 'Two' }),
      event({ id: 'c', venue: 'Hafenbar', lat: 47.659, lng: 9.174 }),
    ]);
    assert.equal(pins.length, 2);
    const blech = pins.find((pin) => pin.venue === 'Blechnerei');
    assert.equal(blech?.events.length, 2);
  });
});

describe('regionForPins', () => {
  it('falls back to Konstanz when empty', () => {
    const region = regionForPins([]);
    assert.equal(region.latitude, 47.6602);
    assert.equal(region.longitude, 9.1758);
  });

  it('zooms in on a single pin', () => {
    const region = regionForPins([
      { id: 'h', venue: 'Hafen', lat: 47.66, lng: 9.17, events: [] },
    ]);
    assert.equal(region.latitude, 47.66);
    assert.equal(region.longitude, 9.17);
    assert.ok(region.latitudeDelta < 0.04);
  });
});
