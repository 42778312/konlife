import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mergePlaces, venuePlaces } from './venues.ts';

describe('venuePlaces', () => {
  it('ranks matching venues with coords and skips duplicates', () => {
    const events = [
      { venue: 'Hafenbar', lat: 47.66, lng: 9.17, venueAddress: 'Hafenstrasse 1' },
      { venue: 'Hafenbar', lat: 47.66, lng: 9.17 },
      { venue: 'Blechnerei', lat: 47.67, lng: 9.18 },
    ] as Parameters<typeof venuePlaces>[0];
    const hits = venuePlaces(events, 'haf');
    assert.equal(hits.length, 1);
    assert.equal(hits[0].label, 'Hafenbar');
    assert.equal(hits[0].detail, 'Hafenstrasse 1');
  });
});

describe('mergePlaces', () => {
  it('keeps venues first and drops same-coordinate remotes', () => {
    const venues = [{ id: 'v1', label: 'Hafenbar', lat: 47.66, lng: 9.17 }];
    const remote = [
      { id: 'p1', label: 'Hafen', lat: 47.66, lng: 9.17 },
      { id: 'p2', label: 'Marktstätte', lat: 47.659, lng: 9.176 },
    ];
    const merged = mergePlaces(venues, remote);
    assert.equal(merged[0].label, 'Hafenbar');
    assert.equal(merged.length, 2);
  });
});
