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
    const defaultFallbackFunc = (el, maxLines, elHeight, elLineHeight) => {
      // todo: find solution for non webkit browsers for the three dots
      /* while (el.scrollHeight > elHeight) {
        el.textContent = el.textContent.replace(/\W*\s(\S)*$/, '...');
      } */
      if (maxLines) {
        let lineHeight = elLineHeight;
        if (isNaN(lineHeight)) {// eslint-disable-line
          // line-height must be a number (of pixels), falling back to 16px
          lineHeight = 16; // eslint-disable-line
        }

        const maxHeight = lineHeight * maxLines;

        el.style.maxHeight = maxHeight ? maxHeight + 'px' : ''; // eslint-disable-line
        el.style.overflowX = 'hidden';
        el.style.lineHeight = lineHeight + 'px'; // eslint-disable-line
      } else {
        el.style.maxHeight = '';
        el.style.overflowX = '';
      }
    };

    const useFallbackFunc = 'webkitLineClamp' in document.body.style
      ? undefined
      : defaultFallbackFunc;

    const truncateText = (el, maxLines, elHeight, elLineHeight) => {
      if (!isNaN(maxLines)) { // eslint-disable-line
        if (useFallbackFunc) {
          useFallbackFunc(el, maxLines, elHeight, elLineHeight);
        } else {
          el.style.overflow = 'hidden';
          el.style.textOverflow = 'ellipsis';
          el.style.webkitBoxOrient = 'vertical';
          el.style.display = '-webkit-box';
          el.style.webkitLineClamp = maxLines ? maxLines : ''; // eslint-disable-line
        }
      }
    };

    if (this.elements.length > 0) {
      this.elements.forEach((element) => {
        if (!element.hasAttribute('data-line-clamped')) {
          element.setAttribute('title', element.innerText);
          element.setAttribute('data-line-clamped', 'true');
        } else {
          element.textContent = element.getAttribute('title');
        }
        let elementHeight = parseInt(window.getComputedStyle(element).getPropertyValue('max-height'), 10);
        if (isNaN(elementHeight)) {// eslint-disable-line
          elementHeight = parseInt(window.getComputedStyle(element).getPropertyValue('height'), 10);
        }
        const computedLineHeight = parseInt(window.getComputedStyle(element).getPropertyValue('line-height'), 10);
        const lines = Math.floor(elementHeight / computedLineHeight);
        truncateText(element, lines, elementHeight, computedLineHeight);
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
