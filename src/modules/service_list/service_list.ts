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
        document.querySelector(`#${service.getAttribute('aria-controls')}`).dispatchEvent(new CustomEvent('Modal.open'));
        event.preventDefault();
      });
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
