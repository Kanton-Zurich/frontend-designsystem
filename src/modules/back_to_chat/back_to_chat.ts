/*!
 * BackToChat
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class BackToChat extends Module {
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

    this.initEventListeners();
  }

  static get events() {
    return {
      // eventname: `eventname.${ BackToChat.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    const botHref = sessionStorage.getItem('botHref');
    const urlParams = new URLSearchParams(window.location.search);
    const paramsBackToChat = !!urlParams.get('backToChat');

    if (botHref && paramsBackToChat) {
      const url = new URL(botHref);
      url.searchParams.set('chatbotIsOpen', 'true');
      this.ui.element.querySelector('.mdl-backToChat__button').href = url.href;
      this.ui.element.classList.add('mdl-backToChat--visible');
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

export default BackToChat;
