import bows from 'bows';
import A11y from './helpers/a11y';
import Inspector from './helpers/inspector';
import namespace from '../../../assets/js/helpers/namespace';
import Grid from './helpers/grid';

// Enable by default
// Remove these lines and run "localStorage.removeItem('debug');" to disable
try {
  if (window.localStorage && !localStorage.debug) {
    localStorage.debug = true;
  }
  window[namespace].helpers.log = bows;
} catch (error) {
  // iOS security fix
}

const inspector = new Inspector();
const a11y = new A11y();
const grid = new Grid();

// Keyboard triggered helpers
document.onkeydown = (e: any) => {
  const event = e || window.event;
  const keyA = 65;
  const keyM = 77;
  const keyG = 71;

  if (event.keyCode === keyM && event.ctrlKey) { // ctrl+m
    inspector.run();
  } else if (e.keyCode === keyA && event.ctrlKey) { // ctrl+a
    a11y.run();
  } else if (e.keyCode === keyG && event.ctrlKey) { // ctrl + g
    grid.run();
  }
};
