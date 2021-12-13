/*!
 * Application
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import WindowEventListener from '../../assets/js/helpers/events';
import PageHeader from '../page_header/page_header';

class Application extends Module {
  public options: {
    domSelectors: any,
    stateClasses: any,
    transitionDelay: number,
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
      },
      stateClasses: {
        // activated: 'is-activated'
      },
      transitionDelay: 300,
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      initScripts: 'Application.initScripts',
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate.on('Application.initScripts', this.initScripts.bind(this));

    (<any>WindowEventListener).addDebouncedResizeListener(() => {
      this.verticalSizeUpdate();
    });

    const pageHeader = document.querySelector('.mdl-page-header');

    if (pageHeader) {
      pageHeader
        .addEventListener(PageHeader.events.expandTriggered, () => {
          this.verticalSizeUpdate();
          window.dispatchEvent(new CustomEvent('resize'));
        });
      pageHeader
        .addEventListener(PageHeader.events.collapseTriggered, () => {
          this.verticalSizeUpdate();
          window.dispatchEvent(new CustomEvent('resize'));
        });
    }
    setTimeout(() => {
      this.verticalSizeUpdate();
      window.dispatchEvent(new CustomEvent('resize'));
    }, this.options.transitionDelay);
  }

  /**
   * Re initialize script tags if loaded asynchronously
   */
  initScripts() {
    if (!this.scriptsInitialized) {
      this.runScripts(this.ui.element);
    }
  }

  verticalSizeUpdate() {
    let pageHeader = document.querySelector('.mdl-page-header');
    let node = this.ui.element.parentNode;
    while (node !== null) {
      if (node.classList && node.classList.contains('mdl-modal')) {
        pageHeader = node.querySelector('.mdl-page-header');
        break;
      }
      node = node.parentNode;
    }
    const element = this.ui.element.closest('.mdl-application__wrapper--fullWidth');
    let headerSize = 0;
    if (pageHeader) {
      headerSize = pageHeader.getBoundingClientRect().bottom;
    }
    if (element) {
      element.style.height = `${window.innerHeight - headerSize}px`;
    }
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();
  }
}

export default Application;
