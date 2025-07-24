/*!
 * DataDownload
 *
 * @author Tobias Wust
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import ContextMenu from '../context_menu/context_menu';

class DataDownload extends Module {
  public options: {
    domSelectors: {
      openContext: string;
      contextMenu: string;
    };
    stateClasses: Object;
  };

  public ui: {
    element: HTMLDivElement;
    openContext: HTMLButtonElement;
    contextMenu: HTMLDivElement;
  };

  private contextMenu: ContextMenu;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        openContext: '.mdl-data-download__trigger',
        contextMenu: '.mdl-context_menu',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    if (document.querySelector(this.options.domSelectors.contextMenu) === null) {
      return; // if there is no context menu, we don't need to do anything
    }

    this.initUi();
    this.initEventListeners();
    this.initContextMenu();
  }

  /**
   * Open a context menu
   *
   * @param {*} event
   * @memberof DownloadList
   */
  toggleContext() {
    const { openContext } = this.ui;
    const openContextComputedWidth = window.getComputedStyle(openContext).getPropertyValue('width');

    this.contextMenu.ui.element.style.minWidth = openContextComputedWidth;
    this.contextMenu.toggle();
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate.on(
      'click',
      this.options.domSelectors.openContext,
      this.toggleContext.bind(this)
    );
  }

  /**
   * Initializing the context menu
   *
   * @memberof DownloadList
   */
  initContextMenu() {
    const { openContext, contextMenu } = this.ui;
    if (!openContext || !contextMenu) {
      return;
    }

    contextMenu.style.minWidth = 'unset';
    contextMenu.style.marginTop = '8px';

    this.contextMenu = new ContextMenu(
      contextMenu,
      {},
      {
        attachTo: openContext,
        trigger: openContext,
        customTrigger: true,
      }
    );
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();
  }
}

export default DataDownload;
