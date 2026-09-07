/**
 * react-native-gesture-handler's web runtime calls `setPointerCapture` /
 * `releasePointerCapture` on raw DOM elements as part of its pan/tap
 * recognizers. Those calls can race a pointer that the browser already
 * released (e.g. a fast swipe-then-release, or overlapping gestures like our
 * swipe-to-save + tap on the ticket cards), which makes the browser throw
 * `NotFoundError: Failed to execute 'setPointerCapture' ... No active
 * pointer with the given id is found`. RNGH doesn't catch it, so it
 * surfaces as an uncaught error that trips Expo Router's error boundary and
 * remounts the screen — which is what reads as the list "freezing then
 * recovering" after a swipe.
 *
 * The error itself is harmless (the pointer is already gone either way), so
 * patch the two methods to swallow just that failure instead of throwing.
 */
if (typeof Element !== 'undefined' && Element.prototype.setPointerCapture) {
  const originalSetPointerCapture = Element.prototype.setPointerCapture;
  Element.prototype.setPointerCapture = function setPointerCapture(pointerId: number) {
    try {
      originalSetPointerCapture.call(this, pointerId);
    } catch {
      // Pointer already released — safe to ignore.
    }
  };

  const originalReleasePointerCapture = Element.prototype.releasePointerCapture;
  Element.prototype.releasePointerCapture = function releasePointerCapture(pointerId: number) {
    try {
      originalReleasePointerCapture.call(this, pointerId);
    } catch {
      // Pointer already released — safe to ignore.
    }
  };
}
