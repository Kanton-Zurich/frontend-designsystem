import { ViewController } from '../../util/view-controller.class';
import { ApiConnectionFailure, ApiFailureType } from '../../service/migek-api.service';

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
const VALID_TOKEN_LENGTH = TOKEN_BLOCKS * TOKEN_BLOCK_LENGTH + (TOKEN_BLOCKS - 1);

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
  loggedIn: boolean;
  apiAvailable: boolean;
  attemptsBeforeTelephone: number;
}

class BiometrieLoginView extends ViewController<LoginViewSelectors, LoginViewData> {
  private loginToken: string;
  private loginReqAttempts: number;

  private currentFocusEl: HTMLElement;

  constructor(_data: any, _selectors: LoginViewSelectors) {
    super(_selectors, _data as LoginViewData);
    this.selectors = _selectors;

    this.loginReqAttempts = 0;
  }

  initEventListeners(eventDelegate): void {
    this.initInputEvents(eventDelegate);

    eventDelegate.on('click', this.selectors.submitBtn, () => {
      this.doAttemptLogin();
      if (this.currentFocusEl) {
        this.currentFocusEl.blur();
      }
    });
  }

  private doAttemptLogin(): void {
    if (!this.loginToken || this.loginToken.length < VALID_TOKEN_LENGTH) {
      this.log('Incomplete login token', this.loginToken);
      this.showLoginAlert(LoginAlert.Incomplete);
    } else {
      this.data.loading = true;
      this.apiService.login(this.loginToken)
        .then((appointment) => {
          if (appointment) {
            this.data.appointment = appointment;
            this.data.loggedIn = true;
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
  }

  private initInputEvents(eventDelegate): void {
    const inputWrapper = document
      .querySelector<HTMLDivElement>(this.selectors.inputFieldsWrapper);

    const inputEls = inputWrapper
      .querySelectorAll<HTMLSpanElement>(this.selectors.inputFields);

    let inPaste = false;
    let caretPos = 0;
    let keyDownCaretPos = 0;
    eventDelegate
      .on('focus', this.selectors.inputFields, () => {
        inputWrapper.classList.add('focused');
      })
      .on('blur', this.selectors.inputFields, () => {
        inputWrapper.classList.remove('focused');
      })
      .on('keydown', this.selectors.inputFields, (event: KeyboardEvent, targetInput) => {
        caretPos = window.getSelection().getRangeAt(0).startOffset;
        this.log('Event KeyDown: ', event, targetInput, caretPos);
        inPaste = false;

        if (event.key === 'Enter') {
          this.doAttemptLogin();
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        keyDownCaretPos = caretPos;

        let targetInputIdx = -1;
        inputEls.forEach((el, i) => {
          if (el === targetInput) {
            targetInputIdx = i;
          }
        });
        if (caretPos === TOKEN_BLOCK_LENGTH && targetInputIdx < inputEls.length - 1) {
          let charStr = event.key;
          if (!charStr || charStr === 'Unidentified') {
            try {
              const eventTargetText = targetInput.innerText;
              charStr = eventTargetText.substr(caretPos - 1, 1);
            } catch (e) {
              this.log('Login: Unable to get character from KeyEvent. ', e);
            }
          }
          if (this.validateTokenCharacter(charStr)) {
            setTimeout(() => {
              const focusEl = inputEls.item(targetInputIdx + 1);
              this.log('LOGIN: keydown jump to next ', focusEl);
              this.setFocusAndCaret(focusEl, 1);
            }, 0);
          }
        }
      })
      .on('paste', this.selectors.inputFields, (event, targetInput) => {
        this.log('Event Paste: ', event, targetInput);
        inPaste = true;
        const pasteEv = event as ClipboardEvent;
        let totalStr = '';
        let beforeCaretLength = 0;
        let afterCaretLength = 0;
        let overallCaretPos = 0;
        let targetInputProcessed = false;
        inputEls.forEach((el) => {
          if (el === targetInput) {
            let targetValueBeforePaste = targetInput.innerText.replace(this.getPasteStr(event), '');
            if (targetValueBeforePaste) {
              this.log('Login TargetValue before Paste:', targetValueBeforePaste);
              targetValueBeforePaste = targetValueBeforePaste.replace(/_/g, '');
              const beforePaste = targetValueBeforePaste.substring(0, caretPos);
              const afterPaste = targetValueBeforePaste.substring(caretPos);
              this.log('Login: Paste before and after strings ', beforePaste, afterPaste);
              if (beforePaste.length === 0) {
                caretPos = 0;
              }
              totalStr += beforePaste;
              totalStr += this.getPasteStr(pasteEv);
              totalStr += afterPaste;
              beforeCaretLength += beforePaste.length;
              afterCaretLength += afterPaste.length;
            } else {
              totalStr += this.getPasteStr(pasteEv);
            }
            overallCaretPos += caretPos;
            targetInputProcessed = true;
          } else {
            const targetVal = el.innerText.replace(/_/g, '');
            totalStr += targetVal;

            if (targetInputProcessed) {
              afterCaretLength += targetVal.length;
            } else {
              beforeCaretLength += TOKEN_BLOCK_LENGTH;
              overallCaretPos += TOKEN_BLOCK_LENGTH;
            }
          }
        });
        this.log('Total Input: ', totalStr);
        setTimeout(() => {
          this.fillLoginTokenCleaned(totalStr);
          this.log('Login Paste: Initial Caret position ', caretPos, overallCaretPos);
          this.log('Login Paste: Segment lengths ', this.loginToken.length, beforeCaretLength, afterCaretLength);
          const cleanPasteLength = this.loginToken.length - (beforeCaretLength + afterCaretLength);
          this.log('Login Paste: CleanPaste length ', cleanPasteLength);
          overallCaretPos += cleanPasteLength;

          let focusElIdx = Math.floor(overallCaretPos / (TOKEN_BLOCK_LENGTH + 1));
          if (focusElIdx > TOKEN_BLOCKS - 1) {
            focusElIdx = TOKEN_BLOCKS - 1;
            caretPos = TOKEN_BLOCK_LENGTH;
          } else {
            caretPos = overallCaretPos % (TOKEN_BLOCK_LENGTH + 1);
          }

          this.setFocusAndCaret(inputEls.item(focusElIdx), caretPos);
        }, 0);
      })
      .on('keyup', this.selectors.inputFields, (event, target) => {
        if (inPaste) {
          return;
        }

        this.log('Event KeyUp: ', event, target);
        const targetInput = (target as HTMLSpanElement);
        caretPos = window.getSelection().getRangeAt(0).startOffset;

        let totalStr = '';
        let targetInputIdx = -1;
        inputEls.forEach((el, i) => {
          totalStr += el.innerText;
          if (el === targetInput) {
            targetInputIdx = i;
          }
        });
        this.log('Login: Total token input: ', totalStr);
        this.fillLoginTokenCleaned(totalStr);
        this.log('Login KeyUp: Initial Caret position ', caretPos);

        const maxFocusElIdx = Math.floor(this.loginToken.length / TOKEN_BLOCKS);
        let focusEl = targetInput;
        if (targetInputIdx >= maxFocusElIdx) {
          this.log('Login KeyUp: Input focus ahead  ', targetInputIdx, maxFocusElIdx);
          focusEl = inputEls[maxFocusElIdx];
          const maxCaretPos = this.loginToken.length % (TOKEN_BLOCK_LENGTH + 1);
          caretPos = Math.min(maxCaretPos, caretPos);
        }
        if (caretPos > TOKEN_BLOCK_LENGTH) {
          if (targetInputIdx < TOKEN_BLOCKS - 1) {
            caretPos %= TOKEN_BLOCK_LENGTH;
          } else {
            caretPos = TOKEN_BLOCK_LENGTH;
          }
        } else if (keyDownCaretPos === 0 && (event.key === 'Left' || event.key === 'ArrowLeft')) {
          if (targetInputIdx > 0) {
            focusEl = inputEls[targetInputIdx - 1];
            caretPos = Math.min(focusEl.innerText.length, TOKEN_BLOCK_LENGTH);
          }
        } else if (caretPos === 0 && event.key === 'Backspace') {
          if (targetInputIdx > 0) {
            focusEl = inputEls[targetInputIdx - 1];
            caretPos = Math.min(focusEl.innerText.length, TOKEN_BLOCK_LENGTH);
          }
        } else if ((caretPos === TOKEN_BLOCK_LENGTH) && (event.key === 'Right' || event.key === 'ArrowRight')) {
          if (targetInputIdx < TOKEN_BLOCKS - 1) {
            focusEl = inputEls[targetInputIdx + 1];
            caretPos = 0;
          }
        }

        this.setFocusAndCaret(focusEl, caretPos);
      });
  }

  /**
   * Browser agnostic get clipboard content str.
   *
   * @param pasteEv
   */
  private getPasteStr(pasteEv): string {
    // eslint-disable-next-line dot-notation
    const ieClipboardData = window['clipboardData'];
    if (ieClipboardData && ieClipboardData.getData) { // IE
      return ieClipboardData.getData('Text');
    }
    if (pasteEv.clipboardData && pasteEv.clipboardData.getData) {
      return pasteEv.clipboardData.getData('text/plain');
    }
    return '';
  }

  /**
   * Validates a single character for a Token string.
   * @param { string } charStr to process
   */
  private validateTokenCharacter(charStr: string) {
    if (/^[a-zA-Z0-9]{1}$/.test(charStr)) {
      return charStr.toUpperCase();
    }
    return '';
  }

  /**
   * Strips invalid characters form a given string, injects the TokenBlockSeperators
   * and cuts the string to max length of a valid token.
   *
   * @param { string } inValue string to process
   */
  private cleanTokenValue(inValue: string): string {
    let cleanedVal = '';
    for (let i = 0; i < inValue.length; i += 1) {
      cleanedVal += this.validateTokenCharacter(inValue[i]);
    }
    const regexPattern = `.{1,${TOKEN_BLOCK_LENGTH}}`;
    const tokenBlocks = cleanedVal.match(new RegExp(regexPattern, 'g'));
    cleanedVal = tokenBlocks ? tokenBlocks.join(TOKEN_BLOCK_SEPERATOR) : '';
    return cleanedVal.length > VALID_TOKEN_LENGTH
      ? cleanedVal.substr(0, VALID_TOKEN_LENGTH) : cleanedVal;
  }

  /**
   * Cleans the given string from invalid characters, splits it in token blocks and places the token
   * content in the relevant input fields.
   * LoginToken is set in controller and LoginAlerts are cleaned when the TokelnLength is reached.
   *
   * @param { string } totalStr string to process
   */
  private fillLoginTokenCleaned(totalStr) {
    const cleanedStr = this.cleanTokenValue(totalStr);
    const tokenBlocks = cleanedStr.split(TOKEN_BLOCK_SEPERATOR);
    document.querySelectorAll<HTMLInputElement>(this.selectors.inputFields)
      .forEach((el, i) => {
        let setText = '';
        for (let j = 0; j < TOKEN_BLOCK_LENGTH; j += 1) {
          if (tokenBlocks.length > i && tokenBlocks[i].length > j) {
            setText += tokenBlocks[i][j];
          } else {
            setText += '_';
          }
        }
        el.innerText = setText;
      });

    if (cleanedStr.length >= VALID_TOKEN_LENGTH) {
      this.showLoginAlert();
      this.log('Token string complete: ', this.loginToken);
    }
    this.loginToken = cleanedStr;
  }

  /**
   * Sets focus to the given input element and places the caret at the given position in the element
   * @param { HTMLElement } focusEl the HTML to set focus to.
   * @param { number } caretPos the position to put caret in the focused object.
   */
  private setFocusAndCaret(focusEl: HTMLElement, caretPos: number): void {
    this.log('Login: Set focus and caret: ', focusEl, caretPos);
    if (focusEl) {
      focusEl.focus();
      if (document.createRange) {
        const range = document.createRange();
        range.selectNodeContents(focusEl);


        range.setStart(focusEl.firstChild, caretPos);
        range.setEnd(focusEl.firstChild, caretPos);

        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
      // store to blur on login.
      this.currentFocusEl = focusEl;
    }
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
      child.classList.remove('show');
    });

    switch (loginAlert) {
      case LoginAlert.Incomplete:
        wrapperEl.classList.add('error');
        document.querySelector<HTMLElement>(this.selectors.loginAlertErr1).classList.add('show');
        return;
      case LoginAlert.Unauthorized:
        wrapperEl.classList.add('error');
        document.querySelector<HTMLElement>(this.selectors.loginAlertErr2).classList.add('show');
        return;
      case LoginAlert.ShowTelephone:
        wrapperEl.classList.add('error');
        document.querySelector<HTMLElement>(this.selectors.loginAlertErr3).classList.add('show');
        return;
      default:
        // Reset
        wrapperEl.classList.remove('error');
    }
  }

  /**
   * Method to handle API exceptions that the current view can not recover from.
   * @param exception
   */
  private handleError(exception): void {
    this.log('Unexpected exception connecting to API', exception);
    this.data.apiAvailable = false;
  }
}

export default BiometrieLoginView;
