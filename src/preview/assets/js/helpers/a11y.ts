/**
 * Accessibility helper, outlines element with focus as well as elements with aria attributes
 *
 * Start the debugging with ctrl+a (same to switch to next mode)
 */

import Helper from '../../../../assets/js/helpers/helper';

class A11y extends Helper {
  public logger: Function;
  public mode = null;
  public dataAttribute = 'estaticoDev';
  public className = 'estatico-dev-overlay';
  public activeElInterval = null;
  public currentActiveEl = null;

  constructor() {
    super();
    this.logger = this.log(A11y.name);


    this.logger(`Initialized ${A11y.name}`);
  }

  /**
   * Run
   */
  public run() {
    if (document.documentElement.classList) {
      const focusedElement = 1;
      const ariaElements = 2;

      // Set the mode we're in (1 = focused element, 2 = aria elements)
      if (this.mode === null) {
        this.mode = focusedElement;
      } else {
        this.mode += 1;
      }

      // Run the current mode
      if (this.mode === focusedElement) {
        this.addActiveElement();
      } else if (this.mode === ariaElements) {
        this.removeActiveElement();

        this.addClassToAriaElements();
      } else {
        this.removeClassFromAriaElements();
      }
    } else {
      this.logger('Element.classList not supported in this browser');
    }
  }

  /**
   * Add class to the active element
   */
  public addActiveElement() {
    let activeEl = null;
    const waitInterval = 200;

    this.activeElInterval = setInterval(() => {
      this.currentActiveEl = document.activeElement;

      if (this.currentActiveEl !== activeEl) {
        if (activeEl !== null) {
          activeEl.classList.remove(this.className);
        }

        activeEl = this.currentActiveEl;

        this.logger(activeEl);

        this.currentActiveEl.classList.add(this.className);
      }
    }, waitInterval);
  }

  /**
   * Remove active element
   */
  public removeActiveElement() {
    clearInterval(this.activeElInterval);

    this.currentActiveEl.classList.remove(this.className);
  }

  /**
   * Add class to all aria elements
   */
  public addClassToAriaElements() {
    [].forEach.call(document.querySelectorAll('[*]'), (node) => {
      let log = '';
      const ariaPrefix = 'aria-';

      node.attributes.forEach((attribute) => {
        if (attribute.name === 'role' || attribute.name.substring(0, ariaPrefix.length) === ariaPrefix) {
          log += `[${attribute.name}=${attribute.value}]`;
        }
      });

      if (log !== '') {
        this.logger([node, log]);

        node.classList.add(this.className);
        node.dataset[this.dataAttribute] = log; // eslint-disable-line no-param-reassign
      }
    });
  }

  /**
   * Remove class from aria elements
   */
  public removeClassFromAriaElements() {
    [].forEach.call(document.querySelectorAll('[*]'), (node) => {
      node.classList.remove(this.className);
    });

    this.mode = 0;
  }
}

export default A11y;
