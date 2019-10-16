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
    loginForm: HTMLFormElement,
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };

    super($element, defaultData, CugLoginDefaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
    this.initWatchers();
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
      .on('click', this.options.domSelectors.loginBtn, this.doLogin.bind(this));
  }

  initWatchers() {
    this.watch(this.ui.passwordInput, 'value', this.onFormDataChange.bind(this));
    this.watch(this.ui.usernameInput, 'value', this.onFormDataChange.bind(this));
  }

  private onFormDataChange() {
    if (this.ui.element.classList.contains(this.options.stateClasses.credentialsFailed)) {
      this.ui.element.classList.remove(this.options.stateClasses.credentialsFailed);
    }

    if (this.ui.loginBtn.classList.contains(this.options.stateClasses.loginBtnDisable)) {
      this.ui.loginBtn.classList.remove(this.options.stateClasses.loginBtnDisable);
    }
  }

  private doLogin(ev: Event) {
    this.log('Login submit triggered.');

    const formHasErrors = this.ui.loginForm.hasAttribute('form-has-errors');
    if (!formHasErrors) {
      const username = this.ui.usernameInput.value;
      const password = this.ui.passwordInput.value;
      this.log(`Attempt login with ${username} - ${password}`);

      const endpoint = this.ui.configuredLoginEndpoint.value;
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
