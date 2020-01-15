/*!
 * Metablock
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class Metablock extends Module {
  public ui: {
    element: HTMLDListElement,
  };

  public options: {
    domSelectors: {
      buttons: string,
      notification: string,
    },
    stateClasses: {
      hidden: string,
    }
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        buttons: '[data-metablock="copy"]',
        notification: '.mdl-metablock__copy-success-notification',
      },
      stateClasses: {
        hidden: 'mdl-metablock__copy-success-notification--hidden',
      },
    };

    super($element, defaultData, defaultOptions, data, options);
    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      // eventname: `eventname.${ Metablock.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.log('init');
    this.eventDelegate.on('click', this.options.domSelectors.buttons, (event) => {
      this.log(event);
      this.copyTextToClipboard(event.target);
    });
  }

  /**
   * Copy text to clipboard
   *
   * @param {EventTarget}
   * @return {void}
   */
  private copyTextToClipboard(target: EventTarget):void {
    this.log(target);
    this.ui.element.querySelector(this.options.domSelectors.notification)
      .classList.remove(this.options.stateClasses.hidden);
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default Metablock;
