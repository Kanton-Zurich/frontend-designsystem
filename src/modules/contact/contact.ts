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
    copyButton: HTMLButtonElement,
    copySource: HTMLElement,
  };

  public options: {
    domSelectors: {
      mediaSection: string,
      trigger: string,
      triggerSvg: string,
      triggerSpans: string,
      mediaContact: string,
      copyButton: string,
      copySource: string,
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
        copyButton: '[data-contact-copy-button]',
        copySource: '[data-contact-copy-source]',
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
    if (this.ui.trigger) {
      this.ui.trigger.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.toggleContact();
      });
    }

    // CR CZHDEV-2961
    if (this.ui.copyButton) {
      this.eventDelegate.on('click', this.options.domSelectors.copyButton, () => {
        if (this.ui.copySource) {
          const el = document.createElement('textarea');
          el.value = this.ui.copySource.innerText;
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
        }
      });
    }
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
