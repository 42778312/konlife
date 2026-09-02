import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  decodeEventShareId,
  encodeEventShareId,
  eventSharePath,
  eventShareUrl,
  shareOrigin,
} from './shareId.ts';

describe('event share ids', () => {
  it('round-trips numeric ids into short unique codes', () => {
    for (const id of ['1', '10', '18492', '99999', '648055', '1000001', '10010207']) {
      const code = encodeEventShareId(id);
      assert.match(code, /^[a-hjkmnp-z]+$/);
      assert.ok(code.length >= 4 && code.length <= 6, `${id} → ${code}`);
      assert.equal(decodeEventShareId(code), id);
      assert.equal(decodeEventShareId(code.toUpperCase()), id);
    }
  });

  it('gives every night its own code', () => {
    const seen = new Set<string>();
    for (let id = 1; id <= 400; id += 1) {
      const code = encodeEventShareId(String(id));
      assert.equal(seen.has(code), false, `duplicate ${code} for ${id}`);
      seen.add(code);
    }
  });

  it('accepts a raw numeric path for old links', () => {
    assert.equal(decodeEventShareId('18492'), '18492');
  });

  it('passes through mock slugs', () => {
    assert.equal(encodeEventShareId('student-night'), 'student-night');
    assert.equal(decodeEventShareId('student-night'), 'student-night');
  });

  it('builds a short /e/ path', () => {
    const path = eventSharePath('18492');
    assert.equal(path, `/e/${encodeEventShareId('18492')}`);
    assert.ok(path.length <= 9);
  });

  it('prefers an explicit public origin over the page host', () => {
    assert.equal(shareOrigin({ envOrigin: 'https://konstanz.app/', pageOrigin: 'http://localhost:8081' }), 'https://konstanz.app');
    assert.equal(shareOrigin({ pageOrigin: 'http://192.168.1.20:8081' }), 'http://192.168.1.20:8081');
    assert.equal(eventShareUrl('18492', 'https://konstanz.app'), `https://konstanz.app/e/${encodeEventShareId('18492')}`);
  });
});
