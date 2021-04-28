
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
