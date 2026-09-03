import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatDuration, formatFare } from './format.ts';

describe('format', () => {
  it('formats fare and duration', () => {
    assert.equal(formatFare(12.7), '€12.70');
    assert.equal(formatDuration(90), '~2 min');
  });
});
