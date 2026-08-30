import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { cleanEventTitle, displayVenueName } from './html.ts';
import { mapTribeEvent } from './mapEvent.ts';
import type { TribeEvent } from './types.ts';

const fixturePath = join(dirname(fileURLToPath(import.meta.url)), 'dump-page1.fixture.json');
const dump = JSON.parse(readFileSync(fixturePath, 'utf8')) as { events: TribeEvent[] };

describe('mapTribeEvent', () => {
  it('returns null for Kreuzlingen', () => {
    const kreuzlingen = dump.events.find((e) => e.venue && !Array.isArray(e.venue) && e.venue.city === 'Kreuzlingen');
    assert.ok(kreuzlingen);
    assert.equal(mapTribeEvent(kreuzlingen!), null);
  });

  it('maps K9 Konstanz even when country is Switzerland', () => {
    const k9 = dump.events.find((e) => e.id === 14728);
    assert.ok(k9);
    const mapped = mapTribeEvent(k9!);
    assert.ok(mapped);
    assert.equal(mapped!.city, 'Konstanz');
    assert.equal(mapped!.venue, 'K9');
    assert.equal(mapped!.id, '14728');
    assert.equal(mapped!.title, 'Salsa, Bachata, Kizomba Party');
    assert.equal(mapped!.title.includes('&#'), false);
    assert.equal(mapped!.time, '21:00');
    assert.equal(mapped!.startDate, '2026-08-28');
    assert.match(mapped!.date, /28/);
    assert.ok(mapped!.image.startsWith('https://'));
    assert.ok(mapped!.sourceUrl?.includes('/event/'));
  });
});

describe('cleanEventTitle', () => {
  it('strips venue and city from the title', () => {
    assert.equal(
      cleanEventTitle('Fiesta Latina &#8211; TEVOTE Konstanz', 'TEVOTE Konstanz'),
      'Fiesta Latina',
    );
    assert.equal(displayVenueName('TEVOTE Konstanz'), 'TEVOTE');
  });
});
