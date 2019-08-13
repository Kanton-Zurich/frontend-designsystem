/*!
 * Stepper
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

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
    this.setWrapperHeight();
  }

  static get events() {
    return {
      // eventname: `eventname.${ Stepper.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate.on('click', this.options.domSelectors.next, () => {
      if (this.data.active + 1 < this.ui.steps.length) this.data.active += 1;
    });
    this.eventDelegate.on('click', this.options.domSelectors.back, () => {
      if (this.data.active > 0) this.data.active -= 1;
    });
    this.eventDelegate.on('click', this.options.domSelectors.send, this.sendForm.bind(this));
    this.eventDelegate.on('submit', this.options.domSelectors.wrapper, () => {
      this.sendForm();
      return false;
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
    const transitionMoveClass = newValue > oldValue
      ? this.options.stateClasses.transitionRight
      : this.options.stateClasses.transitionLeft;

    this.ui.steps[newValue].classList.add(transitionMoveClass);
    this.ui.steps[newValue].classList.remove(this.options.stateClasses.hiddenStep);
    this.ui.steps[oldValue].classList.add(this.options.stateClasses.transitionOut);

    this.setWrapperHeight();
    this.setButtonVisibility();
    this.setOnPageChangeFocus();

    setTimeout(this.deactiveSteps.bind(this), this.options.transitionTime);
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
        step.classList.remove(this.options.stateClasses.transitionOut);
      } else {
        step.classList.remove(this.options.stateClasses.transitionRight);
        step.classList.remove(this.options.stateClasses.transitionLeft);
      }
    });
  }

  /**
   * Sets the wrapper height to the one of the child
   *
   * @memberof Stepper
   */
  setWrapperHeight() {
    const currentStepHeight = this.ui.steps[this.data.active].getBoundingClientRect().height;

    this.ui.wrapper.style.minHeight = `${currentStepHeight}px`;
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
      const step = this.ui.steps[this.data.active - 1];

      step.querySelector('.form__section-title').focus();
    }
  }

  sendForm() {
    const form = this.ui.wrapper;

    this.log(form);
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
