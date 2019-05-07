/*!
 * DownloadList
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import ContextMenu from '../context_menu/context_menu';

class DownloadList extends Module {
  public options: {
    domSelectors: {
      openContext: string,
      contextMenu: string,
    },
    stateClasses: Object,
  }

  public ui: {
    element: any,
  }

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        openContext: '[data-download_list="openContext"]',
        contextMenu: '[data-download_list="contextMenu"]',
      },
      stateClasses: {
        // activated: 'is-activated'
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
  }

  /**
   * Open a context menu
   *
   * @param {*} event
   * @memberof DownloadList
   */
  openContext(event) {
    const target = event.path.find(node => node.tagName === 'LI');
    const contextMenu = target.querySelector(this.options.domSelectors.contextMenu);

    if (!target.hasAttribute('data-open')) {
      new ContextMenu(contextMenu, {}, {
        attachTo: target,
        showImmediate: true,
      });

      target.setAttribute('data-open', '');
    }
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate
      .on('click', this.options.domSelectors.openContext, this.openContext.bind(this));
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default DownloadList;
