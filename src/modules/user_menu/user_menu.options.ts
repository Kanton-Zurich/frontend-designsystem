interface ModuleDomSelectors {
  configuredStatusEndpoint: string,
  trigger: string,
  contextMenu: string,
  hook: string,
}
interface ModuleStateClasses {
  open: string,
  initialised: string,
}
export interface UserMenuModuleOptions {
  domSelectors: ModuleDomSelectors
  stateClasses: ModuleStateClasses
}

const domSelectors: ModuleDomSelectors = {
  configuredStatusEndpoint: '[data-user-menu=loginStatusEndpoint]',
  trigger: '.mdl-user-menu__trigger',
  contextMenu: '.mdl-context_menu',
  hook: '.menuhook',
};
const stateClasses: ModuleStateClasses = {
  open: 'open',
  initialised: 'mdl-user-menu--initialised',
};

export const UserMenuDefaultOptions: UserMenuModuleOptions = { // eslint-disable-line
  domSelectors,
  stateClasses,
};
