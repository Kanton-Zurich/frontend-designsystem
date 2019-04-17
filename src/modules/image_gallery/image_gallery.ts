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
    }
    stateClasses: {
      expanded: string,
    }
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
      },
      stateClasses: {
        expanded: 'mdl-image_gallery--expanded',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initEventListeners();
    this.initWatchers();
  }

  setExpanded() {
    this.ui.element.classList.add(this.options.stateClasses.expanded);
  }

  static get events() {
    return {
      // eventname: `eventname.${ ImageGallery.name }.${  }`
    };
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
