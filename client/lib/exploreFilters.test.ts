import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  dayFilterLabel,
  isAllVenues,
  matchesVenueFilter,
  priceFilterLabel,
  toggleVenue,
  venueFilterLabel,
} from './exploreFilters.ts';

const catalog = ['Grey', 'K9', 'Stadt'];

describe('isAllVenues', () => {
  it('treats an empty selection as all', () => {
    assert.equal(isAllVenues([], catalog), true);
  });

  it('treats a full catalog selection as all', () => {
    assert.equal(isAllVenues(catalog, catalog), true);
  });

  it('treats a partial selection as filtered', () => {
    assert.equal(isAllVenues(['Grey'], catalog), false);
  });
});

describe('matchesVenueFilter', () => {
  it('passes every venue when nothing is picked', () => {
    assert.equal(matchesVenueFilter('Grey', [], catalog), true);
    assert.equal(matchesVenueFilter('K9', [], catalog), true);
  });

  it('keeps only picked venues', () => {
    assert.equal(matchesVenueFilter('Grey', ['Grey', 'Stadt'], catalog), true);
    assert.equal(matchesVenueFilter('K9', ['Grey', 'Stadt'], catalog), false);
  });
});

describe('venueFilterLabel', () => {
  it('names the dimension when all venues are in', () => {
    assert.equal(venueFilterLabel([], catalog), 'Where');
    assert.equal(venueFilterLabel(catalog, catalog), 'Where');
  });

  it('uses the venue name for a single pick', () => {
    assert.equal(venueFilterLabel(['Grey'], catalog), 'Grey');
  });

  it('counts when several venues are on', () => {
    assert.equal(venueFilterLabel(['Grey', 'K9'], catalog), '2 venues');
  });
});

describe('dayFilterLabel / priceFilterLabel', () => {
  it('uses the dimension name at the default', () => {
    assert.equal(dayFilterLabel('All'), 'When');
    assert.equal(priceFilterLabel('all'), 'Price');
  });

  it('uses the picked value when filtered', () => {
    assert.equal(dayFilterLabel('Fri'), 'Fri');
    assert.equal(priceFilterLabel('free'), 'Free');
    assert.equal(priceFilterLabel('paid'), 'Paid');
  });
});

describe('toggleVenue', () => {
  it('narrows from all to one venue', () => {
    assert.deepEqual(toggleVenue('Grey', [], catalog), ['Grey']);
  });

  it('adds and removes venues', () => {
    assert.deepEqual(toggleVenue('K9', ['Grey'], catalog), ['Grey', 'K9']);
    assert.deepEqual(toggleVenue('Grey', ['Grey', 'K9'], catalog), ['K9']);
  });

  it('returns to all when the last venue is cleared', () => {
    assert.deepEqual(toggleVenue('Grey', ['Grey'], catalog), []);
  });

  it('returns to all when every catalog venue is picked', () => {
    assert.deepEqual(toggleVenue('Stadt', ['Grey', 'K9'], catalog), []);
  });
});
