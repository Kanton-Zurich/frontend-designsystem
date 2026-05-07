export const sanitizeFileSize = (fileSize) => {
  if (fileSize === 0) return '0 Bytes';

  const k = 1024;
  const dm = 1;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(fileSize) / Math.log(k));

  return `${parseFloat((fileSize / k ** i).toFixed(dm))} ${sizes[i]}`;
};

export const sanitizeSearchString = (searchWord: string) => searchWord.replace(/[<>+'"#&]/gi, '');

export const detectSafari = () => !!navigator.userAgent.match(/Version\/[\d.]+.*Safari/);

/**
 * Polyfill to get correct animation event for each browser
 * @param animationEventType
 */
export const animationEvent = (animationEventType) => {
  const el = document.createElement('fake');
  const animEndEventNames = {
    WebkitAnimation: `webkitAnimation${animationEventType
      .charAt(0)
      .toUpperCase()}${animationEventType.slice(1)}`, // Saf 6, Android Browser
    MozAnimation: `animation${animationEventType}`, // only for FF < 15
    animation: `animation${animationEventType}`, // IE10, Opera, Chrome, FF 15+, Saf 7+
  };

  for (let t in animEndEventNames) {
    if (el.style[t] !== undefined) {
      return animEndEventNames[t];
    }
  }
};

/**
 * Retrieves one or more values from the current URL's search parameters.
 *
 * @param param - The name of the query parameter to retrieve.
 * @param singleValue - Whether to return a single value (string) or all values (array).
 * @returns A string, array of strings, or null if not present.
 */
// Overload signatures
// eslint-disable-next-line no-unused-vars
export function getURLParam(param: string, singleValue: true): string | null;
// eslint-disable-next-line no-redeclare, no-unused-vars
export function getURLParam(param: string, singleValue?: false): string[] | null;

// Implementation
// eslint-disable-next-line no-redeclare
export function getURLParam(param: string, singleValue = false): string | string[] | null {
  const searchParams = new URLSearchParams(window.location.search);
  if (!searchParams.has(param)) return null;
  const allValues = searchParams
    .getAll(param)
    .map((v) => sanitizeSearchString(decodeURIComponent(v)));
  return singleValue ? allValues[0] : allValues;
}

/**
 * Get all URL params as object
 */
export const getAllURLParams = () => {
  const queryString = window.location.search;
  const stringParams =
    queryString.split('?').length > 1 ? queryString.split('?')[1].split('&') : null;
  let params = {};
  if (stringParams) {
    params = stringParams.reduce((total, amount) => {
      const keyValue = amount.split('=');
      total[keyValue[0]] = total[keyValue[0]] ? total[keyValue[0]] : [];
      total[keyValue[0]].push(keyValue[1] ? sanitizeSearchString(keyValue[1]) : null); // eslint-disable-line
      return total;
    }, {});
  }
  return params;
};

export const stripWhitespace = (string: string): string => string.replaceAll(' ', '');

export const removeProtocol = (string: string): string => string.replace(/(.*?):\/\//, '');

export const isExternalURL = (url: string): boolean => {
  if (!url.includes('://')) return false; // treat mailto and tel URLs as internal
  try {
    const siteHostname = new URL(window.location.origin).hostname;
    const urlHostname = new URL(url, window.location.origin).hostname;
    return urlHostname !== siteHostname && !urlHostname.endsWith(`.${siteHostname}`);
  } catch (error) {
    return false;
  }
};

export const isSafeURL = (url: string): boolean => {
  if (/^(mailto|tel):/i.test(url) || !url.includes('://')) return true; // treat mailto and tel URLs as safe
  try {
    return ['http:', 'https:', 'ftp:'].includes(new URL(url, window.location.origin).protocol);
  } catch (error) {
    return true;
  }
};

export const showElement = (element: HTMLElement, predicate: boolean = true) => {
  element.classList[predicate ? 'remove' : 'add']('hidden');
};

export const hideElement = (element: HTMLElement) => {
  element.classList.add('hidden');
};
