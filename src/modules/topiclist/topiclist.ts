/*!
 * Topiclist
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import namespace from '../../assets/js/helpers/namespace';

class Topiclist extends Module {
  public options: {
    domSelectors: {
      showAllButton: string,
      contentNavItems: string,
    },
    stateClasses: {
      fullscreen: string,
      inverted: string,
      active: string,
    };
  }
  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        showAllButton: '[data-topiclist="showAllTrigger"]',
        contentNavItems: '[data-init="topiclist"] .mdl-content_nav > ul > li'
      },
      stateClasses: {
        // activated: 'is-activated'
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
    console.log('click', this);
    /*contentNavItems: this.ui.element.querySelectorAll('.mdl-content_nav > ul > li')*/
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
