interface ModuleDomSelectors {
  configuredAuthorizeEndpoint: string;
  configuredRedirectUrl: string;
  loginBtn: string;
  logoutBtn: string;
  usernameInput: string;
  passwordInput: string;
  showPasswordBtn: string;
  loginForm: string;
  notification: string;
}
interface ModuleStateClasses {
  unauthorised: string;
  credentialsFailed: string;
  connectionFail: string;
  loginBtnDisable: string;
  loading: string;
  loginBtnLoading: string;
}
export interface CugLoginModuleOptions {
  devModeAttr: string;
  mockAssets: {
    emptyResponse: string;
    unauthenticatedLogin: string;
    unauthorizedLogin: string;
    loginOk: string;
  },
  domSelectors: ModuleDomSelectors;
  stateClasses: ModuleStateClasses;
}

const domSelectors: ModuleDomSelectors = {
  configuredAuthorizeEndpoint: '[data-cug_login=authorizeEndpoint]',
  configuredRedirectUrl: '[data-cug_login=successRedirectUrl]',
  loginBtn: '[data-cug_login=doLogin]',
  logoutBtn: '[data-cug_login=doLogout]',
  usernameInput: '[data-cug_login=cellUsername] input',
  passwordInput: '[data-cug_login=cellPassword] input',
  showPasswordBtn: '[data-cug_login=cellPassword] .atm-form_input__functionality',
  loginForm: '[data-cug_login="loginForm"]',
  notification: '[data-cug_login="loginForm"] .mdl-notification',
};
const stateClasses: ModuleStateClasses = {
  unauthorised: 'mdl-cug_login--unauthorized',
  credentialsFailed: 'mdl-cug_login--credentials-failed',
  connectionFail: 'mdl-cug_login--connection-fail',
  loginBtnDisable: 'atm-button--disabled',
  loading: 'mdl-cug_login--loading',
  loginBtnLoading: 'atm-button--loading',
};
export const CugLoginDefaultOptions: CugLoginModuleOptions = { // eslint-disable-line
  devModeAttr: 'data-cug_login-devmode',
  mockAssets: {
    emptyResponse: '/mocks/modules/cug_login/login_empty.json',
    unauthenticatedLogin: '/mocks/modules/cug_login/login_unauthenticated.json',
    unauthorizedLogin: '/mocks/modules/cug_login/login_unauthorized.json',
    loginOk: '/mocks/modules/cug_login/login_ok.json',
  },
  domSelectors,
  stateClasses,
};
