export const IOS_INSTALL_SEEN_KEY = 'konvita.iosInstall.seen';
export const IOS_INSTALL_DELAY_MS = 8000;

export type IosInstallEnv = {
  userAgent: string;
  standalone: boolean;
  displayModeStandalone: boolean;
  preview?: boolean;
};

export function isIosSafariUserAgent(ua: string): boolean {
  if (!/iPhone|iPod/.test(ua)) return false;
  if (/CriOS|FxiOS|EdgiOS|OPiOS|OPT\//.test(ua)) return false;
  return /Safari/i.test(ua) || /AppleWebKit/i.test(ua);
}

export function isIosInstallEligible(input: IosInstallEnv): boolean {
  if (input.standalone || input.displayModeStandalone) return false;
  if (input.preview) return true;
  return isIosSafariUserAgent(input.userAgent);
}

export function readInstallPreview(): boolean {
  if (typeof window === 'undefined') return false;
  if (typeof __DEV__ === 'undefined' || !__DEV__) return false;
  return new URLSearchParams(window.location.search).has('install');
}

export function readIosInstallEligible(): boolean {
  if (typeof window === 'undefined') return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return isIosInstallEligible({
    userAgent: nav.userAgent,
    standalone: nav.standalone === true,
    displayModeStandalone: window.matchMedia('(display-mode: standalone)').matches,
    preview: readInstallPreview(),
  });
}

export function hasIosInstallSeen(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(IOS_INSTALL_SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

export function markIosInstallSeen(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(IOS_INSTALL_SEEN_KEY, '1');
  } catch {
    // private mode
  }
}
