import { ViewController } from '../../util/view-controller.class';
import { ApiConnectionFailure, ApiFailureType } from '../../service/migek-api.service';

// TODO: Marked as unused by eslint although required (?)
/* eslint-disable no-unused-vars */
import Appointment from '../../model/appointment.model';

enum LoginAlert {
  Incomplete,
  Unauthorized,
  ShowTelephone
}
/* eslint-enable */

const TOKEN_BLOCKS: number = 4;
const TOKEN_BLOCK_LENGTH: number = 4;
const TOKEN_BLOCK_SEPERATOR: string = '-';

export const loginViewSelectors: LoginViewSelectors = {
  inputFieldsWrapper: '[data-biometrie_appointment=inputfieldswrapper]',
  inputFields: '[data-biometrie_appointment=input]',
  submitBtn: '[data-biometrie_appointment=submit]',
  loginAlertErr1: '[data-biometrie_appointment=loginAlertErr1]',
  loginAlertErr2: '[data-biometrie_appointment=loginAlertErr2]',
  loginAlertErr3: '[data-biometrie_appointment=loginAlertErr3]',
  loginHint: '[data-biometrie_appointment=loginHint]',
};
export interface LoginViewSelectors {
  inputFieldsWrapper: string;
  inputFields: string;
  submitBtn: string;
  loginAlertErr1: string;
  loginAlertErr2: string;
  loginAlertErr3: string,
  loginHint: string,
}
interface LoginViewData {
  appointment: Appointment;
  loading: boolean;
  attemptsBeforeTelephone: number;
}

class BiometrieLoginView extends ViewController<LoginViewSelectors, LoginViewData> {
  private loginToken: string;
  private loginReqAttempts: number;

  constructor(_data: any, _selectors: LoginViewSelectors) {
    super(_selectors, _data as LoginViewData);
    this.selectors = _selectors;

    this.loginReqAttempts = 0;
  }

  initEventListeners(eventDelegate): void {
    const inputWrapper = document
      .querySelector<HTMLInputElement>(this.selectors.inputFieldsWrapper);

    const inputEls = document
      .querySelectorAll<HTMLInputElement>(this.selectors.inputFields);


    const fillLoginInputFields = () => {
      const tokenBlocks = this.loginToken.split(TOKEN_BLOCK_SEPERATOR);
      inputEls.forEach((el, i) => {
        if (tokenBlocks.length > i) {
          el.innerText = tokenBlocks[i];
        } else {
          el.value = '';
        }
      });
    };

    eventDelegate
      .on('focus', this.selectors.inputFields, () => {
        inputWrapper.classList.add('focused');
      })
      .on('blur', this.selectors.inputFields, () => {
        inputWrapper.classList.remove('focused');
      })
      .on('keydown', this.selectors.inputFields, (event, targetInput) => {
        let caretPos = window.getSelection().getRangeAt(0).startOffset;
        this.log('Event KeyDown: ', event, targetInput, caretPos);

        let targetInputIdx = -1;
        inputEls.forEach((el, i) => {
          if (el === targetInput) {
            targetInputIdx = i;
          }
        });

        if (caretPos === TOKEN_BLOCK_LENGTH && targetInputIdx < inputEls.length) {
          if (this.validateTokenCharacter(event.key)) {
            const focusEl = inputEls[targetInputIdx + 1];
            focusEl.focus();
            if (focusEl.childNodes[0]) {
              window.getSelection().getRangeAt(0).setStart(focusEl.childNodes[0], 0);
            }
          }
        } else if (caretPos === 0 && (event.key === 'Left' || event.key === 'ArrowLeft' || event.key === 'Backspace')) {
          if (targetInputIdx > 0) {
            const focusEl = inputEls[targetInputIdx - 1];
            caretPos = Math.min(focusEl.innerText.length, TOKEN_BLOCK_LENGTH);
          }
        }
      })
      .on('paste', this.selectors.inputFields, (event, targetInput) => {
        const pasteEv = event as ClipboardEvent;
        let totalStr = '';
        inputEls.forEach((el) => {
          if (el === targetInput) {
            const caretPos = event.target.selectionStart;
            const targetVal = targetInput.value;
            if (targetVal) {
              const beforePaste = targetVal.substring(0, caretPos);
              totalStr += beforePaste;
              totalStr += pasteEv.clipboardData.getData('text');
              totalStr += targetVal.substring(caretPos);
            } else {
              totalStr += pasteEv.clipboardData.getData('text');
            }
          } else {
            totalStr += el.value;
          }
        });
        this.log('Total Input: ', totalStr);

        this.loginToken = this.cleanTokenValue(totalStr);
        fillLoginInputFields();

        pasteEv.preventDefault();
      })
      .on('keyup', this.selectors.inputFields, (event, target) => {
        const targetInput = (target as HTMLSpanElement);
        const targetValue = targetInput.innerText || '';
        let caretPos = window.getSelection().getRangeAt(0).startOffset;
        this.log('Event KeyUp: ', event, targetInput, caretPos);


        let totalStr = '';
        let targetInputIdx = -1;
        inputEls.forEach((el, i) => {
          totalStr += el.innerText;
          if (el === targetInput) {
            targetInputIdx = i;
          }
        });

        if (targetValue.length >= TOKEN_BLOCK_LENGTH) {
          targetInput.classList.add('filled');
        } else {
          targetInput.classList.remove('filled');
        }

        this.log('Total Input: ', totalStr);

        this.loginToken = this.cleanTokenValue(totalStr);
        fillLoginInputFields();


        let focusEl = targetInput;
        if (caretPos > TOKEN_BLOCK_LENGTH) {
          if (targetInputIdx < TOKEN_BLOCKS) {
            caretPos %= TOKEN_BLOCK_LENGTH;
          }
        } else if (caretPos === 0 && (event.key === 'Left' || event.key === 'ArrowLeft' || event.key === 'Backspace')) {
          if (targetInputIdx > 0) {
            focusEl = inputEls[targetInputIdx - 1];
            caretPos = Math.min(focusEl.innerText.length, TOKEN_BLOCK_LENGTH);
          }
        }
        focusEl.focus();
        if (focusEl.childNodes[0]) {
          window.getSelection().getRangeAt(0).setStart(focusEl.childNodes[0], caretPos);
        }
        this.log('Range: ', window.getSelection().getRangeAt(0).cloneRange());

        if (totalStr.length >= TOKEN_BLOCKS * TOKEN_BLOCK_LENGTH) {
          this.showLoginAlert();
          this.log('Token string complete: ', this.loginToken);
        }
      })

      .on('click', this.selectors.submitBtn, () => {
        if (!this.loginToken || this.loginToken.length < TOKEN_BLOCKS * TOKEN_BLOCK_LENGTH) {
          this.log('Incomplete login token', this.loginToken);
          this.showLoginAlert(LoginAlert.Incomplete);
        } else {
          this.data.loading = true;
          this.apiService.login(this.loginToken)
            .then((appointment) => {
              if (appointment) {
                this.data.appointment = appointment;
              }
            })
            .catch((rejectionCause) => {
              this.log('Login rejected');

              if (rejectionCause && rejectionCause instanceof ApiConnectionFailure) {
                if ((rejectionCause as ApiConnectionFailure).type === ApiFailureType.FORBIDDEN) {
                  this.handleUnauthedLogin();
                  return;
                }
              }
              this.handleError(rejectionCause);
            })
            .finally(() => {
              this.data.loading = false;
            });
        }
      });

    setTimeout(() => {
      this.data.loading = false;
    }, 0);
  }

