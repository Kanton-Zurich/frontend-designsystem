/*!
 * UserMenu
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import ContextMenu from '../context_menu/context_menu';
import { UserMenuDefaultOptions, UserMenuModuleOptions } from './user_menu.options';

interface LoginStatusResponse {
  isLoggedIn: boolean;
  name?: string;
  logoutUrl?: string;
}

class UserMenu extends Module {
  public options: UserMenuModuleOptions;

  public ui: {
    element: HTMLElement,
    configuredStatusEndpoint: HTMLInputElement,
    trigger: HTMLButtonElement,
    contextMenu: HTMLDivElement,
    hook: HTMLSpanElement,
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };

    super($element, defaultData, UserMenuDefaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
    // this.initContextMenus();

    this.initLoginState();
  }

  static get events() {
    return {
      // eventname: `eventname.${ UserMenu.name }.${  }`
    };
  }

  private initLoginState() {
    const apiEndpoint = this.ui.configuredStatusEndpoint.value;
    this.fetchJsonData(apiEndpoint).then((resp) => {
      const loginStatusResponse = resp as LoginStatusResponse;
      if (loginStatusResponse.isLoggedIn) {
        this.log(`Loggedin User: "${loginStatusResponse.name}"`);
        this.ui.element.classList.add(this.options.stateClasses.initialised);
      }
    });
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
