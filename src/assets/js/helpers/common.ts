
/* eslint-disable import/prefer-default-export */
export const sanitizeFileSize = (fileSize) => {
  if (fileSize === 0) return '0 Bytes';

  const k = 1024;
  const dm = 1;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(fileSize) / Math.log(k));

  return `${parseFloat((fileSize / (k ** i)).toFixed(dm))} ${sizes[i]}`;
};


export const sanitizeSearchString = (searchWord) => { // eslint-disable-line
  return searchWord.replace(/[\<\>\+\'\"\#\&]/gi, ''); // eslint-disable-line
};
/* eslint-disable */
export const detectSafari = () => {
  return !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
};
/* eslint-enable */

/* eslint-disable */
/**
 * Polyfill to get correct animation event for each browser
 * @param animationEventType
 */
export const animationEvent = (animationEventType) => {
  const el = document.createElement('fake');
  const animEndEventNames = {
      'WebkitAnimation' : `webkitAnimation${animationEventType.charAt(0).toUpperCase()}${animationEventType.slice(1)}`,// Saf 6, Android Browser
      'MozAnimation'    : `animation${animationEventType}`, // only for FF < 15
      'animation'       : `animation${animationEventType}` // IE10, Opera, Chrome, FF 15+, Saf 7+
    };

  for(let t in animEndEventNames){
    if( el.style[t] !== undefined ){
      return animEndEventNames[t];
    }
  }
};
/* eslint-enable */

/**
 * Extract url parameters
 * @param param
 * @param singleValue
 */
export const getURLParam = (param, singleValue = false) => {
  let result = null;
  const url = window.location.href;
  const paramList = url.split('?').length > 1 ? url.split('?')[1].split('&') : null;
  if (paramList) {
    result = paramList.filter(paramString => paramString.substr(0, param.length) === param)
      .map(item => sanitizeSearchString(decodeURIComponent(item.split('=')[1].replace('#', '')))); // eslint-disable-line
    if (result.length > 0 && singleValue) {
      result = result[0].replace('#', '');
    }
  }

  return result && result.length > 0 ? result : null;
};

/**
 * Get all URL params as object
 */
export const getAllURLParams = () => {
  const queryString = window.location.search;
  const stringParams = queryString.split('?').length > 1 ? queryString.split('?')[1].split('&') : null;
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
