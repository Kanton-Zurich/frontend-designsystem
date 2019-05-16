import WindowEventListener from './events';

/**
 * LineClamper is a tool to allow line clamping on some elements
 *
 * @class LineClamper
 */
class LineClamper {
  private options: {
    selector: string,
  }

  private elements: any;
  private recalcExisting: boolean;

  constructor() {
    this.options = {
      selector: '[data-lineclamp="true"]',
    };
  }

  /**
   * Initializing the line clamping and setting up for the first time
   *
   * @memberof LineClamper
   */
  public initLineClamping() {
    this.elements = document.querySelectorAll(this.options.selector);

    this.setLineClamping();
    this.initEventListeners();
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
          element.setAttribute('title', element.innerText);

          element.setAttribute('data-line-clamped', 'true');
        } else {
          element.textContent = element.getAttribute('title');
        }

        const elementHeight = element.clientHeight;

        while (element.scrollHeight > elementHeight) {
          element.textContent = element.textContent.replace(/\W*\s(\S)*$/, '...');
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
