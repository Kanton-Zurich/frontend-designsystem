/*!
 * UserMenu
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import ContextMenu from '../context_menu/context_menu';
import namespace from '../../assets/js/helpers/namespace';

class UserMenu extends Module {
  public options: {
    domSelectors: {
      trigger: string,
      contextMenu: string,
    },
    stateClasses: Object,
  };

  public ui: {
    element: any,
    trigger: HTMLButtonElement,
    contextMenu: HTMLDivElement,
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        trigger: '.mdl-user-menu__trigger',
        contextMenu: '.mdl-context_menu',
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

  static get events() {
    return {
      // eventname: `eventname.${ UserMenu.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    // Event listeners
  }

  /**
   * Initializing the context menus
   *
   * @memberof DownloadList
   */
  initContextMenus() {
    new ContextMenu(this.ui.contextMenu, {}, {
      attachTo: this.ui.element,
      trigger: this.ui.trigger,
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

export default UserMenu;
