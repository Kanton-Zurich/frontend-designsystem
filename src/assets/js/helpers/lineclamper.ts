import WindowEventListener from './events';

/**
 * LineClamper is a tool to allow line clamping on some elements
 *
 * @class LineClamper
 */
class LineClamper {
  private options: {
    selector: string,
  };

  private elements: any = null;
  private maxIterations: number = 20; // eslint-disable-line no-magic-numbers

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
    console.log("-- setLineClamping --");
    console.log('this.elements: ', this.elements);
    const truncateText = (el, maxLines, elHeight) => {
      console.log('el.scrollHeight: ', el.scrollHeight);
      let maxIt = this.maxIterations;
      let currentScrollHeight = 0;
      while (el.scrollHeight > elHeight && maxIt > 0) {
        if (el.scrollHeight !== currentScrollHeight) {
          maxIt = this.maxIterations;
          currentScrollHeight = el.scrollHeight;
        }
        el.textContent = el.textContent.replace(/\W*\s(\S)*$/, '...');
        maxIt -= 1;
      }
    };

    if (this.elements.length > 0) {
      this.elements.forEach((element) => {
        if (!element.hasAttribute('data-line-clamped')) {
          element.setAttribute('title', element.innerText.trim());
          element.setAttribute('data-content-before', element.innerHTML.trim());
          element.setAttribute('data-line-clamped', 'true');
        } else {
          element.innerHTML = element.getAttribute('data-content-before');
        }
        console.log('max-height: ', window.getComputedStyle(element).getPropertyValue('max-height'));
        let elementHeight = parseInt(window.getComputedStyle(element).getPropertyValue('max-height'), 10);
        if (isNaN(elementHeight)) {// eslint-disable-line
          console.log('***** max-height is not a number ****');
          console.log(element.clientHeight);
          elementHeight = parseInt(window.getComputedStyle(element).getPropertyValue('height'), 10);
        }
        console.log('line-height: ', window.getComputedStyle(element).getPropertyValue('line-height'));
        const computedLineHeight = parseInt(window.getComputedStyle(element).getPropertyValue('line-height'), 10);
        const lines = Math.floor(elementHeight / computedLineHeight);

        truncateText(element, lines, elementHeight);
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
