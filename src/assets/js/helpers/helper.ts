import { debounce } from 'lodash';

import { INTERACTION_ELEMENTS_QUERY } from './constants';


class Helper {
  /** So Touchmove and touchstart can talk about initial values */
  private swipeData: {
    initialX: number;
    initialY: number;
  }

  /*
   * Create a console.log wrapper with optional namespace/context
   * Run "localStorage.debug = true;" to enable
   * Run "localStorage.removeItem('debug');" to disable
   * This is overwritten when in dev mode (see dev.js)

   * Usage inside a module:
   * "this.log('it's now initialised);"

   * Output:
   * `MyModule -> it's now initialised`

   * The output form depends on build flag - without --dev it will be plain message
   * with the --dev flag it will be more corefull message using bows plugin
   */
  /**
   * Log function
   * @param context
   */
  public log(context) {
    let fn = () => {};

    if (window.localStorage && localStorage.debug) {
      if (typeof context === 'string' && context.length > 0) {
        fn = Function.prototype.bind.call(console.log, console, `${context} ☞`); //eslint-disable-line
      } else {
        fn = Function.prototype.bind.call(console.log, console); //eslint-disable-line
      }
    }

    return fn;
  }

  /**
   * a simple event handler wrapper
   * @param el
   * @param ev
   * @param callback
   */
  public on(el, ev, callback) {
    if (el.addEventListener) {
      el.addEventListener(ev, callback, false);
    } else if (el.attachEvent) {
      el.attachEvent(`on${ev}`, callback);
    }
  }

  /**
   * Deep extend
   * @param destination
   * @param source
   */
  public extend(destination, source) {
    let property;

    for (property in source) { // eslint-disable-line no-restricted-syntax
      if (source[property]
          && source[property].constructor
          && source[property].constructor === Object) {
        destination[property] = destination[property] || {}; // eslint-disable-line

        this.extend(destination[property], source[property]);
      } else {
        destination[property] = source[property]; // eslint-disable-line no-param-reassign
      }
    }
    return destination;
  }

  /**
   * Sending the redraw event to all children who need it
   *
   * @param {HTMLElement} container
   * @memberof Helper
   */
  public sendRedrawEvent(container) {
    const childNodes = [].slice.call(container.querySelectorAll('[data-redraw]'));

    childNodes.forEach((child) => {
      child.dispatchEvent(new CustomEvent('redraw'));
    });
  }

  /**
   * Adds the event listeners for swipe support
   *
   * @param {any} element
   * @memberof Helper
   */
  public addSwipeSupport(element: any, eventDelegate: any) {
    const debounceDelay = 100;

    element.addEventListener('touchstart', (event) => { this.onTouchStart(event); }, false);
    element.addEventListener('touchmove', debounce((event) => { this.onTouchMove(event, element, eventDelegate); }, debounceDelay), false);
  }

  /**
   * Handler for touchstart
   *
   * @private
   * @param {any} event
   * @memberof Helper
   */
  private onTouchStart(event: any) {
    this.swipeData = {
      initialX: event.touches[0].clientX,
      initialY: event.touches[0].clientY,
    };
  }

  /**
   * Handler for touchmove
   *
   * @private
   * @param {any} event
   * @param {any} element
   * @memberof Helper
   */
  private onTouchMove(event: any, element: any, eventDelegate: any) {
    if (this.swipeData) {
      const tolerance = 33;
      const currentX = event.touches[0].clientX;
      const currentY = event.touches[0].clientY;

      const diffX = this.swipeData.initialX - currentX;
      const diffY = this.swipeData.initialY - currentY;

      let eventName: string = '';

      // When the movement was bigger than a certain tolerance
      if (Math.abs(diffX) > tolerance || Math.abs(diffY) > tolerance) {
        if (Math.abs(diffX) > Math.abs(diffY)) {
          eventName = diffX > 0 ? 'swipeLeft' : 'swipeRight';
        } else {
          eventName = diffY > 0 ? 'swipeUp' : 'swipeDown';
        }

        eventDelegate.dispatchEvent(new CustomEvent(eventName));
      }
    }
  }
  /**
   * Sets tabindex -1 for a nodelist and saves existing tabindexes
   *
   * @param {NodeList} nodes
   * @memberof Helper
   */
  public setHiddenTabIndex(excludeNode) {
    [].slice.call(window.document.querySelectorAll(INTERACTION_ELEMENTS_QUERY)).forEach((focusable) => { // eslint-disable-line
      if (!excludeNode.contains(focusable)) {
        if (focusable.hasAttribute('tabindex')) {
          focusable.setAttribute('data-tabindex', focusable.getAttribute('tabindex'));
        }

        focusable.setAttribute('tabindex', '-1');
      }
    });
  }

  /**
   * Resets the tabindex by removing the attribute or taking the saved value in data-tabindex
   *
   * @param {NodeList} nodes
   * @memberof Helper
   */
  public resetHiddenTabIndex() {
    [].slice.call(window.document.querySelectorAll(INTERACTION_ELEMENTS_QUERY)).forEach((focusable) => { // eslint-disable-line
      const tabindex = focusable.hasAttribute('data-tabindex') ? focusable.getAttribute('data-tabindex') : false;

      if (tabindex) {
        focusable.setAttribute('tabindex', tabindex);
      } else {
        focusable.removeAttribute('tabindex');
      }
    });
  }
}

export default Helper;
