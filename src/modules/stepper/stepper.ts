
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
  }

  public ui: {
    element: HTMLDivElement,
    steps: any,
    back: HTMLButtonElement,
    next: HTMLButtonElement,
    wrapper: HTMLFormElement,
    send: HTMLButtonElement,
    control: HTMLDivElement,
    navigation: HTMLOListElement,
    notificationTemplate: HTMLScriptElement,
    messageWrapper: HTMLDivElement,
    rules: NodeListOf<HTMLDivElement>
  }

  public options: {
    transitionTime: number,
    domSelectors: any,
    stateClasses: any,
  }

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      active: 0,
      hasNavigation: false,
    };
    const defaultOptions = {
      transitionTime: 350,
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
      },
      stateClasses: {
        hiddenStep: 'mdl-stepper__step--hidden',
        transitionLeft: 'mdl-stepper__step--transition-left',
        transitionRight: 'mdl-stepper__step--transition-right',
        transitionOut: 'mdl-stepper__step--transition-out',
        initialised: 'mdl-stepper--initialised',
        onLastPage: 'mdl-stepper--last-page',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    // Enforce steps to be wrapped in array
    this.initUi(['steps']);

    this.initEventListeners();
    this.initWatchers();

    this.deactiveSteps();

    this.setButtonVisibility();

    if (this.ui.navigation) {
      new StepperNavigation(this.ui.navigation,
        { active: this.data.active, steps: this.ui.steps }, {});
    }

    this.ui.element.classList.add(this.options.stateClasses.initialised);
  }

  static get events() {
    return {
      validateSection: 'validateSection',
      stepChange: 'stepChange',
      showFieldInvalid: 'showFieldInvalid',
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

      this.changePage(this.data.active - 1);
    });
    this.eventDelegate.on('click', this.options.domSelectors.send, this.sendForm.bind(this));
    this.eventDelegate.on('submit', this.options.domSelectors.wrapper, () => {
      this.sendForm();
      return false;
    });

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

    this.setButtonVisibility();
    this.deactiveSteps(newValue);

    if (this.ui.navigation) {
      this.ui.navigation.dispatchEvent(new CustomEvent(Stepper.events.stepChange, {
        detail: {
          newStep: newValue,
        },
      }));
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
      this.ui.control.style.display = 'none';
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
    if (this.data.hasNavigation) {
      this.log('hasnavigation');
      // @TODO: Discuss where to focus has to be set
    } else {
      const step = this.ui.steps[this.data.active];
      const stepTitle = step.querySelector('.form__section-title');

      if (stepTitle) {
        stepTitle.focus();
      } else {
        step.querySelector('.atm-notification').focus();
      }
    }
  }

  validateSection() {
    const section = this.ui.steps[this.data.active].querySelector('section');

    this.ui.wrapper.dispatchEvent(new CustomEvent(Stepper.events.validateSection, {
      detail: {
        section,
      },
    }));
  }

  changePage(newIndex) {
    if (newIndex > this.data.active) {
      this.validateSection();

      if (this.ui.wrapper.hasAttribute('form-has-errors')) {
        return false;
      }

      if (this.ui.navigation) {
        this.ui.navigation.dispatchEvent(new CustomEvent(Stepper.events.stepChange, {
          detail: {
            newStep: newIndex,
          },
        }));
      }
    }

    this.data.active = newIndex;

    return true;
  }

  async sendForm() {
    const form = this.ui.wrapper;
    const action = form.getAttribute('action');
    const formData = new FormData(this.ui.wrapper);

    this.validateSection();

    // Only of no errors are present in the form, it will be sent via ajax
    if (!this.ui.wrapper.hasAttribute('form-has-errors')) {
      if (!window.fetch) {
        await import('whatwg-fetch');
      }

      fetch(action, {
        method: 'post',
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            const notifications = this.ui.messageWrapper.querySelectorAll('.atm-notification');

            notifications.forEach((notification) => {
              notification.remove();
            });

            this.showNetworkError();
          }

          return response;
        })
        .then(async (response) => {
          const validationErrorStatus = 400;
          const responseData = await response.json();

          const notifications = this.ui.messageWrapper.querySelectorAll('.atm-notification');

          notifications.forEach((notification) => {
            notification.remove();
          });

          if (response.status === validationErrorStatus || (<any>responseData).validationErrors) {
            this.showValidationErrors((<any>responseData).validationErrors);
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

    const parsedNotification = new DOMParser().parseFromString(notificationHTML, 'text/html').querySelector('.atm-notification');

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
    const parsedError = new DOMParser().parseFromString(errorHTML, 'text/html').querySelector('.atm-notification');

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
    const fieldElement = field.parentElement;
    const fieldLabel = fieldElement.querySelector('label').textContent.trim();

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


  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default Stepper;
