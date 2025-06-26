/*!
 * PublicationTeaser
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import ContextMenu from '../context_menu/context_menu';

class PublicationTeaser extends Module {
  public options: {
    domSelectors: {
      openContext: string;
      contextMenu: string;
    };
    stateClasses: Object;
  };

  public ui: {
    element: any;
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
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

    this.initContextMenus();
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {}

  /**
   * Initializing the context menus
   *
   * @memberof DownloadList
   */
  initContextMenus() {
    const buttonsInList = [].slice.call(
      this.ui.element.querySelectorAll(this.options.domSelectors.openContext)
    );

    buttonsInList.forEach((button) => {
      const listElement = button.parentNode;
      const contextMenu = listElement.querySelector(this.options.domSelectors.contextMenu);

      new ContextMenu(
        contextMenu,
        {},
        {
          attachTo: listElement,
          trigger: button,
        }
      );
    });
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default PublicationTeaser;
