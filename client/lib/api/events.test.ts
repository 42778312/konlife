import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import { ApiError } from './client.ts';
import { API_BASE_URL } from './config.ts';
import { clearEventsCache, fetchEventById, fetchKonstanzEvents, listEvents } from './events.ts';
import type { ApiEvent, EventListResponse } from './types.ts';

const originalFetch = globalThis.fetch;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function sampleEvent(id: number, title: string): ApiEvent {
  return {
    id,
    title,
    start_date: '2026-09-02T21:00:00+02:00',
    timezone: 'Europe/Zurich',
    venue: { id: 9, name: 'K9 Konstanz', city: 'Konstanz' },
    categories: [],
    tags: [{ id: 1, name: 'Techno' }],
    image: 'https://www.party-insider.com/k9.jpg',
  };
}

function listBody(items: ApiEvent[], page: number, hasNext: boolean): EventListResponse {
  return { items, page, per_page: 100, total: items.length, has_next: hasNext };
}

afterEach(() => {
  globalThis.fetch = originalFetch;
  clearEventsCache();
});

describe('listEvents', () => {
  it('requests Konstanz events with party_only off', async () => {
    const calls: string[] = [];
    globalThis.fetch = async (input) => {
      calls.push(String(input));
      return jsonResponse(listBody([sampleEvent(1, 'Night')], 1, false));
    };

    const data = await listEvents({ fromDate: '2026-09-01T00:00:00', toDate: '2026-10-27T23:59:59' });
    assert.equal(data.items.length, 1);
    assert.equal(calls.length, 1);
    const url = new URL(calls[0]!);
    assert.equal(url.origin, API_BASE_URL);
    assert.equal(url.pathname, '/api/events');
    assert.equal(url.searchParams.get('city'), 'Konstanz');
    assert.equal(url.searchParams.get('status'), 'all');
    assert.equal(url.searchParams.get('party_only'), 'false');
    assert.equal(url.searchParams.get('from_date'), '2026-09-01T00:00:00');
    assert.equal(url.searchParams.get('per_page'), '100');
  });

  it('surfaces FastAPI detail on failure', async () => {
    globalThis.fetch = async () => jsonResponse({ detail: 'Party-Insider unavailable' }, 502);
    await assert.rejects(() => listEvents(), (err: unknown) => {
      assert.ok(err instanceof ApiError);
      assert.equal(err.status, 502);
      assert.equal(err.message, 'Party-Insider unavailable');
      return true;
    });
  });
});

describe('fetchKonstanzEvents', () => {
  it('walks has_next pages and maps EventItems', async () => {
    const pages: string[] = [];
    globalThis.fetch = async (input) => {
      const url = new URL(String(input));
      pages.push(url.searchParams.get('page') ?? '');
      if (url.searchParams.get('page') === '1') {
        return jsonResponse(listBody([sampleEvent(10, 'First – K9 Konstanz')], 1, true));
      }
      return jsonResponse(listBody([sampleEvent(11, 'Second – K9 Konstanz')], 2, false));
    };

    const events = await fetchKonstanzEvents({
      bypassCache: true,
      now: new Date('2026-09-01T12:00:00+02:00'),
    });
    assert.deepEqual(pages, ['1', '2']);
    assert.equal(events.length, 2);
    assert.equal(events[0]?.id, '10');
    assert.equal(events[0]?.title, 'First');
    assert.equal(events[0]?.venue, 'K9');
    assert.equal(events[1]?.id, '11');
    assert.deepEqual(events[0]?.tags, ['Techno']);
  });

  it('serves the memory cache until bypassed', async () => {
    let hits = 0;
    globalThis.fetch = async () => {
      hits += 1;
      return jsonResponse(listBody([sampleEvent(10, 'Cached')], 1, false));
    };

    const now = new Date('2026-09-01T12:00:00+02:00');
    const first = await fetchKonstanzEvents({ now });
    const second = await fetchKonstanzEvents({ now });
    assert.equal(hits, 1);
    assert.equal(first, second);

    await fetchKonstanzEvents({ now, bypassCache: true });
    assert.equal(hits, 2);
  });

  it('coalesces concurrent loads into one request', async () => {
    let hits = 0;
    globalThis.fetch = async () => {
      hits += 1;
      await new Promise((resolve) => setTimeout(resolve, 30));
      return jsonResponse(listBody([sampleEvent(10, 'Shared')], 1, false));
    };

    const now = new Date('2026-09-01T12:00:00+02:00');
    const [first, second] = await Promise.all([
      fetchKonstanzEvents({ now }),
      fetchKonstanzEvents({ now }),
    ]);
    assert.equal(hits, 1);
    assert.equal(first, second);
    assert.equal(first[0]?.id, '10');
  });
});

describe('fetchEventById', () => {
  it('loads a single night from /api/events/{id}', async () => {
    const calls: string[] = [];
    globalThis.fetch = async (input) => {
      calls.push(String(input));
      return jsonResponse(sampleEvent(18492, 'Techno Friday'));
    };

    const event = await fetchEventById('18492');
    assert.equal(event?.id, '18492');
    assert.equal(event?.title, 'Techno Friday');
    assert.equal(new URL(calls[0]!).pathname, '/api/events/18492');

    await fetchEventById('18492');
    assert.equal(calls.length, 1);
  });

  it('returns null on 404', async () => {
    globalThis.fetch = async () => jsonResponse({ detail: 'Event not found' }, 404);
    assert.equal(await fetchEventById('9'), null);
  });

  it('skips non-numeric ids', async () => {
    let hits = 0;
    globalThis.fetch = async () => {
      hits += 1;
      return jsonResponse(sampleEvent(1, 'Nope'));
    };
    assert.equal(await fetchEventById('student-night'), null);
    assert.equal(hits, 0);
  });
});
