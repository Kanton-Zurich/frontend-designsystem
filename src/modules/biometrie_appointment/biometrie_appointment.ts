/*!
 * BiometrieAppointment
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

enum LoginAlert {
  Incomplete,
  Unauthorized,
  ShowTelephone
}

const TOKEN_BLOCKS: number = 4;
const TOKEN_BLOCK_LENGTH: number = 4;

const ATTEMPTS_BEFORE_SHOW_TELEPHONE: number = 3;

class BiometrieAppointment extends Module {
  public data: {
    apiBase: string,
  };

  public options: {
    domSelectors: {
      inputFieldsWrapper: string,
      inputFields: string,
      submitBtn: string,
      loginAlertErr1: string,
      loginAlertErr2: string,
      loginAlertErr3: string,
      loginHint: string,
    }
    stateClasses: {
    }
  };

  private loginToken: string;

  private loginReqAttempts: number;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      apiBase: 'http://localhost:3000/biometrie/',
    };
    const defaultOptions = {
      domSelectors: {
        inputFieldsWrapper: '[data-biometrie_appointment="inputfieldswrapper"]',
        inputFields: '[data-biometrie_appointment="input"]',
        submitBtn: '[data-biometrie_appointment="submit"]',
        loginAlertErr1: '[data-biometrie_appointment="loginAlertErr1"]',
        loginAlertErr2: '[data-biometrie_appointment="loginAlertErr2"]',
        loginAlertErr3: '[data-biometrie_appointment="loginAlertErr3"]',
        loginHint: '[data-biometrie_appointment="loginHint"]',

      },
      stateClasses: {
        // activated: 'is-activated'
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();

    this.log('Biometrie appointment init!', this);

    this.loginReqAttempts = 0;
  }

  static get events() {
    return {
      // eventname: `eventname.${ BiometrieAppointment.name }.${  }`
    };
  }

  private validateTokenCharacter(charStr: string) {
    if (/^[a-zA-Z0-9]{1}$/.test(charStr)) {
      return charStr.toUpperCase();
    }
    return '';
  }

  private cleanTokenValue(inValue: string): string {
    let cleanStr = '';
    for (let i = 0; i < inValue.length; i += 1) {
      cleanStr += this.validateTokenCharacter(inValue[i]);
    }
    return cleanStr;
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    // Event listeners
    this.eventDelegate
      // .on('keydown', this.options.domSelectors.inputFields, (event, targetInput) => {
      //   //TODO needed?
      // })
      .on('keyup', this.options.domSelectors.inputFields, (event, targetInput) => {
        const targetValue = targetInput.value;
        const caretPos = event.target.selectionStart;
        this.log('Event KeyDown: ', event, targetInput, caretPos);

        if (caretPos >= TOKEN_BLOCK_LENGTH) {
          const nextInput = targetInput.nextSibling.nextSibling;
          if (nextInput) {
            nextInput.focus();
          }
        } else if (caretPos === 0 && (event.key === 'Left' || event.key === 'ArrowLeft' || event.key === 'Backspace')) {
          const prevInput = targetInput.previousSibling.previousSibling;
          if (prevInput) {
            prevInput.focus();
          }
        }

        if (targetValue.length >= TOKEN_BLOCK_LENGTH) {
          targetInput.classList.add('filled');
        } else {
          targetInput.classList.remove('filled');
        }

        const inputEls = document
          .querySelectorAll<HTMLInputElement>(this.options.domSelectors.inputFields);
        let totalStr = '';
        inputEls.forEach((el) => {
          totalStr += el.value;
        });
        this.log('Total Input: ', totalStr);

        this.loginToken = this.cleanTokenValue(totalStr);
        inputEls.forEach((el, i) => {
          if (totalStr.length > i * TOKEN_BLOCK_LENGTH) {
            el.value = this.loginToken.substr(i * TOKEN_BLOCK_LENGTH, TOKEN_BLOCK_LENGTH);
          } else {
            el.value = '';
          }
        });

        if (totalStr.length >= TOKEN_BLOCKS * TOKEN_BLOCK_LENGTH) {
          this.showLoginAlert();
          this.log('Token string complete: ', this.loginToken);
        }
      })

      .on('click', this.options.domSelectors.submitBtn, () => {
        if (!this.loginToken || this.loginToken.length < TOKEN_BLOCKS * TOKEN_BLOCK_LENGTH) {
          this.log('Incomplete login token', this.loginToken);
          this.showLoginAlert(LoginAlert.Incomplete);
        } else {
          this.createLoginToken();
        }
      });
  }

  private createLoginToken() {
    const loginUrl = `${this.data.apiBase}login`;

    // TODO: Refactor to Service
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          this.handleLogintokenResponse(response);
        } else if (xhr.status === 403) {
          this.handleUnauthedLogin();
        }
      }
    };
    xhr.open('POST', loginUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(this.getLoginPayload());
  }

  private handleUnauthedLogin(): void {
    this.log('Unauthorised!');
    this.loginReqAttempts += 1;
    if (this.loginReqAttempts < ATTEMPTS_BEFORE_SHOW_TELEPHONE) {
      this.showLoginAlert(LoginAlert.Unauthorized);
    } else {
      this.showLoginAlert(LoginAlert.ShowTelephone);
    }
  }

  private handleLogintokenResponse(tokenRes: { token: string, _links: any[]}) {
    this.log('Received Login: ', tokenRes);
  }

  private getLoginPayload() {
    return JSON.stringify({
      token: this.loginToken,
    });
  }

  /**
   * Method to display alert messages concerning the Login
   *
   * @param {LoginAlert} loginAlert
   *        alert type, optional leave empty to reset input field and hint.
   */
  private showLoginAlert(loginAlert?: LoginAlert) {
    const wrapperEl = document.querySelector(this.options.domSelectors.inputFieldsWrapper);

    const alertConDirectChildren = document.querySelectorAll<HTMLElement>(`${this.options.domSelectors.loginHint} > *`);
    alertConDirectChildren.forEach((child) => {
      child.style.display = 'none';
    });

    switch (loginAlert) {
      case LoginAlert.Incomplete:
        wrapperEl.classList.add('error');
        document.querySelector<HTMLElement>(this.options.domSelectors.loginAlertErr1).style.display = 'block';
        return;
      case LoginAlert.Unauthorized:
        wrapperEl.classList.add('error');
        document.querySelector<HTMLElement>(this.options.domSelectors.loginAlertErr2).style.display = 'block';
        return;
      case LoginAlert.ShowTelephone:
        wrapperEl.classList.add('error');
        document.querySelector<HTMLElement>(this.options.domSelectors.loginAlertErr3).style.display = 'block';
        return;
      default:
        // Reset
        wrapperEl.classList.remove('error');
        alertConDirectChildren[0].style.display = 'block';
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

export default BiometrieAppointment;
