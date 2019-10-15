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

class CugLogin extends Module {
  public options: CugLoginModuleOptions;

  public ui: {
    element: HTMLElement,
    configuredLoginEndpoint: HTMLInputElement,
    configuredRedirectUrl: HTMLInputElement,
    logoutBtn: HTMLElement,
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };

    super($element, defaultData, CugLoginDefaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
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

export default CugLogin;
