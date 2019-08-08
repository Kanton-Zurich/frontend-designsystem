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
  }

  public ui: {
    element: HTMLDivElement,
    steps: any,
    back: HTMLButtonElement,
    next: HTMLButtonElement,
  }

  public options: {
    transitionTime: number,
    domSelectors: any,
    stateClasses: any,
  }

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      active: 0,
    };
    const defaultOptions = {
      transitionTime: 350,
      domSelectors: {
        steps: '[data-stepper="step"]',
        back: '[data-stepper="back"]',
        next: '[data-stepper="next"]',
      },
      stateClasses: {
        hiddenStep: 'mdl-stepper__step--hidden',
        transitionLeft: 'mdl-stepper__step--transition-left',
        transitionRight: 'mdl-stepper__step--transition-right',
        transitionOut: 'mdl-stepper__step--transition-out',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
    this.initWatchers();

    this.deactiveSteps();
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
  }

  /**
    * Initializing property watchers
  */
  initWatchers() {
    this.watch(this.data, 'active', this.onStepChange.bind(this));
  }

  onStepChange(propName, oldValue, newValue) {
    const transitionMoveClass = newValue > oldValue
      ? this.options.stateClasses.transitionRight
      : this.options.stateClasses.transitionLeft;

    this.ui.steps[newValue].classList.add(transitionMoveClass);
    this.ui.steps[newValue].classList.remove(this.options.stateClasses.hiddenStep);
    this.ui.steps[oldValue].classList.add(this.options.stateClasses.transitionOut);

    setTimeout(this.deactiveSteps.bind(this), this.options.transitionTime);
  }

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
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default Stepper;
