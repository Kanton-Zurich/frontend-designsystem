/*!
 * ServiceButton
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class ServiceButton extends Module {
  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        // item: '[data-${{{className}}.name}="item"]'
      },
      stateClasses: {
        // activated: 'is-activated'
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      // eventname: `eventname.${ ServiceButton.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.ui.element.addEventListener('click', (event) => {
      const modal = document.querySelector(`#${this.ui.element.getAttribute('aria-controls')}`);
      const openModal = () => {
        modal.dispatchEvent(new CustomEvent('Modal.open'));
      };

      if (modal.getAttribute('data-loaded')) {
        openModal();
      } else {
        this.fetchServicePage(this.ui.element.getAttribute('data-url'), (data) => {
          const elem = document.createElement('div');
          elem.innerHTML = data;
          modal.innerHTML = elem.querySelector('#lightbox-content').innerHTML;
          modal.setAttribute('data-loaded', 'true');
          modal.dispatchEvent(new CustomEvent('Modal.initContent'));
          openModal();
        });
      }
      event.preventDefault();
    });
  }

  /**
   * Fetch page data
   */
  async fetchServicePage(url: string, callback: Function) {
    if (!window.fetch) {
      await import('whatwg-fetch');
    }
    return window.fetch(url)
      .then((response) => {
        if (response) {
          response.text().then((text) => { callback(text); });
        }
      })
      .catch((err) => {
        this.log('Data could not be loaded!', err);
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

export default ServiceButton;
