/*!
 * Carousel
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class Carousel extends Module {
  public data: {
    active: number,
    length: number,
    isFullscreen: boolean,
  };
  public ui: {
    element: any;
    slides: any;
    indicator: any;
    slideWrapper: any;
    download: any;
  }
  public options: {
    domSelectors: {
      indicator: string,
      prevButton: string,
      nextButton: string,
      slides: string,
      slideWrapper: string,
      close: string,
    },
    stateClasses: {
      fullscreen: string,
      inverted: string,
      downloadHidden: string,
    };
  }

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      active: 1,
      isFullscreen: false,
    };
    const defaultOptions = {
      domSelectors: {
        indicator: '[data-carousel="indicator"]',
        prevButton: '[data-carousel="prev"]',
        nextButton: '[data-carousel="next"]',
        slides: '[data-carousel="slide"]',
        slideWrapper: '[data-carousel="slide-wrapper"]',
        close: '[data-carousel="close"]',
        download: '[data-carousel="download"]',
      },
      stateClasses: {
        fullscreen: 'mdl-carousel--fullscreen',
        inverted: 'mdl-carousel--cv-inverted',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
    this.initWatchers();

    this.data.length = this.ui.slides.length ? this.ui.slides.length : 1;
  }

  static get events() {
    return {
      // eventname: `eventname.${ Carousel.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    (<any>window).estatico.helpers.addSwipeSupport(this.ui.slideWrapper, this.ui.element);

    this.eventDelegate
      .on('click', this.options.domSelectors.prevButton, this.decrement.bind(this))
      .on('click', this.options.domSelectors.nextButton, this.increment.bind(this))
      .on('swipeLeft', this.increment.bind(this))
      .on('swipeRight', this.decrement.bind(this))
      .on('keydown', (event) => {
        switch (event.code) {
          case 'ArrowLeft':
            this.decrement();
            break;
          case 'ArrowRight':
            this.increment();
            break;
          default:
            break;
        }
      })
      .on('click', this.options.domSelectors.slides, () => { this.data.isFullscreen = true; })
      .on('click', this.options.domSelectors.close, () => { this.data.isFullscreen = false; });
  }

  /**
   *Initializing the watchers
   *
   * @memberof Carousel
   */
  initWatchers() {
    this.watch(this.data, 'active', this.onActiveChange.bind(this));
    this.watch(this.data, 'isFullscreen', this.toggleFullscreen.bind(this));
  }

  /**
   * Incrementing the active
   *
   * @memberof Carousel
   */
  increment() {
    if (this.data.active + 1 <= this.data.length) {
      this.data.active += 1;
    } else {
      this.data.active = 1;
    }
  }

  /**
   * Decrementing the active
   *
   * @memberof Carousel
   */
  decrement() {
    if (this.data.active - 1 !== 0) {
      this.data.active -= 1;
    } else {
      this.data.active = this.data.length;
    }
  }

  /**
   * Calls all necessary function when user changes page
   *
   * @memberof Carousel
   */
  onActiveChange() {
    this.setTransformValue();
    this.setIndicatorText();
  }

  /**
   * Sets the necessary margin left value
   *
   * @memberof Carousel
   */
  setTransformValue() {
    const { active } = this.data;
    const transform = ((active - 1) * 100) * -1;

    this.ui.slides[0].style.marginLeft = `${transform}%`;
  }

  /**
   * Sets the text of the indicator
   *
   * @memberof Carousel
   */
  setIndicatorText() {
    const { active } = this.data;

    this.ui.indicator.textContent = active;
  }

  /**
   * Toggling the fullscreen classes
   *
   * @memberof Carousel
   */
  toggleFullscreen() {
    if (this.data.isFullscreen) {
      this.ui.element.classList.add(this.options.stateClasses.fullscreen);
      this.ui.element.classList.add(this.options.stateClasses.inverted);
    } else {
      this.ui.element.classList.remove(this.options.stateClasses.fullscreen);
      this.ui.element.classList.remove(this.options.stateClasses.inverted);
    }
  }


  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default Carousel;
