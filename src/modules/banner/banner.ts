/*!
 * HeaderBanner
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import WindowEventListener from '../../assets/js/helpers/events';

class Banner extends Module {
  public data: {
    closedItems: Array<string>;
  };

  public options: {
    domSelectors: any;
    stateClasses: any;
    uid: string;
    fetchURL: string;
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      closedItems: [],
    };
    const defaultOptions = {
      uid: $element.dataset.uid,
      fetchURL: $element.dataset.fetchUrl,
      domSelectors: {
        close: '[data-banner="close"]',
      },
      stateClasses: {
        closing: 'mdl-banner--closing',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate.on('click', this.options.domSelectors.close, this.close.bind(this));
    this.eventDelegate.on('redraw', this.initBanner.bind(this));

    (<any>WindowEventListener).addDebouncedResizeListener(this.initBanner.bind(this));
    this.loadBanner();
  }

  async loadBanner() {
    if (this.options.fetchURL) {
      fetch(this.options.fetchURL, {
        headers: {
          'Content-Type': 'text/html',
        },
      })
        .then((response) => {
          // eslint-disable-next-line
          if (response.status !== 200 && response.status !== 204) {
            throw new Error('Server error while fetching data');
          }
          return response.status === 204 ? '' : response.text(); // eslint-disable-line
        })
        .then((response) => {
          if (response) {
            if (response.length === 0) {
              throw new Error('Empty data');
            }
            this.ui.element.innerHTML = response;
            const bannerImage = this.ui.element.querySelector('.mdl-banner__image');
            if (bannerImage) {
              bannerImage.onload = () => {
                this.initBanner();
              };
            }
            if (this.supportsLocalStorage() && localStorage.getItem('closedBanners')) {
              const uid = this.ui.element.querySelector('[data-uid]').getAttribute('data-uid');
              this.data.closedItems = JSON.parse(localStorage.getItem('closedBanners'));
              if (this.data.closedItems.indexOf(uid) >= 0) {
                this.destroy();

                this.ui.element.remove();
              } else {
                this.initBanner();
              }
            } else {
              this.initBanner();
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.error('No fetch url given');
    }
  }

  initBanner() {
    if (this.supportsLocalStorage() && localStorage.getItem('closedBanners')) {
      const uidElement = this.ui.element.querySelector('[data-uid]');
      if (uidElement) {
        const uid = uidElement.getAttribute('data-uid');
        this.data.closedItems = JSON.parse(localStorage.getItem('closedBanners'));
        if (this.data.closedItems.indexOf(uid) >= 0) {
          this.destroy();
          this.ui.element.remove();
          return;
        }
      } else {
        return;
      }
    }
    const lytWrapper = this.ui.element.querySelector('.lyt-wrapper');
    if (lytWrapper) {
      this.ui.element.style.maxHeight = `${lytWrapper.offsetHeight}px`;
    }
    this.dispatchVerticalResizeEvent(400); // eslint-disable-line
  }

  close() {
    this.ui.element.style.maxHeight = `${this.ui.element.getBoundingClientRect().height}px`;
    this.ui.element.classList.add(this.options.stateClasses.closing);
    this.ui.element.style.maxHeight = '0px';
    this.dispatchVerticalResizeEvent(400); // eslint-disable-line

    this.writeToLocalStorage();
  }

  writeToLocalStorage() {
    const uid = this.ui.element.querySelector('[data-uid]').getAttribute('data-uid');
    this.data.closedItems.push(uid);

    if (this.supportsLocalStorage()) {
      localStorage.setItem('closedBanners', JSON.stringify(this.data.closedItems));
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

export default Banner;
