interface ModuleDomSelectors {
  configuredLoginEndpoint: string,
  configuredRedirectUrl: string,
  logoutBtn: string,
}
interface ModuleStateClasses {
  unauthorised: string,
}
export interface CugLoginModuleOptions {
  domSelectors: ModuleDomSelectors
  stateClasses: ModuleStateClasses
}

const domSelectors: ModuleDomSelectors = {
  configuredLoginEndpoint: '[data-cug_login=doLoginEndpoint]',
  configuredRedirectUrl: '[data-cug_login=successRedirectUrl]',
  logoutBtn: '[data-cug_login=doLogout]',
};
const stateClasses: ModuleStateClasses = {
  unauthorised: 'mdl-cug_login--unauhtorised',
};
export const CugLoginDefaultOptions: CugLoginModuleOptions = { // eslint-disable-line
  domSelectors,
  stateClasses,
};
