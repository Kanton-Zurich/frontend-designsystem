/*!
 * BiometrieAppointment
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import MigekApiService, { ApiForbidden } from './service/migek-api.service';
import { LoginAlert } from './model/login-alert-type.enum';
import Reservation, { ReservationDetails } from './model/reservation-details.model';


const TOKEN_BLOCKS: number = 4;
const TOKEN_BLOCK_LENGTH: number = 4;
const TOKEN_BLOCK_SEPERATOR: string = '-';

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
      reservationDetails: string,
    }
    stateClasses: {
    }
  };

  private apiService: MigekApiService;

  private loginToken: string;

  private loginReqAttempts: number;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      apiBase: 'https://internet-acc.zh.ch/proxy/migek/',
    };
    const defaultOptions = {
      domSelectors: {
        inputFieldsWrapper: '[data-biometrie_appointment=inputfieldswrapper]',
        inputFields: '[data-biometrie_appointment=input]',
        submitBtn: '[data-biometrie_appointment=submit]',
        loginAlertErr1: '[data-biometrie_appointment=loginAlertErr1]',
        loginAlertErr2: '[data-biometrie_appointment=loginAlertErr2]',
        loginAlertErr3: '[data-biometrie_appointment=loginAlertErr3]',
        loginHint: '[data-biometrie_appointment=loginHint]',
        reservationDetails: '[data-biometrie_appointment^=reservation-details__]',
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

    this.initApiService();
  }

  static get events() {
    return {
      // eventname: `eventname.${ BiometrieAppointment.name }.${  }`
    };
  }

  private initApiService(): void {
    this.apiService = new MigekApiService(this.data.apiBase, this.log);
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

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    const inputEls = document
      .querySelectorAll<HTMLInputElement>(this.options.domSelectors.inputFields);


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

    // Event listeners
    this.eventDelegate
      .on('keydown', this.options.domSelectors.inputFields, (event, targetInput) => {
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
      .on('paste', this.options.domSelectors.inputFields, (event, targetInput) => {
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
      .on('keyup', this.options.domSelectors.inputFields, (event, target) => {
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

      .on('click', this.options.domSelectors.submitBtn, () => {
        if (!this.loginToken || this.loginToken.length < TOKEN_BLOCKS * TOKEN_BLOCK_LENGTH) {
          this.log('Incomplete login token', this.loginToken);
          this.showLoginAlert(LoginAlert.Incomplete);
        } else {
          this.apiService.login(this.loginToken)
            .then(detailsObj => this.handleReservationDetails(detailsObj))
            .catch((rejectionCause) => {
              if (rejectionCause === ApiForbidden) {
                this.handleUnauthedLogin();
              } else {
                this.handleError(rejectionCause);
              }
            });
        }
      });
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

  private handleReservationDetails(details: ReservationDetails) {
    this.log('Received Reservation: ', details);

    const reservation = new Reservation(details);

    const detailFields = document
      .querySelectorAll<HTMLInputElement>(this.options.domSelectors.reservationDetails);
    detailFields.forEach((el) => {
      const fn = el
        .getAttribute('data-biometrie_appointment').replace('reservation-details__', '');
      if (reservation[fn]) {
        el.innerText = reservation[fn];
      }
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

  // TODO
  private handleError(e: Error) {
    this.log('Error occured!');
    this.log(e.message);
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
