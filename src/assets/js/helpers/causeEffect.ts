/**
 * The Cause & Effect library
 */

let watcher: () => void;

// eslint-disable-next-line no-unused-vars
const cause = <T>(v: T): [() => T, (updater: T | ((old: T) => T)) => void] => {
  let value: T = v;
  const watchers = [];
  const get = (): T => {
    if (watcher && !watchers.includes(watcher)) watchers.push(watcher);
    return value;
  };
  // eslint-disable-next-line no-unused-vars
  const set = (updater: T | ((old: T) => T)) => {
    const old = value;

    if (typeof updater === 'function') {
      // @ts-expect-error
      value = updater(old);
    } else {
      value = updater;
    }

    if (!Object.is(value, old)) {
      watchers.forEach((n) => n());
    }
  };
  return [get, set];
};

const derive = <T>(fn: () => T) => {
  const get = () => {
    const prev = watcher;
    watcher = get;
    const value = fn();
    watcher = prev;
    return value;
  };
  return get;
};

const effect = (fn: () => void) => derive(fn)();

export { cause, derive, effect };
