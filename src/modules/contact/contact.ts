/*!
 * ContextMenu
 *
 * @author
 * @copyright
 */
import { uniqueId } from 'lodash';

import Module from '../../assets/js/helpers/module';
import WindowEventListener from '../../assets/js/helpers/events';

import { INTERACTION_ELEMENTS_QUERY } from '../../assets/js/helpers/constants';

class Contact extends Module {
  public ui: {
    element: any,
    mediaSection: HTMLDivElement,
    trigger: HTMLAnchorElement,
    mediaContact: HTMLDivElement,
  };

  public options: {
    domSelectors: {
      mediaSection: string,
      trigger: string,
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
        trigger: '.mdl-contact__section-cell--media .mdl-contact__subtitle a'
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
    this.eventDelegate
      .on('click', this.options.domSelectors.trigger, (event) => {
        event.preventDefault();
        /*event.stopPropagation();*/
        this.log('Trigger click');
        this.toggleContact();
      });
  }


  toggleContact() {
    const openClass = this.options.stateClasses.open;

    if (this.ui.mediaSection.classList.contains(openClass)) {
      this.ui.mediaSection.classList.remove(openClass);
      this.ui.mediaContact.setAttribute('aria-hidden', 'true');
    } else {
      this.ui.mediaSection.classList.add(openClass);
      this.ui.mediaContact.setAttribute('aria-hidden', 'false');
    }
  }

  initARIA() {
   /* this.data.uniqueId = uniqueId('contextmenu');

    this.options.trigger.setAttribute('aria-controls', this.data.uniqueId);
    this.ui.element.setAttribute('id', this.data.uniqueId);*/
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
