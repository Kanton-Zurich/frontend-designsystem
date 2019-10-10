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
      hook: string,
    },
    stateClasses: {
      open: string,
    },
  };

  public ui: {
    element: any,
    trigger: HTMLButtonElement,
    contextMenu: HTMLDivElement,
    hook: HTMLSpanElement,
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        trigger: '.mdl-user-menu__trigger',
        contextMenu: '.mdl-context_menu',
        hook: '.menuhook',
      },
      stateClasses: {
        open: 'open',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
    // this.initContextMenus();
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
    this.eventDelegate
      .on('click', this.options.domSelectors.trigger, this.toggleUserMenu.bind(this));
  }

  toggleUserMenu() {
    if (this.ui.element.classList.contains(this.options.stateClasses.open)) {
      this.ui.element.classList.remove(this.options.stateClasses.open);
    } else {
      this.ui.element.classList.add(this.options.stateClasses.open);
    }
  }

  /**
   * Initializing the context menus
   *
   * @memberof DownloadList
   */
  initContextMenus() {
    new ContextMenu(this.ui.contextMenu, {}, {
      attachTo: this.ui.hook,
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
