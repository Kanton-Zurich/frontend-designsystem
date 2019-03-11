import bows from 'bows';
import A11y from './helpers/a11y';
import Inspector from './helpers/inspector';
import namespace from '../../../assets/js/helpers/namespace';

// Enable by default
// Remove these lines and run "localStorage.removeItem('debug');" to disable
if (window.localStorage && !localStorage.debug) {
  localStorage.debug = true;
}

window[namespace].helpers.log = bows;

const inspector = new Inspector();
const a11y = new A11y();

// Keyboard triggered helpers
document.onkeydown = (e: any) => {
  const event = e || window.event;
  const keyA = 65;
  const keyM = 77;

  if (event.keyCode === keyM && event.ctrlKey) { // ctrl+m
    inspector.run();
  } else if (e.keyCode === keyA && event.ctrlKey) { // ctrl+a
    a11y.run();
  }
};
