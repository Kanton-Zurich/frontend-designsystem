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
      expanded: string,
    };
  }

  public ui: {
    element: any,
    showAllButton: any,
  }

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        showAllButton: '[data-topiclist="showAllTrigger"]',
        contentNavItems: '[data-init="topiclist"] .mdl-content_nav > ul > li',
      },
      stateClasses: {
        expanded: 'mdl-topiclist--expanded',
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
    this.ui.element.classList.add(this.options.stateClasses.expanded);

    this.ui.showAllButton.remove();
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
