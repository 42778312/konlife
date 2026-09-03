import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  REGISTER_SW_SCRIPT,
  shouldRegisterServiceWorker,
  shouldReloadForBuild,
} from './registerSw.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('service worker registration', () => {
  it('skips localhost and registers everywhere else', () => {
    assert.equal(shouldRegisterServiceWorker('localhost'), false);
    assert.equal(shouldRegisterServiceWorker('127.0.0.1'), false);
    assert.equal(shouldRegisterServiceWorker('konvita.app'), true);
  });

  it('reloads once when the remote build differs', () => {
    assert.equal(
      shouldReloadForBuild({ currentBuild: 'a', remoteBuild: 'b', alreadyReloadedFor: null }),
      true,
    );
    assert.equal(
      shouldReloadForBuild({ currentBuild: 'a', remoteBuild: 'b', alreadyReloadedFor: 'b' }),
      false,
    );
    assert.equal(
      shouldReloadForBuild({ currentBuild: 'a', remoteBuild: 'a', alreadyReloadedFor: null }),
      false,
    );
    assert.equal(
      shouldReloadForBuild({ currentBuild: '__SW_BUILD__', remoteBuild: null, alreadyReloadedFor: null }),
      false,
    );
  });

  it('asks Safari not to cache the worker and to check again on reopen', () => {
    assert.match(REGISTER_SW_SCRIPT, /updateViaCache:\s*'none'/);
    assert.match(REGISTER_SW_SCRIPT, /visibilitychange/);
    assert.match(REGISTER_SW_SCRIPT, /pageshow/);
    assert.match(REGISTER_SW_SCRIPT, /controllerchange/);
    assert.match(REGISTER_SW_SCRIPT, /version\.json/);
    assert.match(REGISTER_SW_SCRIPT, /reg\.update/);
  });

  it('keeps a per-deploy cache placeholder in the worker', () => {
    const sw = readFileSync(join(root, 'public/sw.js'), 'utf8');
    assert.match(sw, /konvita-__SW_BUILD__/);
    assert.match(sw, /cache:\s*'no-store'/);
  });
});
