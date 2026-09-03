import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isIosInstallEligible, isIosSafariUserAgent } from './iosInstall.ts';

const IPHONE_SAFARI =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const IPHONE_CHROME =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/128.0.6613.98 Mobile/15E148 Safari/604.1';
const ANDROID_CHROME =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36';
const DESKTOP_CHROME =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

describe('ios install eligibility', () => {
  it('accepts iPhone Safari in the browser', () => {
    assert.equal(isIosSafariUserAgent(IPHONE_SAFARI), true);
    assert.equal(
      isIosInstallEligible({
        userAgent: IPHONE_SAFARI,
        standalone: false,
        displayModeStandalone: false,
      }),
      true,
    );
  });

  it('rejects Chrome on iPhone, Android, and desktop', () => {
    assert.equal(isIosSafariUserAgent(IPHONE_CHROME), false);
    assert.equal(isIosSafariUserAgent(ANDROID_CHROME), false);
    assert.equal(isIosSafariUserAgent(DESKTOP_CHROME), false);
  });

  it('hides once the app is on the Home Screen', () => {
    assert.equal(
      isIosInstallEligible({
        userAgent: IPHONE_SAFARI,
        standalone: true,
        displayModeStandalone: false,
      }),
      false,
    );
    assert.equal(
      isIosInstallEligible({
        userAgent: IPHONE_SAFARI,
        standalone: false,
        displayModeStandalone: true,
      }),
      false,
    );
  });

  it('allows a preview unless already installed', () => {
    assert.equal(
      isIosInstallEligible({
        userAgent: DESKTOP_CHROME,
        standalone: false,
        displayModeStandalone: false,
        preview: true,
      }),
      true,
    );
    assert.equal(
      isIosInstallEligible({
        userAgent: DESKTOP_CHROME,
        standalone: false,
        displayModeStandalone: true,
        preview: true,
      }),
      false,
    );
  });
});
