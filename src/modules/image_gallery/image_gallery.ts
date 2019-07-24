/*!
 * ImageGallery
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import { INTERACTION_ELEMENTS_QUERY } from '../../assets/js/helpers/constants';

class ImageGallery extends Module {
  public options: {
    domSelectors: {
      showMore: string,
      openCarousel: string,
      carousel: string,
    }
    stateClasses: {
      expanded: string,
      fullscreen: string,
    }
  }

  public ui: {
    element: Element,
    carousel: Element,
    gallery: HTMLElement,
    more: HTMLElement,
    openCarousel: NodeListOf<HTMLElement>;
  }

  public data: {
    isExpanded: boolean,
  }

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      isExpanded: false,
    };
    const defaultOptions = {
      domSelectors: {
        more: '[data-image-gallery="more"]',
        showMore: '[data-image-gallery="showMore"]',
        carousel: '[data-init="carousel"]',
        openCarousel: '[data-carousel="open"]',
        gallery: '[data-image-gallery="gallery"]',
      },
      stateClasses: {
        expanded: 'mdl-image_gallery--expanded',
        fullscreen: 'mdl-image_gallery--fullscreen',
      },
    };

    super($element, defaultData, defaultOptions, data, options);
    this.initEventListeners();
    this.initWatchers();

    this.setIndexNumbers();
  }

  /**
   * Set expanded classes of Image Gallery
   *
   * @memberof ImageGallery
   */
  setExpanded() {
    this.ui.element.classList.add(this.options.stateClasses.expanded);

    (<any>window).estatico.lineClamper.updateLineClamping();

    (<HTMLElement> this.ui.more.querySelector(INTERACTION_ELEMENTS_QUERY)).focus();
  }

  /**
   *Initializing the watchers
   *
   * @memberof Carousel
   */
  initWatchers() {
    this.watch(this.data, 'isExpanded', this.setExpanded.bind(this));
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate
      .on('click', this.options.domSelectors.showMore, () => {
        this.data.isExpanded = true;
      })
      .on('click', this.options.domSelectors.openCarousel, (event, target) => {
        if (!this.ui.element.classList.contains(this.options.stateClasses.fullscreen)) {
          this.ui.element.classList.add(this.options.stateClasses.fullscreen);

          this.ui.carousel.dispatchEvent(new (<any>CustomEvent)('ImageGallery.open', {
            detail: parseInt(target.getAttribute('data-gallery-index'), 10),
          }));
        }
      })
      .on('Carousel.close', (e) => {
        this.ui.element.classList.remove(this.options.stateClasses.fullscreen);

        this.ui.openCarousel[e.detail - 1].focus();
      });
  }

  /**
   * Setting of the index numbers of the images
   *
   * @memberof ImageGallery
   */
  setIndexNumbers() {
    const images = [].slice.call(this.ui.element
      .firstElementChild.querySelectorAll(this.options.domSelectors.openCarousel));

    images.forEach((image, index) => {
      image.setAttribute('data-gallery-index', index.toString());
    });
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default ImageGallery;
