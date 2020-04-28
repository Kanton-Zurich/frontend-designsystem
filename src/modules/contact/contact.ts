/*!
 * ContextMenu
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class Contact extends Module {
  public ui: {
    element: any,
    mediaSection: HTMLDivElement,
    trigger: HTMLAnchorElement,
    triggerSvg: HTMLElement,
    triggerSpans: HTMLSpanElement[],
    mediaContact: HTMLDivElement,
  };

  public options: {
    domSelectors: {
      mediaSection: string,
      trigger: string,
      triggerSvg: string,
      triggerSpans: string,
      mediaContact: string,
    },
    stateClasses: {
      open: string,
    },
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        mediaSection: '.mdl-contact__section-cell--media',
        mediaContact: '.mdl-contact__section-cell--media .mdl-contact__cell-content',
        trigger: '.mdl-contact__media-trigger',
        triggerSpans: '.mdl-contact__media-trigger span',
        triggerSvg: '.mdl-contact__media-trigger svg',
      },
      stateClasses: {
        open: 'open',
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
    this.ui.trigger.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.toggleContact();
    });
  }


  toggleContact() {
    const openClass = this.options.stateClasses.open;

    if (this.ui.mediaSection.classList.contains(openClass)) {
      this.ui.mediaSection.classList.remove(openClass);
      this.ui.mediaContact.setAttribute('aria-hidden', 'true');
      this.ui.triggerSpans[0].setAttribute('aria-hidden', 'false');
      this.ui.triggerSpans[1].setAttribute('aria-hidden', 'true');
    } else {
      this.ui.mediaSection.classList.add(openClass);
      this.ui.mediaContact.setAttribute('aria-hidden', 'false');
      this.ui.triggerSpans[0].setAttribute('aria-hidden', 'true');
      this.ui.triggerSpans[1].setAttribute('aria-hidden', 'false');
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

export default Contact;
