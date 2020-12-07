
/*!
 * Stepper
 *
 * @author
 * @copyright
 */
import { template } from 'lodash';

import Module from '../../assets/js/helpers/module';
import StepperNavigation from '../stepper_navigation/stepper_navigation';

class Stepper extends Module {
  public data: {
    active: number,
    hasNavigation: boolean,
  };

  public navigation: any;

  public ui: {
    element: HTMLDivElement,
    steps: any,
    back: HTMLButtonElement,
    next: HTMLButtonElement,
    wrapper: HTMLDivElement,
    form: HTMLFormElement,
    send: HTMLButtonElement,
    control: HTMLDivElement,
    navigation: HTMLOListElement,
    notificationTemplate: HTMLScriptElement,
    messageWrapper: HTMLDivElement,
    rules: NodeListOf<HTMLDivElement>,
    lastpage: HTMLDivElement,
    ruleNotification: HTMLScriptElement,
  };

  public options: {
    transitionTime: number,
    scrollTopMargin: number,
    domSelectors: any,
    stateClasses: any,
    hasRules: Boolean,
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      active: 0,
      hasNavigation: false,
    };
    const defaultOptions = {
      transitionTime: 350,
      scrollTopMargin: 100,
      domSelectors: {
        steps: '[data-stepper="step"]',
        back: '[data-stepper="back"]',
        next: '[data-stepper="next"]',
        wrapper: '[data-stepper="wrapper"]',
        send: '[data-stepper="send"]',
        control: '[data-stepper="control"]',
        navigation: '[data-init="stepperNavigation"]',
        notificationTemplate: '[data-stepper="notificationTemplate"]',
        messageWrapper: '[data-stepper="messageWrapper"]',
        rules: '[data-rules]',
        form: '[data-stepper="form"]',
        lastpage: '[data-stepper="lastpage"]',
        ruleNotification: '[data-stepper="ruleNotification"]',
        ruleNotificationWrapper: '[data-stepper="ruleNotificationWrapper"]',
      },
      stateClasses: {
        hiddenStep: 'mdl-stepper__step--hidden',
        transitionLeft: 'mdl-stepper__step--transition-left',
        transitionRight: 'mdl-stepper__step--transition-right',
        transitionOut: 'mdl-stepper__step--transition-out',
        initialised: 'mdl-stepper--initialised',
        onLastPage: 'mdl-stepper--last-page',
        success: 'mdl-stepper--success',
        buttonLoading: 'atm-button--loading',
      },
      hasRules: false,
    };

    super($element, defaultData, defaultOptions, data, options);

    // Enforce steps to be wrapped in array
    this.initUi(['steps']);

    this.initEventListeners();
    this.initWatchers();

    this.deactiveSteps();

    this.setButtonVisibility();

    this.options.hasRules = this.ui.element.querySelectorAll('.mdl-stepper__step[data-rules]').length > 0;

    if (this.ui.navigation) {
      this.navigation = new StepperNavigation(this.ui.navigation,
        { active: this.data.active, steps: this.ui.steps }, {
          hasRules: this.options.hasRules,
        });
    }