  private validateTokenCharacter(charStr: string) {
    if (/^[a-zA-Z0-9]{1}$/.test(charStr)) {
      return charStr.toUpperCase();
    }
    return '';
  }

  private cleanTokenValue(inValue: string): string {
    let cleanedVal = '';
    for (let i = 0; i < inValue.length; i += 1) {
      cleanedVal += this.validateTokenCharacter(inValue[i]);
    }
    const regexPattern = `.{1,${TOKEN_BLOCK_LENGTH}}`;
    const tokenBlocks = cleanedVal.match(new RegExp(regexPattern, 'g'));
    return tokenBlocks ? tokenBlocks.join(TOKEN_BLOCK_SEPERATOR) : '';
  }

  private handleUnauthedLogin(): void {
    this.log('Unauthorised!');
    this.loginReqAttempts += 1;
    if (this.data.attemptsBeforeTelephone > 0
      && this.loginReqAttempts >= this.data.attemptsBeforeTelephone) {
      this.showLoginAlert(LoginAlert.ShowTelephone);
    } else {
      this.showLoginAlert(LoginAlert.Unauthorized);
    }
  }

  /**
   * Method to display alert messages concerning the Login
   *
   * @param {LoginAlert} loginAlert
   *        alert type, optional leave empty to reset input field and hint.
   */
  private showLoginAlert(loginAlert?: LoginAlert) {
    const wrapperEl = document.querySelector(this.selectors.inputFieldsWrapper);

    const alertConDirectChildren = document.querySelectorAll<HTMLElement>(`${this.selectors.loginHint} > *`);
    alertConDirectChildren.forEach((child) => {
      child.style.display = 'none';
    });

    switch (loginAlert) {
      case LoginAlert.Incomplete:
        wrapperEl.classList.add('error');
        document.querySelector<HTMLElement>(this.selectors.loginAlertErr1).style.display = 'block';
        return;
      case LoginAlert.Unauthorized:
        wrapperEl.classList.add('error');
        document.querySelector<HTMLElement>(this.selectors.loginAlertErr2).style.display = 'block';
        return;
      case LoginAlert.ShowTelephone:
        wrapperEl.classList.add('error');
        document.querySelector<HTMLElement>(this.selectors.loginAlertErr3).style.display = 'block';
        return;
      default:
        // Reset
        wrapperEl.classList.remove('error');
    }
  }

  // TODO
  private handleError(e: Error) {
    this.log('Error occured!');
    this.log(e.message);
  }
}

export default BiometrieLoginView;
