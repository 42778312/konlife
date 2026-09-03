export const SW_BUILD_META = 'konvita-build';
export const SW_UPDATED_KEY = 'konvita.updated';

export function shouldRegisterServiceWorker(hostname: string): boolean {
  return hostname !== 'localhost' && hostname !== '127.0.0.1';
}

export function shouldReloadForBuild(input: {
  currentBuild: string | null | undefined;
  remoteBuild: string | null | undefined;
  alreadyReloadedFor: string | null | undefined;
}): boolean {
  const current = input.currentBuild?.trim() || '';
  const remote = input.remoteBuild?.trim() || '';
  if (!current || !remote) return false;
  if (current === remote) return false;
  if (input.alreadyReloadedFor === remote) return false;
  return true;
}

/** Inline classic script for +html.tsx. Keep ES5-ish; iOS home-screen PWAs restore this document. */
export const REGISTER_SW_SCRIPT = `
if ('serviceWorker' in navigator) {
  var host = location.hostname;
  if (host !== 'localhost' && host !== '127.0.0.1') {
    function readBuildMeta() {
      var meta = document.querySelector('meta[name="${SW_BUILD_META}"]');
      return meta ? meta.getAttribute('content') : '';
    }
    function checkRemoteBuild() {
      fetch('/version.json', { cache: 'no-store' })
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(function (data) {
          var remote = data && data.build ? String(data.build) : '';
          var current = readBuildMeta() || '';
          var seen = '';
          try { seen = sessionStorage.getItem('${SW_UPDATED_KEY}') || ''; } catch (e) {}
          if (!current || !remote || current === remote || seen === remote) return;
          try { sessionStorage.setItem('${SW_UPDATED_KEY}', remote); } catch (e) {}
          location.reload();
        })
        .catch(function () {});
    }
    function checkForUpdate(reg) {
      if (reg) reg.update();
      checkRemoteBuild();
    }
    function register() {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/', updateViaCache: 'none' })
        .then(checkForUpdate)
        .catch(function () {});
    }
    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') {
        navigator.serviceWorker.getRegistration().then(checkForUpdate);
      }
    });
    window.addEventListener('pageshow', function () {
      navigator.serviceWorker.getRegistration().then(checkForUpdate);
    });
    if (navigator.serviceWorker.controller) {
      var refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', function () {
        if (refreshing) return;
        refreshing = true;
        location.reload();
      });
    }
  }
}
`;