    this.ui.element.classList.add(this.options.stateClasses.initialised);
  }

  static get events() {
    return {
      validateSection: 'validateSection',
      stepChange: 'stepChange',
      showFieldInvalid: 'showFieldInvalid',
      showRuleNotification: 'Stepper.showRuleNotification',
      hideRuleNotification: 'Stepper.hideRuleNotification',
      checkRules: 'Stepper.checkRules',
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate.on('click', this.options.domSelectors.next, () => {
      let newPageIndex = this.data.active + 1;

      while (this.ui.steps[newPageIndex].getAttribute('data-enabled') === 'false') {
        newPageIndex += 1;
      }

      this.changePage(newPageIndex);
    });
    this.eventDelegate.on('click', this.options.domSelectors.back, () => {
      let newPageIndex = this.data.active - 1;

      while (this.ui.steps[newPageIndex].getAttribute('data-enabled') === 'false') {
        newPageIndex -= 1;
      }

      this.changePage(newPageIndex);
    });
    this.eventDelegate.on('click', this.options.domSelectors.send, this.sendForm.bind(this));
    this.eventDelegate.on('submit', this.options.domSelectors.wrapper, () => {
      this.sendForm();
      return false;
    });
    this.eventDelegate.on(Stepper.events.showRuleNotification,
      this.showRuleNotification.bind(this));

    if (this.ui.navigation) {
      this.ui.navigation.addEventListener(StepperNavigation.events.navigationChange,
        (event) => {
          this.data.active = (<any>event).detail.clickedPage;
        });
    }
  }

  /**
    * Initializing property watchers
  */
  initWatchers() {
    this.watch(this.data, 'active', this.onStepChange.bind(this));
  }

  /**
   * When step changes, do the transitions and other functions
   *
   * @param {string} propName is always "active"
   * @param {number} oldValue value before the change
   * @param {number} newValue value after the change
   * @memberof Stepper
   */
  onStepChange(propName, oldValue, newValue) {
    this.ui.steps[newValue].classList.remove(this.options.stateClasses.hiddenStep);
    this.ui.steps[newValue].setAttribute('aria-current', 'step');

    this.setButtonVisibility();
    this.deactiveSteps(newValue);

    if (this.ui.navigation) {
      this.ui.navigation.dispatchEvent(new CustomEvent(Stepper.events.stepChange, {
        detail: {
          newStep: newValue,
        },
      }));
    }

    // Remove any rule Notifications
    if (newValue > oldValue) {
      this.hideRuleNotification(oldValue);
    }

    setTimeout(() => {
      this.setOnPageChangeFocus();
    }, 0);
  }

  /**
   * Deactivate the steps and removes classes which are used for transitions
   *
   * @memberof Stepper
   */
  deactiveSteps(newStepIndex: number = 0) {
    this.ui.steps.forEach((step, index) => {
      if (index !== newStepIndex) {
        step.removeAttribute('aria-current');
        step.classList.add(this.options.stateClasses.hiddenStep);
      }
    });
  }

  /**
   * Sets the visibility of the buttons, according to the stage
   *
   * @memberof Stepper
   */
  setButtonVisibility() {
    // If the last page show no buttons
    if (this.data.active === this.ui.steps.length - 1) {
      if (this.ui.control) {
        this.ui.control.style.display = 'none';
      }

      this.ui.element.classList.add(this.options.stateClasses.success);
      this.ui.element.classList.remove(this.options.stateClasses.onLastPage);
    } else {
      if (this.ui.back) {
        if (this.data.active === 0) {
          this.ui.back.removeAttribute('style');
        } else {
          this.ui.back.style.display = 'block';
        }
      }

      if (this.ui.next && this.ui.send) {
        // If the next page which is not disabled, the last page
        if (this.nextStepIsLast()) {
          this.ui.next.style.display = 'none';
          this.ui.send.style.display = 'block';

          this.ui.element.classList.add(this.options.stateClasses.onLastPage);
        } else {
          this.ui.next.style.display = 'block';
          this.ui.send.style.display = 'none';

          this.ui.element.classList.remove(this.options.stateClasses.onLastPage);
        }
      }
    }
  }

  nextStepIsLast() {
    let nextStep = this.data.active + 1;

    while (this.ui.steps[nextStep].getAttribute('data-enabled') === 'false') {
      nextStep += 1;
    }

    return nextStep === this.ui.steps.length - 1;
  }

  /**
   * Sets the focus on the correct element after change of the form section
   *
   * @memberof Stepper
   */
  setOnPageChangeFocus() {
    const step = this.ui.steps[this.data.active];

    if (this.ui.navigation) {
      this.ui.navigation.querySelector<HTMLButtonElement>('.mdl-stepper_navigation__step--active').focus();
    } else {
      step.querySelector('.mdl-notification').focus();
    }
    this.updateFlyingFocus();
  }

  validateSection() {
    const sections = this.nextStepIsLast() ? [this.ui.lastpage, ...Array.prototype.slice.call(this.ui.steps[this.data.active].querySelectorAll('fieldset'))] : this.ui.steps[this.data.active].querySelectorAll('fieldset');

    this.ui.form.removeAttribute('form-has-errors');

    this.ui.form.dispatchEvent(new CustomEvent(Stepper.events.validateSection, {
      detail: {
        sections,
      },
    }));

    // Thats needs a little delay (CZHDEV-1754)
    setTimeout(() => {
      const pages = this.nextStepIsLast()
        ? [this.ui.lastpage, this.ui.steps[this.data.active]]
        : [this.ui.steps[this.data.active]];
      let errors = 0;

      pages.forEach((page) => {
        errors += page.querySelectorAll('.invalid').length;
      });

      if (errors > 0) {
        // Focus the first invalid error field for accessibility reasons
        const firstInvalidField = this.ui.steps[this.data.active].querySelector('.invalid');
        firstInvalidField.querySelector('input, textarea, .atm-form_input__input--trigger').focus();
        this.scrollTo(firstInvalidField, this.options.scrollTopMargin);
      } else {
        // CZHDEV-2740 scroll to top so notification is visible after filling out a long form
        this.scrollTo(this.ui.element, this.options.scrollTopMargin);
      }
    }, 1);
  }

  changePage(newIndex) {
    if (newIndex > this.data.active) {
      this.validateSection();

      if (this.ui.form.hasAttribute('form-has-errors')) {
        return false;
      }
    }
    this.data.active = newIndex;
    this.ui.steps[newIndex].dispatchEvent(new CustomEvent(Stepper.events.checkRules));
    this.scrollTop();

    return true;
  }

  /**
   * Scroll to top
   */
  scrollTop() {
    this.scrollTo(this.ui.element);
  }

  /**
   * Scroll to top
   */
  scrollTo(element, marginTop = 0) {
    setTimeout(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const rect = element.getBoundingClientRect();
      window.scroll(0, rect.top + scrollTop - marginTop);
    }, 0);
  }

  async sendForm() {
    const { form } = this.ui;
    const action = form.getAttribute('action');
    let formData = null;

    this.validateSection();

    // Only of no errors are present in the form, it will be sent via ajax
    if (!this.ui.form.hasAttribute('form-has-errors')) {
      this.removeHiddenFormElements();

      formData = new FormData(this.ui.form);

      if (!window.fetch) {
        await import('whatwg-fetch');
      }

      this.ui.send.classList.add(this.options.stateClasses.buttonLoading);

      fetch(action, {
        method: 'post',
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            const notifications = this.ui.messageWrapper.querySelectorAll('.mdl-notification');

            notifications.forEach((notification) => {
              notification.remove();
            });

            this.showNetworkError();
          }

          this.ui.send.classList.remove(this.options.stateClasses.buttonLoading);

          return response;
        })
        .then(async (response) => {
          const validationErrorStatus = 400;
          const responseData = await response.json();

          const notifications = this.ui.messageWrapper.querySelectorAll('.mdl-notification');

          notifications.forEach((notification) => {
            notification.remove();
          });

          if (response.status === validationErrorStatus || (<any>responseData).validationErrors) {
            const cleanedValidationErrors = this
              .cleanValidationErrors((<any>responseData).validationErrors);

            if (cleanedValidationErrors.length > 0) {
              this.showValidationErrors((<any>responseData).validationErrors);
            }
          } else {
            // successful submission
            let newPageIndex = this.data.active + 1;

            while (this.ui.steps[newPageIndex].getAttribute('data-enabled') === 'false') {
              newPageIndex += 1;
            }

            this.data.active = newPageIndex;

            // show service overlay if defined
            const overlayId = this.ui.wrapper.getAttribute('data-overlay-id');
            if (overlayId) {
              const overlay = document.querySelector(`#${overlayId}`);
              if (overlay) {
                overlay.dispatchEvent(new CustomEvent('ServiceWrapper.showOverlay'));
              }
            }
          }
        })
        .catch((err) => {
          this.log('error', err);
        });
    }
  }

  /**
   * Removing all hidden form elements, so they are not included in the send request
   *
   * @memberof Stepper
   */
  removeHiddenFormElements() {
    const hiddenByRules = this.ui.form.querySelectorAll('.form__element--hidden-by-rule');

    hiddenByRules.forEach((hiddenElement) => {
      hiddenElement.parentNode.removeChild(hiddenElement);
    });
  }

  /**
   * Removing validation issues
   *
   * @param {Array<string>} validationErrors
   * @returns
   * @memberof Stepper
   */
  cleanValidationErrors(validationErrors: Array<string>) {
    return validationErrors.filter((fieldName) => {
      const field = this.ui.element.querySelector(`[name="${fieldName}"]`);

      return field.closest('.form__element--hidden-by-rule') === null;
    });
  }

  showValidationErrors(validationErrors: Array<string>) {
    const convertedTemplate = template(this.ui.notificationTemplate.innerHTML);
    const context = {
      list: this.generateList(validationErrors),
    };
    let message = '';

    if (validationErrors.length === 1) {
      message = this.ui.messageWrapper.getAttribute('data-singular-text');
    } else {
      message = this.ui.messageWrapper.getAttribute('data-plural-text');
    }

    const convertedMessage = template(message);
    const messageHTML = convertedMessage(context);

    const notificationHTML = convertedTemplate({
      icon: '#caution',
      message: messageHTML,
      isGreen: false,
      isBig: false,
      title: false,
    });

    const parsedNotification = new DOMParser().parseFromString(notificationHTML, 'text/html').querySelector('.mdl-notification');

    this.ui.messageWrapper.appendChild(parsedNotification);
    this.addNotificationEventListeners(parsedNotification);
  }

  showNetworkError() {
    const convertedTemplate = template(this.ui.notificationTemplate.innerHTML);
    const context = {
      title: false,
      message: this.ui.messageWrapper.getAttribute('data-error-text'),
      isGreen: false,
      isBig: false,
      icon: '#caution',
    };
    const errorHTML = convertedTemplate(context);
    const parsedError = new DOMParser().parseFromString(errorHTML, 'text/html').querySelector('.mdl-notification');

    this.ui.messageWrapper.appendChild(parsedError);
  }

  generateList(validationErrors) {
    let listString = '<ul>';

    validationErrors.forEach((validationError) => {
      listString = `${listString}<li>${this.generateFieldButton(validationError)}</li>`;
    });

    return `${listString}</ul>`;
  }

  generateFieldButton(validationError: string) {
    const field = this.ui.element.querySelector(`[name="${validationError}"]`);
    let fieldLabel = '';

    if (field.classList.contains('flatpickr-input')) {
      fieldLabel = field.getAttribute('placeholder');
    } else if (field.hasAttribute('data-select-option')) {
      const select = field.closest('.mdl-select');
      const label = select.querySelector('.atm-form_input__trigger-label');

      fieldLabel = label.textContent.trim();
    } else if (field.getAttribute('type') === 'radio' || field.getAttribute('type') === 'checkbox') {
      const fieldset = field.closest('fieldset');
      const legend = fieldset.querySelector('legend');

      fieldLabel = legend.textContent.trim();
    } else if (field.getAttribute('type') === 'file') {
      const fileUpload = field.closest('.mdl-file_upload');
      const title = fileUpload.querySelector('.atm-heading');

      fieldLabel = title.textContent.trim();
    } else {
      const fieldElement = field.parentElement;
      fieldLabel = fieldElement.querySelector('label').textContent.trim();
    }

    this.ui.wrapper.dispatchEvent(new CustomEvent(Stepper.events.showFieldInvalid, {
      detail: {
        field,
      },
    }));

    return `<button data-field="${validationError}">${fieldLabel}</button>`;
  }

  addNotificationEventListeners(notification) {
    const buttons = notification.querySelectorAll('button');

    buttons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const fieldName = event.target.getAttribute('data-field');
        const field = this.ui.element.querySelector(`[name="${fieldName}"]`);
        let traverse = field.parentElement;

        while (traverse.parentElement) {
          traverse = traverse.parentElement;

          if (traverse.matches('[data-step-index]')) break;
        }

        this.data.active = parseInt(traverse.getAttribute('data-step-index'), 10);
      });
    });
  }

  showRuleNotification(event) {
    const stepIndex = event.detail;
    const step = this.ui.steps[stepIndex];
    const notificationWrapper = step
      .querySelector(this.options.domSelectors.ruleNotificationWrapper);
    const ruleNotification = this.ui.ruleNotification.innerHTML;

    notificationWrapper.innerHTML = ruleNotification;
  }

  hideRuleNotification(stepIndex) {
    const step = this.ui.steps[stepIndex];
    const notificationWrapper = step
      .querySelector(this.options.domSelectors.ruleNotificationWrapper);

    notificationWrapper.innerHTML = '';
  }


  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default Stepper;
