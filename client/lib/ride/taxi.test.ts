import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatTaxiNumber, taxiCallUrl, TAXI_COMPANIES } from './taxi.ts';

describe('taxi companies', () => {
  it('formats Konstanz numbers and builds tel links', () => {
    assert.equal(formatTaxiNumber('0753165300'), '07531 65300');
    assert.equal(formatTaxiNumber('07533998227'), '07533 998227');
    assert.equal(taxiCallUrl('0753165300'), 'tel:+49753165300');
    assert.equal(TAXI_COMPANIES.length, 6);
  });
});
