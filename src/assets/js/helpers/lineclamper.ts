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
      maxIterations: 100,
    };
  }

  /**
   * Initializing the line clamping and setting up for the first time
   *
   * @memberof LineClamper
   */
  public initLineClamping() {
    this.elements = document.querySelectorAll(this.options.selector);
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
      this.elements.forEach((element) => {
        if (!element.hasAttribute('data-line-clamped')) {
          element.setAttribute('title', element.innerText.trim());
          element.setAttribute('data-content-before', element.innerHTML.trim());
          element.setAttribute('data-line-clamped', 'true');
        } else {
          element.innerHTML = element.getAttribute('data-content-before');
        }

        let i = 0;
        let difference = element.scrollHeight - element.clientHeight;
        const heightTolerance = 5;

        while (i <= this.options.maxIterations && difference > heightTolerance) {
          element.textContent = element.textContent.replace(/\W*\s(\S)*$/, '...');

          difference = element.scrollHeight - element.clientHeight;
          i += 1;
        }
      });
    }
  }

  /**
   * Update line clamping, after resize or dom changes
   *
   * @memberof LineClamper
   */
  public updateLineClamping() {
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
  }
}

export default LineClamper;
