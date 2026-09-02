import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { resolveApiBaseUrl } from './config.ts';

describe('resolveApiBaseUrl', () => {
  it('uses the page host on a LAN phone so localhost is not the device', () => {
    assert.equal(
      resolveApiBaseUrl({
        envUrl: 'http://localhost:8000',
        pageHost: '192.168.178.26',
        pageProtocol: 'http:',
      }),
      'http://192.168.178.26:8000',
    );
  });

  it('keeps localhost when the page is local', () => {
    assert.equal(
      resolveApiBaseUrl({
        envUrl: 'http://localhost:8000',
        pageHost: 'localhost',
        pageProtocol: 'http:',
      }),
      'http://localhost:8000',
    );
  });

  it('falls back to env or the default with no page host', () => {
    assert.equal(resolveApiBaseUrl({ envUrl: 'http://10.0.2.2:8000' }), 'http://10.0.2.2:8000');
    assert.equal(resolveApiBaseUrl({}), 'http://localhost:8000');
  });

  it('uses same origin on a public host so nginx can proxy /api', () => {
    assert.equal(
      resolveApiBaseUrl({
        pageHost: 'konstanz.app',
        pageProtocol: 'https:',
      }),
      'https://konstanz.app',
    );
  });

  it('prefers an explicit API URL over a public page host', () => {
    assert.equal(
      resolveApiBaseUrl({
        envUrl: 'https://api.konstanz.app',
        pageHost: 'konstanz.app',
        pageProtocol: 'https:',
      }),
      'https://api.konstanz.app',
    );
  });
});
