/*!
 * Topiclist
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class Topiclist extends Module {
  public options: {
    domSelectors: {
      showAllButton: string,
      contentNavItems: string,
      hiddenContentNavItems: any,
    },
    stateClasses: {
      hiddenItem: string,
    };
  }
  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        showAllButton: '[data-topiclist="showAllTrigger"]',
        contentNavItems: '[data-init="topiclist"] .mdl-content_nav > ul > li',
        hiddenContentNavItems: '[data-init="topiclist"] .mdl-content_nav > ul > li.mdl-content_nav__item--hidden',
      },
      stateClasses: {
        hiddenItem: 'mdl-content_nav__item--hidden',
      },
    };
    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      // eventname: `eventname.${ Topiclist.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate
      .on('click', this.options.domSelectors.showAllButton, this.showAll.bind(this));
  }

  /**
   * Shows all hidden items from the content nav list
   */
  showAll() {
    const firstHiddenItem = (<any> this.ui).hiddenContentNavItems[0];

    (<any> this.ui).hiddenContentNavItems.forEach((element: any) => {
      element.classList.remove(this.options.stateClasses.hiddenItem);
    });
    (<any> this.ui).showAllButton.remove();
    firstHiddenItem.querySelector('a').focus();
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default Topiclist;
