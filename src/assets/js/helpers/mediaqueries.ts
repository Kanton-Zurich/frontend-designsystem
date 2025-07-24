/**
 * MediaQuery helper
 *
 * Usage example:
 *
 * import mq from '../../assets/js/helpers/mediaqueries';
 * console.log(mq.get('large').matches);
 * mq.get('large').addEventListener('change', (e: MediaQueryListEvent) => console.log(e.matches));
 */
const mq = new Map();
['tiny', 'xsmall', 'small', 'medium', 'large', 'xlarge'].map((size) => {
  const breakpointInPx = getComputedStyle(document.documentElement).getPropertyValue(
    `--breakpoint-${size}`
  );
  const oneEmInPx = 16;

  if (breakpointInPx) {
    const breakpointAsNumber = Number(breakpointInPx.split('px')[0]);
    const bodyFontsizeInPx = window.getComputedStyle(document.querySelector('body')).fontSize;
    const bodyFontsizeAsNumber = Number(bodyFontsizeInPx.split('px')[0]);
    const recalculatedBreakpointAsNumber = (breakpointAsNumber / oneEmInPx) * bodyFontsizeAsNumber; // eslint-disable-line
    const recalculatedBreakpointInPx = `${recalculatedBreakpointAsNumber}px`;
    const mql = window.matchMedia(`(min-width: ${recalculatedBreakpointInPx})`);

    mq.set(size, mql);
  }
  return breakpointInPx;
});

// Export the mq map
export default mq;
