interface ModuleDomSelectors {
  configuredStatusEndpoint: string,
  trigger: string,
  userNameField: string,
  userShortField: string,
  logout: string,
  contextMenu: string,
}
interface ModuleStateClasses {
  open: string,
  initialised: string,
}
export interface UserMenuModuleOptions {
  statusStorage: {
    maxAgeMs: number;
    keys: {
      isLogedIn: string;
      name: string;
      logoutUrl: string;
      timestamp: string;
    }
  },
  domSelectors: ModuleDomSelectors
  stateClasses: ModuleStateClasses
}

const domSelectors: ModuleDomSelectors = {
  configuredStatusEndpoint: '[data-user-menu=loginStatusEndpoint]',
  trigger: '.mdl-user-menu__trigger',
  userNameField: '[data-user-menu=userNameField]',
  userShortField: '[data-user-menu=userShortField]',
  logout: '[data-user-menu=logout]',
  contextMenu: '.mdl-context_menu',
};
const stateClasses: ModuleStateClasses = {
  open: 'open',
  initialised: 'mdl-user-menu--initialised',
};
const statusStorage = {
  maxAgeMs: 60_000,
  keys: {
    isLogedIn: 'kzh-loggedin',
    name: 'kzh-username',
    logoutUrl: 'kzh-logout-url',
    timestamp: 'kzh-status-timestamp',
  },
};
export const UserMenuDefaultOptions: UserMenuModuleOptions = { // eslint-disable-line
  statusStorage,
  domSelectors,
  stateClasses,
};
