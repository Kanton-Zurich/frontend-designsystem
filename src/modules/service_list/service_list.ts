/*!
 * Modal
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';


class ServiceList extends Module {
  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        items: 'a[role="internal-service"]',
      },
      stateClasses: {},
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      // openModal: 'Modal.open',
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    const serviceElements = this.ui.element.querySelectorAll(this.options.domSelectors.items);
    serviceElements.forEach((service) => {
      service.addEventListener('click', (event) => {
        const openModal = () => {
          document.querySelector(`#${service.getAttribute('aria-controls')}`).dispatchEvent(new CustomEvent('Modal.open'));
        };
        const modal = document.querySelector(`#${service.getAttribute('aria-controls')}`);
        if (modal.getAttribute('data-loaded')) {
          openModal();
        } else {
          this.fetchServicePage(service.getAttribute('href'), (data) => {
            modal.innerHTML = data;
            modal.setAttribute('data-loaded', 'true');
            document.querySelector(`#${service.getAttribute('aria-controls')}`).dispatchEvent(new CustomEvent('Modal.setCloseButton'));
            openModal();
          });
        }
        event.preventDefault();
      });
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

export default ServiceList;
