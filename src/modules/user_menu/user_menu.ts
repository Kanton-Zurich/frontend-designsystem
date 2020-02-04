/*!
 * UserMenu
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import {
  UserMenuDefaultOptions,
  UserMenuModuleOptions, // eslint-disable-line no-unused-vars
} from './user_menu.options';

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
    userNameField: HTMLElement,
    userShortField: HTMLElement,
    logout: HTMLButtonElement | HTMLAnchorElement,
    contextMenu: HTMLDivElement,
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };

    super($element, defaultData, UserMenuDefaultOptions, data, options);

    this.initUi();
    this.initEventListeners();

    this.initLoginState();
  }

  static get events() {
    return {
      doLogout: `eventname.${UserMenu.name}.dologout`,
      updateState: `eventname.${UserMenu.name}.updateState`,
      stateFetched: `eventname.${UserMenu.name}.stateFetched`,
    };
  }

  private initLoginState(forceRefetch = false) {
    this.fetchLoginStatus(forceRefetch).then((loginStatusResponse) => {
      if (loginStatusResponse.isLoggedIn) {
        this.log(`Loggedin User: "${loginStatusResponse.name}"`);
        this.ui.element.classList.add(this.options.stateClasses.initialised);
        this.ui.userNameField.innerText = loginStatusResponse.name;
        this.ui.userShortField.innerText = this.getInitials(loginStatusResponse.name);
      } else {
        this.ui.element.classList.remove(this.options.stateClasses.initialised);
      }
      document.dispatchEvent(new CustomEvent(UserMenu
        .events.stateFetched, { detail: loginStatusResponse }));
    });
  }

  private storeLoginStatus(status?: LoginStatusResponse): void {
    if (window.sessionStorage) {
      const store = window.sessionStorage;
      const { keys } = this.options.statusStorage;
      if (status) {
        store.setItem(keys.name, status.name);
        store.setItem(keys.logoutUrl, status.logoutUrl);
      } else {
        store.removeItem(keys.name);
        store.removeItem(keys.logoutUrl);
      }
      store.setItem(keys.isLogedIn, `${status ? status.isLoggedIn : false}`);
      store.setItem(keys.timestamp, new Date().getTime().toString(10));
    }
  }

  private fetchLoginStatus(forceApiRefetch: boolean = false): Promise<LoginStatusResponse> {
    return new Promise<LoginStatusResponse>((resolve, reject) => {
      let storageTs = 0;
      const { keys, maxAgeMs } = this.options.statusStorage;
      const store = window.sessionStorage;
      if (store) {
        this.log('Fetching timestamp of login status from sessionstorage.');
        storageTs = Number.parseInt(store.getItem(keys.timestamp), 10);
      }

      if (new Date().getTime() - storageTs < maxAgeMs && !forceApiRefetch) {
        this.log('Getting stored loginstatus.');
        const loggedIn = store.getItem(keys.isLogedIn) === 'true';
        const status: LoginStatusResponse = {
          isLoggedIn: loggedIn,
        };
        const name = store.getItem(keys.name);
        if (name) {
          status.name = name;
        }
        const logoutUrl = store.getItem(keys.logoutUrl);
        if (logoutUrl) {
          status.logoutUrl = logoutUrl;
        }

        resolve(status);
      } else {
        this.log('No loginstatus younger than configured maxAge in Storage.');
        const apiEndpoint = this.ui.configuredStatusEndpoint.value;
        this.log(`Fetching status from "${apiEndpoint}".`);
        this.fetchJsonData(apiEndpoint).then((resp) => {
          this.storeLoginStatus(resp);
          resolve(resp);
        }).catch((reason) => {
          reject(reason);
        });
      }
    });
  }

  private getInitials(username: string): string {
    const split = username.split(' ');

    return split[0][0] + split[split.length - 1][0];
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate
      .on('click', this.options.domSelectors.trigger, this.toggleUserMenu.bind(this))
      .on('click', this.options.domSelectors.logout, this.doLogoutUser.bind(this));

    document.addEventListener(UserMenu.events.doLogout, this.doLogoutUser.bind(this));
    document.addEventListener(UserMenu.events.updateState, this.updateState.bind(this));
  }

  private updateState(): void {
    this.initLoginState(true);
  }

  toggleUserMenu() {
    if (this.ui.element.classList.contains(this.options.stateClasses.open)) {
      this.ui.element.classList.remove(this.options.stateClasses.open);
    } else {
      this.ui.element.classList.add(this.options.stateClasses.open);
    }
  }

  private doLogoutUser() {
    this.log('Logout triggered!');
    const store = window.sessionStorage;
    const { keys } = this.options.statusStorage;
    const logoutUrl = store.getItem(keys.logoutUrl);
    if (logoutUrl) {
      this.log('Call logout endpoint');
      this.fetchJsonData(logoutUrl, false).then(() => {
        this.log('Remove stored loginStatus.');
        this.storeLoginStatus();
        this.log('Reload page.');
        const meta = document.createElement('meta');
        meta.name = 'referrer';
        meta.content = 'no-referrer';
        document.getElementsByTagName('head')[0].appendChild(meta);
        window.location.reload(true);
      });
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

export default UserMenu;
