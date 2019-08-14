/*!
 * Stepper
 *
 * @author
 * @copyright
 */
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
      },
      stateClasses: {
        hiddenStep: 'mdl-stepper__step--hidden',
        transitionLeft: 'mdl-stepper__step--transition-left',
        transitionRight: 'mdl-stepper__step--transition-right',
        transitionOut: 'mdl-stepper__step--transition-out',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    // Enforce steps to be wrapped in array
    this.initUi(['steps']);

    this.initEventListeners();
    this.initWatchers();

    this.deactiveSteps();


    if (this.ui.navigation) {
      new StepperNavigation(this.ui.navigation, { active: this.data.active }, {});
    }
  }

  static get events() {
    return {
      validateSection: 'validateSection',
      stepChange: 'stepChange',
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate.on('click', this.options.domSelectors.next, () => {
      this.changePage(this.data.active + 1);
    });
    this.eventDelegate.on('click', this.options.domSelectors.back, () => {
      this.changePage(this.data.active - 1);
    });
    this.eventDelegate.on('click', this.options.domSelectors.send, this.sendForm.bind(this));
    this.eventDelegate.on('submit', this.options.domSelectors.wrapper, () => {
      this.sendForm();
      return false;
    });

    this.ui.navigation.addEventListener(StepperNavigation.events.navigationChange,
      (event) => {
        this.data.active = (<any>event).detail.clickedPage;
      });
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
    this.setOnPageChangeFocus();
    this.deactiveSteps();

    if (this.ui.navigation) {
      this.ui.navigation.dispatchEvent(new CustomEvent(Stepper.events.stepChange, {
        detail: {
          newStep: newValue,
        },
      }));
    }
  }

  /**
   * Deactivate the steps and removes classes which are used for transitions
   *
   * @memberof Stepper
   */
  deactiveSteps() {
    this.ui.steps.forEach((step, index) => {
      if (index !== this.data.active) {
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
    if (this.data.active === 0) {
      this.ui.back.removeAttribute('style');
    } else {
      this.ui.back.style.display = 'block';
    }

    // If the second to last page
    if (this.data.active + 1 === this.ui.steps.length - 1) {
      this.ui.next.style.display = 'none';
      this.ui.send.style.display = 'block';
    } else {
      this.ui.next.style.display = 'block';
      this.ui.send.style.display = 'none';
    }

    // If the last page show no buttons
    if (this.data.active === this.ui.steps.length - 1) {
      this.ui.control.style.display = 'none';
    }
  }

  /**
   * Sets the focus on the correct element after change of the form section
   *
   * @memberof Stepper
   */
  setOnPageChangeFocus() {
    if (this.data.hasNavigation) {
      this.log('hasnavigation');
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

  changePage(newIndex) {
    if (newIndex > this.data.active) {
      const section = this.ui.steps[this.data.active].querySelector('section');

      this.ui.wrapper.dispatchEvent(new CustomEvent(Stepper.events.validateSection, {
        detail: {
          section,
        },
      }));

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

    if (!window.fetch) {
      await import('whatwg-fetch');
    }

    fetch(action, {
      method: 'post',
      body: formData,
    })
      .then(() => {
        this.data.active += 1;
      })
      .catch((err) => {
        this.log('error', err);
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
