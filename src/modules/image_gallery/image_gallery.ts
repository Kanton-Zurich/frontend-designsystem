/*!
 * ImageGallery
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

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

    (<any>window).estatico.lineClamper.initLineClamping();
  }

  /**
   * Set expanded classes of Image Gallery
   *
   * @memberof ImageGallery
   */
  setExpanded() {
    this.ui.element.classList.add(this.options.stateClasses.expanded);

    (<any>window).estatico.lineClamper.updateLineClamping();
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
        this.ui.element.classList.add(this.options.stateClasses.fullscreen);

        this.ui.carousel.dispatchEvent(new (<any>CustomEvent)('ImageGallery.open', {
          detail: parseInt(target.getAttribute('data-gallery-index'), 10),
        }));
      })
      .on('Carousel.close', () => {
        this.ui.element.classList.remove(this.options.stateClasses.fullscreen);
      });
  }

  /**
   * Setting of the index numbers of the images
   *
   * @memberof ImageGallery
   */
  setIndexNumbers() {
    const images = this.ui.element
      .firstElementChild.querySelectorAll(this.options.domSelectors.openCarousel);

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
