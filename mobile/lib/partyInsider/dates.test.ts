import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  addMonthsYmd,
  formatAgendaDate,
  formatMonthTitle,
  isWeekendYmd,
  monthGrid,
  monthKey,
  startOfMonthYmd,
} from './dates.ts';

describe('monthGrid', () => {
  it('starts on Monday and covers six weeks', () => {
    const cells = monthGrid('2026-08-15');
    assert.equal(cells.length, 42);
    assert.equal(cells[0]?.ymd, '2026-07-27');
    assert.equal(cells[0]?.weekday, 1);
    assert.equal(cells[0]?.inMonth, false);
    assert.equal(cells[5]?.ymd, '2026-08-01');
    assert.equal(cells[5]?.inMonth, true);
    assert.equal(cells[5]?.weekday, 6);
    assert.equal(cells[41]?.ymd, '2026-09-06');
  });
});

describe('month helpers', () => {
  it('shifts months from the first', () => {
    assert.equal(startOfMonthYmd('2026-08-30'), '2026-08-01');
    assert.equal(monthKey('2026-08-30'), '2026-08');
    assert.equal(addMonthsYmd('2026-08-31', 1), '2026-09-01');
    assert.equal(addMonthsYmd('2026-01-15', -1), '2025-12-01');
  });

  it('names months and marks weekend nights', () => {
    assert.equal(formatMonthTitle('2026-08-01'), 'August 2026');
    assert.equal(isWeekendYmd('2026-08-28'), true);
    assert.equal(isWeekendYmd('2026-08-29'), true);
    assert.equal(isWeekendYmd('2026-08-30'), true);
    assert.equal(isWeekendYmd('2026-08-31'), false);
  });

  it('labels today in the agenda heading', () => {
    const now = new Date('2026-08-30T12:00:00+02:00');
    assert.match(formatAgendaDate('2026-08-30', now), /^Today · /);
    assert.match(formatAgendaDate('2026-08-31', now), /^Tomorrow · /);
  });
});
