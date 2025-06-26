import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import Module from '../../assets/js/helpers/module';

class Carousel extends Module {
  public data: {
    active: number;
    length: number;
    isFullscreen: boolean;
    isInGallery: boolean;
  };
  public ui: {
    element: any;
    slides: any;
    indicator: any;
    slideWrapper: any;
    download: any;
    close: any;
    textalternative: any;
    open: any;
    nextButton: any;
  };
  public options: {
    keyArrowLeft: number;
    keyArrowRight: number;
    domSelectors: {
      indicator: string;
      prevButton: string;
      nextButton: string;
      fullscreenSlide: string;
      slides: string;
      slideWrapper: string;
      close: string;
      open: string;
      fullscreenImageWrapper: string;
      image: string;
      figcaption: string;
      caption: string;
      figure: string;
      ariaFullscreen: string;
    };
    stateClasses: {
      fullscreen: string;
      inverted: string;
      active: string;
    };
  };
  private closeOnEscapeFunction: any;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      active: 1,
      isFullscreen: false,
      isInGallery: false,
    };
    const defaultOptions = {
      keyArrowRight: 39,
      keyArrowLeft: 37,
      domSelectors: {
        indicator: '[data-carousel="indicator"]',
        prevButton: '[data-carousel="prev"]',
        nextButton: '[data-carousel="next"]',
        fullscreenSlide: '.mdl-carousel--fullscreen .mdl-carousel__slide',
        slides: '[data-carousel="slide"]',
        slideWrapper: '[data-carousel="slide-wrapper"]',
        close: '[data-carousel="close"]',
        download: '[data-carousel="download"]',
        open: '[data-carousel="open"]',
        fullscreenImageWrapper: '.mdl-carousel--fullscreen .mdl-image-figure__img-wrapper',
        image: '[data-image-figure="image"]',
        figure: '.mdl-image-figure',
        figcaption: '.mdl-image-figure__caption',
        caption: '[data-figcaption="caption"]',
        textalternative: '[data-carousel="textalternative"]',
        ariaFullscreen: '[data-carousel="ariaFullscreen"]',
      },
      stateClasses: {
        fullscreen: 'mdl-carousel--fullscreen',
        inverted: 'mdl-carousel--cv-inverted',
        active: 'mdl-carousel__slide--active',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initEventListeners();
    this.initWatchers();
    this.initUi(['slides']);

    this.data.length = this.ui.slides.length ? this.ui.slides.length : 1;

    this.handleLazyLoad(0);
    this.setAccessibilityAttributesForSlides();
    this.setAlternativeText();

    if (this.ui.element.parentElement.classList.contains('mdl-image_gallery')) {
      this.data.isInGallery = true;
    }
  }

  static get events() {
    return {};
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
        const key = event.which
          ? event.which === this.options.keyArrowRight // eslint-disable-line
            ? 'ArrowRight'
            : event.which === this.options.keyArrowLeft
            ? 'ArrowLeft'
            : ''
          : event.key; // eslint-disable-line
        switch (key) {
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
      .on('ImageGallery.open', (e) => {
        if (!this.data.isFullscreen) {
          this.data.active = e.detail + 1;
          this.data.isFullscreen = true;

          this.setAccessibilityAttributesForSlides();

          (<any>window).estatico.helpers.setHiddenTabIndex(this.ui.element);
        }
      })
      .on('click', this.options.domSelectors.open, this.open.bind(this))
      .on('click', this.options.domSelectors.close, this.close.bind(this))
      .on('keydown', this.options.domSelectors.close, (event) => {
        if (event.key === 'Tab' && event.shiftKey && this.data.isFullscreen) {
          this.ui.nextButton.focus();

          return false;
        }

        return true;
      })
      .on('keydown', this.options.domSelectors.nextButton, (event) => {
        if (event.key === 'Tab' && !event.shiftKey && this.data.isFullscreen) {
          this.ui.close.focus();

          return false;
        }

        return true;
      });

    this.closeOnEscapeFunction = this.closeOnEscape.bind(this);

    this.ui.slides.forEach((slide) => {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          this.resizeSlide(entry.target);
        }
      });

      resizeObserver.observe(slide);
    });
  }

  resizeSlide(slide) {
    const image = slide.querySelector(
      this.options.domSelectors.fullscreenImageWrapper
    ) as HTMLElement;

    if (image) {
      const figcaption = slide.querySelector(this.options.domSelectors.figcaption) as HTMLElement;
      figcaption.style.width = `${image.clientWidth}px`;
    }
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
    this.handleLazyLoad(this.data.active - 1);
    this.setTransformValue();
    this.setIndicatorText();

    this.setAccessibilityAttributesForSlides();
    this.setAlternativeText();
    this.ui.slides.forEach((slide) =>
      slide.addEventListener(
        'transitionend',
        () => {
          if (this.data.isFullscreen) {
            this.ui.slides[this.data.active - 1]
              .querySelector('button')
              .focus({ preventScroll: true });
          } else {
            this.ui.slides[this.data.active - 1]
              .querySelector('figure')
              .focus({ preventScroll: true });
          }
        },
        { once: true, passive: true }
      )
    );
  }

  /**
   * Handle lazy loading images if necessary
   * @param index
   */
  handleLazyLoad(index) {
    if (!this.ui.slides || !this.ui.slides.length) {
      return;
    }
    const currentImage = this.ui.slides[index]?.querySelector(this.options.domSelectors.image);
    const nextImage = this.ui.slides[index + 1]
      ? this.ui.slides[index + 1].querySelector(this.options.domSelectors.image)
      : null;
    const previousImage = this.ui.slides[index - 1] // eslint-disable-line
      ? this.ui.slides[index - 1].querySelector(this.options.domSelectors.image)
      : index === 0
      ? this.ui.slides[this.ui.slides.length - 1].querySelector(this.options.domSelectors.image)
      : null;
    const lazyloadImage = (imageElement) => {
      if (imageElement) {
        if (imageElement.hasAttribute('data-src')) {
          imageElement.setAttribute('src', imageElement.getAttribute('data-src'));
          imageElement.removeAttribute('data-src');
        }
        if (imageElement.hasAttribute('data-srcset')) {
          imageElement.setAttribute('srcset', imageElement.getAttribute('data-srcset'));
          imageElement.removeAttribute('data-srcset');
        }
        imageElement.addEventListener(
          'load',
          () => {
            const slide = imageElement.closest(this.options.domSelectors.fullscreenSlide);
            if (slide) {
              this.resizeSlide(slide);
            }
            window.dispatchEvent(new Event('resize'));
          },
          { once: true, passive: true }
        );
      }
    };
    lazyloadImage(currentImage);
    lazyloadImage(nextImage);
    lazyloadImage(previousImage);
  }

  /**
   * Sets the necessary margin left value
   *
   * @memberof Carousel
   */
  setTransformValue() {
    const { active } = this.data;
    const transform = (active - 1) * 100 * -1;

    this.ui.slides[0].style.marginLeft = `${transform}%`;

    [...this.ui.slides].forEach((slide, index) => {
      const classListMethod = index === active - 1 ? 'add' : 'remove';

      slide.classList[classListMethod](this.options.stateClasses.active);
    });
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
   * Opens the fullscreen view
   *
   * @memberof Carousel
   */
  open() {
    if (!this.data.isFullscreen) {
      this.data.isFullscreen = true;

      (<any>window).estatico.helpers.setHiddenTabIndex(this.ui.element);
    }
  }

  /**
   * Closes the fullscreen view
   *
   * @memberof Carousel
   */
  close() {
    this.data.isFullscreen = false;

    if (this.ui.element.parentElement.classList.contains('mdl-image_gallery')) {
      this.ui.element.parentElement.dispatchEvent(
        new CustomEvent('Carousel.close', { detail: this.data.active })
      );
    }

    this.ui.slides.forEach((slide) => {
      const figcaption = slide.querySelector(this.options.domSelectors.figcaption) as HTMLElement;
      figcaption.removeAttribute('style');
    });

    (<any>window).estatico.helpers.resetHiddenTabIndex();
  }

  /**
   * Close on escape
   *
   * @param {*} event
   * @memberof Carousel
   */
  closeOnEscape(event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      this.close();

      if (!this.data.isInGallery) {
        this.ui.open[this.data.active - 1].focus();
      }
    }
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

      this.setTransformValue();
      disableBodyScroll(this.ui.element);
      document.documentElement.classList.add('locked');

      window.addEventListener('keydown', this.closeOnEscapeFunction);

      [].slice
        .call(this.ui.element.querySelectorAll(this.options.domSelectors.ariaFullscreen))
        .forEach((e) => e.setAttribute('aria-hidden', 'true'));

      (<any>window).estatico.helpers.wrapAccessibility(this.ui.element);
      setTimeout(() => {
        this.ui.close.focus();
      }, 0);
    } else {
      this.ui.element.classList.remove(this.options.stateClasses.fullscreen);
      this.ui.element.classList.remove(this.options.stateClasses.inverted);

      this.removeCaptionStyles();

      enableBodyScroll(this.ui.element);
      document.documentElement.classList.remove('locked');
      window.removeEventListener('keydown', this.closeOnEscapeFunction);

      [].slice
        .call(this.ui.element.querySelectorAll(this.options.domSelectors.ariaFullscreen))
        .forEach((e) => e.setAttribute('aria-hidden', 'false'));

      (<any>window).estatico.helpers.unwrapAccessibility(this.ui.element);
    }
  }

  /**
   * Removing the caption styles
   *
   * @memberof Carousel
   */
  removeCaptionStyles() {
    const captions = [...Array.from(document.querySelectorAll(this.options.domSelectors.caption))];

    captions.forEach((caption) => {
      caption.removeAttribute('style');
    });
  }

  /**
   * Setting the tabindex for slides, to make it more accessible
   *
   * @memberof Carousel
   */
  setAccessibilityAttributesForSlides() {
    if (!this.ui.slides || !this.ui.slides.length) {
      return;
    }
    const activeIndex = this.data.active - 1;
    const slidesArray = Array.prototype.slice.call(this.ui.slides);

    [].slice.call(slidesArray[activeIndex].querySelectorAll('button, a')).forEach((e) => {
      e.removeAttribute('tabindex');
      e.removeAttribute('aria-hidden');
    });
    slidesArray[activeIndex].removeAttribute('aria-hidden');

    slidesArray.splice(activeIndex, 1);

    slidesArray.forEach((slide) => {
      [].slice.call(slide.querySelectorAll('button, a')).forEach((e) => {
        e.setAttribute('tabindex', '-1');
        e.setAttribute('aria-hidden', 'true');
      });
      slide.setAttribute('aria-hidden', 'true');
    });
  }

  /**
   * Set textalternative for accessibility
   *
   * @memberof Carousel
   */
  setAlternativeText() {
    if (!this.ui.slides || !this.ui.slides.length) {
      return;
    }
    const activeIndex = this.data.active - 1;
    const activeSlideImg = this.ui.slides[activeIndex].querySelector('img');
    const altAttribute = activeSlideImg.getAttribute('alt');

    this.ui.textalternative.textContent = altAttribute;
  }

  /**
   * Unbind events, remove data, custom teardown
   *
   *
   * @memberof Carousel
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default Carousel;
