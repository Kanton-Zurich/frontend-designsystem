/*!
 * LoginForm
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import {
  CugLoginDefaultOptions,
  CugLoginModuleOptions, // eslint-disable-line no-unused-vars
} from './cug_login.options';
import UserMenu from '../user_menu/user_menu';

interface LoginResponse {
  isAuthenticated: boolean;
  isAuthorized: boolean;
}

class CugLogin extends Module {
  public options: CugLoginModuleOptions;

  public ui: {
    element: HTMLElement,
    configuredLoginEndpoint: HTMLInputElement,
    configuredRedirectUrl: HTMLInputElement,
    logoutBtn: HTMLElement,
    loginBtn: HTMLElement,
    usernameInput: HTMLInputElement,
    passwordInput: HTMLInputElement,
    showPasswordBtn: HTMLElement,
    loginForm: HTMLFormElement,
  };

  private devMode: boolean;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };

    super($element, defaultData, CugLoginDefaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
    this.initWatchers();

    this.devMode = this.ui.element.hasAttribute(this.options.devModeAttr);
  }

  static get events() {
    return {
      // eventname: `eventname.${ LoginForm.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate
      .on('click', this.options.domSelectors.logoutBtn, () => {
        this.log('Emitting doLogout event.');
        document.dispatchEvent(new CustomEvent(UserMenu.events.doLogout));
      })
      .on('click', this.options.domSelectors.loginBtn, this.doLogin.bind(this))
      .on('click', this.options.domSelectors.showPasswordBtn, this.togglePwVisibility.bind(this));
  }

  initWatchers() {
    this.watch(this.ui.passwordInput, 'value', this.onFormDataChange.bind(this));
    this.watch(this.ui.usernameInput, 'value', this.onFormDataChange.bind(this));
  }

  private onFormDataChange() {
    if (this.ui.element.classList.contains(this.options.stateClasses.credentialsFailed)) {
      this.ui.element.classList.remove(this.options.stateClasses.credentialsFailed);
    }

    setTimeout(() => {
      if (this.loginFormHasErrors()) {
        this.ui.loginBtn.classList.add(this.options.stateClasses.loginBtnDisable);
      } else {
        this.ui.loginBtn.classList.remove(this.options.stateClasses.loginBtnDisable);
      }
    }, 0);
  }

  private togglePwVisibility() {
    this.log('Toggle Password visibility.');
    const { passwordInput } = this.ui;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }

  private loginFormHasErrors(): boolean {
    const invalidUsername = this.ui.usernameInput.parentElement.classList.contains('invalid');
    const invalidPassword = this.ui.passwordInput.parentElement.classList.contains('invalid');
    return invalidUsername || invalidPassword;
  }

  private doLogin(ev: Event) {
    this.log('Login submit triggered.');

    this.ui.loginForm.classList.add(this.options.stateClasses.loading);

    if (!this.loginFormHasErrors()) {
      const username = this.ui.usernameInput.value;
      const password = this.ui.passwordInput.value;
      this.log(`Attempt login with ${username} - ${password}`);

      let endpoint = this.ui.configuredLoginEndpoint.value;
      if (this.devMode) {
        if (username === 'admin') {
          endpoint = this.options.mockAssets.loginOk;
        } else if (username === 'user') {
          endpoint = this.options.mockAssets.unauthorizedLogin;
        } else if (username === 'hansi') {
          endpoint = this.options.mockAssets.emptyResponse;
        } else {
          endpoint = this.options.mockAssets.unauthenticatedLogin;
        }
      }

      this.postJsonData(endpoint, { username, password })
        .then((resp) => {
          if (!resp
            || resp.isAuthenticated === undefined
            || resp.isAuthorized === undefined) {
            throw new Error(`Unparseable repsonse to login request! '${resp}'`);
          }
          return resp as LoginResponse;
        })
        .then((loginResp) => {
          this.log('Response to login request: ', loginResp);
          if (loginResp.isAuthenticated) {
            if (loginResp.isAuthorized) {
              document.dispatchEvent(new CustomEvent(UserMenu.events.updateState));
              window.location.href = this.ui.configuredRedirectUrl.value;
            } else {
              this.ui.element.classList.add(this.options.stateClasses.unauthorised);
            }
          } else {
            this.ui.element.classList.add(this.options.stateClasses.credentialsFailed);
          }

          this.ui.loginForm.classList.remove(this.options.stateClasses.loading);
        }).catch((reason) => {
          this.log('Failed to connect api for user login.', reason);
          this.ui.element.classList.add(this.options.stateClasses.connectionFail);
        });

      this.ui.loginBtn.classList.add(this.options.stateClasses.loginBtnDisable);
    }

    ev.stopPropagation();
    ev.preventDefault();
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default CugLogin;
