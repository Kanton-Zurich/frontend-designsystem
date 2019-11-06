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
    closedItems: Array<string>,
  }

  public options: {
    domSelectors: any,
    stateClasses: any,
    uid: string,
    fetchURL: string,
  }

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

    if (localStorage.getItem('closedBanners')) {
      this.data.closedItems = JSON.parse(localStorage.getItem('closedBanners'));

      if (this.data.closedItems.indexOf(this.options.uid) >= 0) {
        this.destroy();

        this.ui.element.remove();
      } else {
        this.loadBanner();
      }
    } else {
      this.loadBanner();
    }
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate.on('click', this.options.domSelectors.close, this.close.bind(this));
    this.eventDelegate.on('redraw', this.initBanner.bind(this));

    (<any>WindowEventListener).addDebouncedResizeListener(this.initBanner.bind(this));
  }

  async loadBanner() {
    if (this.options.fetchURL) {
      if (!window.fetch) {
        await import('whatwg-fetch');
      }

      fetch(this.options.fetchURL, {
        headers: {
          'Content-Type': 'text/html',
        },
      })
        .then(response => response.text())
        .then((response) => {
          if (response) {
            this.ui.element.innerHTML = response;

            this.initBanner();
          }
        });
    } else {
      console.error('No fetch url given');
    }
  }

  initBanner() {
    const lytWrapper = this.ui.element.querySelector('.lyt-wrapper');
    const secondBanner = this.ui.element.querySelector('.mdl-banner');

    this.ui.element.style.maxHeight = `${lytWrapper.offsetHeight}px`;
    secondBanner.style.maxHeight = `${lytWrapper.offsetHeight}px`;
  }

  close() {
    this.ui.element.style.maxHeight = `${this.ui.element.getBoundingClientRect().height}px`;
    this.ui.element.classList.add(this.options.stateClasses.closing);
    this.ui.element.style.maxHeight = '0px';

    this.writeToLocalStorage();
  }

  writeToLocalStorage() {
    this.data.closedItems.push(this.options.uid);

    localStorage.setItem('closedBanners', JSON.stringify(this.data.closedItems));
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
