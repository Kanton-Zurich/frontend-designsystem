/*!
 * StepperNavigation
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import FormRules from '../../assets/js/helpers/formrules.class';

class StepperNavigation extends Module {
  public data: {
    active: number,
    steps: NodeListOf<HTMLDivElement>
    stepper: HTMLDivElement,
  }

  public ui: {
    element: HTMLOListElement,
    step: NodeListOf<HTMLButtonElement>,
  }

  public options: {
    domSelectors: any,
    stateClasses: any,
    hasRules: boolean,
  }

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      active: 0,
      steps: null,
    };
    const defaultOptions = {
      domSelectors: {
        step: '[data-stepper_navigation="step"]',
        number: '[data-stepper_navigation="number"]',
      },
      stateClasses: {
        activeStep: 'mdl-stepper_navigation__step--active',
        visitedStep: 'mdl-stepper_navigation__step--visited',
        pendingStep: 'mdl-stepper_navigation__step--pending',
        hiddenStep: 'mdl-stepper_navigation__step--hidden',
        tight: 'mdl-stepper_navigation--tight',
      },
      hasRules: false,
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi(['step']);
    this.setStepNumbers();
    this.initEventListeners();

    this.setActiveItem(null, this.data.active);
    this.checkWidth();
  }

  static get events() {
    return {
      navigationChange: 'navigationChange.StepperNavigation',
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate.on('stepChange', (event) => {
      if (event.detail.newStep > this.data.active) this.setVisited(this.data.active);
      this.setActiveItem(this.data.active, event.detail.newStep);
    });
    this.eventDelegate.on('click', this.options.domSelectors.step, (event, delegate) => {
      this.ui.element.dispatchEvent(new CustomEvent(StepperNavigation.events.navigationChange, {
        detail: {
          clickedPage: parseInt(delegate.getAttribute('data-step'), 10),
        },
      }));
    });

    this.data.steps.forEach((step) => {
      step.addEventListener(FormRules.events.stateChange, this.onStepStateChange.bind(this));
    });
  }

  setVisited(pageIndex) {
    this.ui.step[pageIndex].classList.add(this.options.stateClasses.visitedStep);
    this.ui.step[pageIndex].removeAttribute('disabled');
  }

  setActiveItem(before, after) {
    if (this.options.hasRules && after < before) {
      for (let c = after + 1; c < this.data.steps.length; c += 1) {
        this.ui.step[c].classList.remove(this.options.stateClasses.activeStep);
        this.ui.step[c].classList.remove(this.options.stateClasses.visitedStep);

        this.data.steps[after].removeAttribute('data-visited');

        this.ui.step[c].setAttribute('disabled', 'disabled');
      }
    } else if (before !== null) {
      this.ui.step[before].classList.remove(this.options.stateClasses.activeStep);
    }

    this.ui.step[after].classList.add(this.options.stateClasses.activeStep);
    this.ui.step[after].classList.remove(this.options.stateClasses.visitedStep);

    this.ui.step[after].removeAttribute('disabled');

    this.data.steps[after].setAttribute('data-visited', 'true');

    this.data.active = after;
  }

  setStepNumbers() {
    let counter = 1;
    this.ui.step.forEach((step, index) => {
      const number = step.querySelector(this.options.domSelectors.number);
      const stepInStepper = this.data.steps[index];

      if (!stepInStepper.hasAttribute('data-enabled') || stepInStepper.getAttribute('data-enabled') === 'true') {
        number.innerHTML = counter;

        counter += 1;
      }
    });
  }

  onStepStateChange(event) {
    const navigationItem = this.ui.step[event.detail.index];

    switch (event.detail.state) {
      case 'pending':
        navigationItem.classList.add(this.options.stateClasses.pendingStep);
        navigationItem.parentElement.classList.add(this.options.stateClasses.pendingStep);

        navigationItem.classList.remove(this.options.stateClasses.hiddenStep);
        navigationItem.parentElement.classList.remove(this.options.stateClasses.hiddenStep);

        break;
      case 'enabled':
        navigationItem.classList.remove(this.options.stateClasses.pendingStep);
        navigationItem.parentElement.classList.remove(this.options.stateClasses.pendingStep);

        navigationItem.classList.remove(this.options.stateClasses.hiddenStep);
        navigationItem.parentElement.classList.remove(this.options.stateClasses.hiddenStep);

        break;
      case 'disabled':
        navigationItem.classList.remove(this.options.stateClasses.pendingStep);
        navigationItem.parentElement.classList.remove(this.options.stateClasses.pendingStep);

        navigationItem.classList.add(this.options.stateClasses.hiddenStep);
        navigationItem.parentElement.classList.add(this.options.stateClasses.hiddenStep);

        break;
      default:
        break;
    }

    this.setStepNumbers();
  }

  checkWidth() {
    const buttonsWider = Array.prototype.slice.call(this.ui.step).filter((navigationStep) => {
      const liElement = navigationStep.parentNode;

      return navigationStep.getBoundingClientRect().width > liElement.getBoundingClientRect().width;
    });

    if (buttonsWider.length > 0) {
      this.ui.element.classList.add(this.options.stateClasses.tight);
    } else {
      this.ui.element.classList.remove(this.options.stateClasses.tight);
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

export default StepperNavigation;
