/*!
 * ContactEntry
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class ContactEntry extends Module {
  public ui: {
    element: any;
    copyButton: HTMLButtonElement;
    copySource: HTMLElement;
  };

  public options: {
    domSelectors: {
      copyButton: string;
      copySource: string;
    };
    stateClasses: {};
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        copyButton: '[data-contact-copy-button]',
        copySource: '[data-contact-copy-source]',
      },
      stateClasses: {},
    };

    super($element, defaultData, defaultOptions, data, options);
    this.initUi();
    this.initEventListeners();
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    // CR CZHDEV-2961
    if (this.ui.copyButton) {
      const confirm = this.ui.copyButton.parentNode.querySelector(
        '.mdl-contact_entry__copy-button-confirm'
      ) as HTMLSpanElement;
      const caution = this.ui.copyButton.parentNode.querySelector(
        '.mdl-contact_entry__copy-button-caution'
      ) as HTMLSpanElement;

      this.eventDelegate.on('click', this.options.domSelectors.copyButton, () => {
        if (this.ui.copySource) {
          navigator.clipboard
            .writeText(this.ui.copySource.innerText)
            .then(() => {
              confirm.style.display = 'block';
              caution.style.display = 'none';
            })
            .catch(() => {
              caution.style.display = 'block';
              confirm.style.display = 'none';
            });
        }
      });
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

export default ContactEntry;
