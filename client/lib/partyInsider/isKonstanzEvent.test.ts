import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { isKonstanzEvent, venueOf } from './isKonstanzEvent.ts';
import type { TribeEvent } from './types.ts';

const fixturePath = join(dirname(fileURLToPath(import.meta.url)), 'dump-page1.fixture.json');
const dump = JSON.parse(readFileSync(fixturePath, 'utf8')) as { events: TribeEvent[] };

describe('isKonstanzEvent', () => {
  it('keeps the three Konstanz venues from the dump, including K9 labeled Switzerland', () => {
    const kept = dump.events.filter(isKonstanzEvent);
    assert.equal(kept.length, 3);
    const names = kept.map((e) => venueOf(e)?.venue);
    assert.deepEqual(names, ['K9 Konstanz', 'Grey Konstanz', 'Kantine Konstanz']);
    const k9 = kept.find((e) => venueOf(e)?.venue === 'K9 Konstanz');
    assert.equal(venueOf(k9!)?.country, 'Switzerland');
    assert.equal(venueOf(k9!)?.city, 'Konstanz');
  });

  it('drops Kreuzlingen, Münchwilen, Winterthur, and Singen', () => {
    const dropped = dump.events.filter((e) => !isKonstanzEvent(e));
    assert.equal(dropped.length, 7);
    const cities = new Set(dropped.map((e) => venueOf(e)?.city));
    assert.ok(cities.has('Kreuzlingen'));
    assert.ok(!cities.has('Konstanz'));
  });

  it('does not use country as the city gate', () => {
    const swissKonstanz: TribeEvent = {
      id: 1,
      title: 'K9',
      venue: { city: 'Konstanz', country: 'Switzerland' },
    };
    const germanOther: TribeEvent = {
      id: 2,
      title: 'Top10',
      venue: { city: 'Singen (Hohentwiel)', country: 'Germany' },
    };
    assert.equal(isKonstanzEvent(swissKonstanz), true);
    assert.equal(isKonstanzEvent(germanOther), false);
  });

  it('rejects missing venue or a different spelling; trim is allowed', () => {
    assert.equal(isKonstanzEvent({ id: 1, title: 'x' }), false);
    assert.equal(isKonstanzEvent({ id: 2, title: 'x', venue: { city: ' Konstanz' } }), true);
    assert.equal(isKonstanzEvent({ id: 3, title: 'x', venue: { city: 'konstanz' } }), false);
  });
});
