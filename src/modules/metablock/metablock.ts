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
      done: string,
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
        done: '[data-metablock="done"]',
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
    this.eventDelegate.on('click', this.options.domSelectors.buttons, (event) => {
      this.copyTextToClipboard(event.target);
    });
    this.eventDelegate.on('click', this.options.domSelectors.done, () => {
      this.ui.element.querySelector(this.options.domSelectors.notification)
        .classList.add(this.options.stateClasses.hidden);
    });
  }

  /**
   * Copy text to clipboard
   *
   * @param {HTMLElement}
   * @return {void}
   */
  private copyTextToClipboard(target: HTMLElement):void {
    const el = document.createElement('textarea');

    el.value = target.closest('dd').querySelector('span').innerText;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    const selected = document.getSelection().rangeCount > 0
      ? document.getSelection().getRangeAt(0)
      : false;
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }

    this.showNotification();
  }

  /**
   * Show notification message - and hide after 2 seconds
   */
  private showNotification():void {
    const notificationFlashTime = 2000;
    this.ui.element.querySelector(this.options.domSelectors.notification)
      .classList.remove(this.options.stateClasses.hidden);
    setTimeout(() => {
      this.ui.element.querySelector(this.options.domSelectors.notification)
        .classList.add(this.options.stateClasses.hidden);
    }, notificationFlashTime);
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
