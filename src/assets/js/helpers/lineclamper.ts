import WindowEventListener from './events';

/**
 * LineClamper is a tool to allow line clamping on some elements
 *
 * @class LineClamper
 */
class LineClamper {
  private options: {
    selector: string,
    maxIterations: Number,
  };

  private elements: any = null;

  constructor() {
    this.options = {
      selector: '[data-lineclamp="true"]',
      maxIterations: 1000,
    };
  }

  /**
   * Initializing the line clamping and setting up for the first time
   *
   * @memberof LineClamper
   */
  public initLineClamping() {
    this.elements = [].slice.call(document.querySelectorAll(this.options.selector));
    this.initEventListeners();
    this.setLineClamping();
  }


  /**
   * Is setting the line clamping for the found elements
   *
   * @private
   * @memberof LineClamper
   */
  private setLineClamping() {
    if (this.elements.length > 0) {
      // IE Hack so foreach is supported
      this.elements = [].slice.call(this.elements);
      this.elements.forEach((element) => {
        if (!element.hasAttribute('data-line-clamped')) {
          element.setAttribute('data-content-before', element.innerHTML.trim());
          element.setAttribute('data-line-clamped', 'true');
        } else {
          element.innerHTML = element.getAttribute('data-content-before');
        }

        let i = 0;
        const cHeight = element.clientHeight;
        let difference = element.scrollHeight - cHeight;
        const heightTolerance = parseInt((<any>window).getComputedStyle(element, null).getPropertyValue('font-size'))/2; // eslint-disable-line
        while (i <= this.options.maxIterations && difference > heightTolerance) {
          element.innerHTML = element.innerHTML.replace(/\W*\s(\S)*$/, '...');
          difference = element.scrollHeight - cHeight;
          i += 1;
        }
        element.style.opacity = 1.0;
      });
    }
  }

  /**
   * Update line clamping, after resize or dom changes
   *
   * @memberof LineClamper
   */
  public updateLineClamping() {
    this.elements = [].slice.call(document.querySelectorAll(this.options.selector));
    this.setLineClamping();
  }

  /**
   * Initializing the event listeners
   *
   * @private
   * @memberof LineClamper
   */
  private initEventListeners() {
    (<any>WindowEventListener).addDebouncedResizeListener(() => {
      this.updateLineClamping();
    }, 'update-line-clamping');

    window.addEventListener('reloadLineClamper', () => {
      this.updateLineClamping();
    });
  }
}

export default LineClamper;
