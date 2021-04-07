/*!
 * DecisionTree
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import Stepper from '../stepper/stepper';

class DecisionTree extends Module {
  public ui: {
    element: HTMLDivElement,
    stepper: HTMLDivElement,
    form: HTMLFormElement,
    steps: HTMLDivElement[],
    navSteps: HTMLDivElement[],
    nextButton: HTMLButtonElement,
    showNavButton: HTMLButtonElement,
    navigation: HTMLDivElement,
    notch: HTMLDivElement,
    top: HTMLDivElement,
  };

  public options: {
    domSelectors: any,
    stateClasses: any,
    animationDelay: number,
    stackDelay: number,
    stepperTopPadding: number,
  };

  public currentStepIndex: number;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      animationDelay: 500,
      stackDelay: 10,
      stepperTopPadding: 32,
      domSelectors: {
        stepper: '.mdl-stepper',
        steps: '[data-stepper="step"]',
        navSteps: '.mdl-decision_tree__navigation [data-step]',
        nextButton: '.mdl-decision_tree__next',
        showNavButton: '.mdl-decision_tree__notch button',
        navigation: '.mdl-decision_tree__navigation',
        notch: '.mdl-decision_tree__notch',
        top: '.mdl-decision_tree__top',
        form: '.mdl-stepper form',
      },
      stateClasses: {
        // animation states
        beforeInProgress: 'mdl-decision_tree--before-in-progress',
        beforeStepChange: 'mdl-decision_tree--before-step-change',
        inProgress: 'mdl-decision_tree--in-progress',
        topBeforeShow: 'mdl-decision_tree__top--before-show',
        topBeforeOpen: 'mdl-decision_tree__top--before-open',
        topBeforeClose: 'mdl-decision_tree__top--before-close',
        topOpen: 'mdl-decision_tree__top--open',
      },
    };

    super($element, defaultData, defaultOptions, data, options);
    this.currentStepIndex = 0;
    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      // eventname: `eventname.${ DecisionTree.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate.on('click', this.options.domSelectors.nextButton, () => {
      this.animStepChange(() => {
        this.ui.stepper.dispatchEvent(new CustomEvent(Stepper.events.triggerNext));
      });
    });

    this.eventDelegate.on('click', this.options.domSelectors.showNavButton, () => {
      if (this.ui.top.classList.contains(this.options.stateClasses.topOpen)) {
        this.animCloseTop();
      } else {
        this.animOpenTop();
      }
    });

    this.ui.stepper.addEventListener(Stepper.events.stepChanged, (event: any) => {
      this.currentStepIndex = event.detail.newStep;
      if (this.currentStepIndex > 0 && !this.ui.element.classList.contains(this.options.stateClasses.inProgress)) {
        this.animToInProgress(this.updateNavigation.bind(this));
      } else {
        this.updateNavigation();
      }
    });

    this.updateNavigation();
  }

  /**
   * Update the values within the navigation
   */
  updateNavigation() {
    this.ui.navSteps.forEach((step, index) => {
      const navItems = step.querySelectorAll('[data-step-item]');
      const fields = this.ui.steps[index].querySelectorAll('[data-input]');
      step.setAttribute('data-active', (index < this.currentStepIndex).toString());

      if (navItems.length !== fields.length) {
        console.warn('Decision Tree: Form field count does not correspond with navigation items');
        return;
      }

      fields.forEach((field, index) => {
        const input = <HTMLInputElement>field.querySelector('input');
        let value = '';
        if (input.type === 'radio') {
          const selected = <HTMLLabelElement>field.querySelector('input:checked + label');
          if (selected) {
            value = selected.innerText;
          }
        } else {
          value = `${input.placeholder}: ${input.value}`;
        }
        navItems[index].querySelector('dd').innerText = value;
      });
    });
  }

  /**
   * Animation to in progress state
   * @param callback
   */
  animToInProgress(callback = null) {
    this.ui.element.classList.remove(this.options.stateClasses.inProgress);
    this.ui.top.style.height = `${this.ui.top.clientHeight}px`;
    setTimeout(() => {
      this.ui.top.style.height = `0`;
      this.ui.element.classList.add(this.options.stateClasses.beforeInProgress);
      setTimeout(() => {
        this.ui.element.classList.add(this.options.stateClasses.inProgress);
        this.ui.element.classList.remove(this.options.stateClasses.beforeInProgress);
        this.ui.top.style.removeProperty('height');
        if (callback) {
          callback();
        }
      }, this.options.animationDelay);
    }, this.options.stackDelay);
  }


  /**
   * Animation to open top header
   * @param callback
   */
  animOpenTop(callback = null) {
    this.ui.top.classList.add(this.options.stateClasses.topBeforeShow);
    const height = this.ui.top.clientHeight;
    this.ui.top.classList.add(this.options.stateClasses.topBeforeOpen);
    this.ui.top.classList.remove(this.options.stateClasses.topBeforeShow);
    setTimeout(() => {
      this.ui.top.style.height = `${height}px`;
      setTimeout(() => {
        this.ui.top.classList.add(this.options.stateClasses.topOpen);
        this.ui.top.classList.remove(this.options.stateClasses.topBeforeOpen);
        this.ui.top.style.removeProperty('height');
        if (callback) {
          callback();
        }
      }, this.options.animationDelay);
    }, this.options.stackDelay);
  }

  /**
   * Animation to close top header
   * @param callback
   */
  animCloseTop(callback = null) {
    const height = this.ui.top.clientHeight;
    this.ui.top.style.height = `${height}px`;
    this.ui.top.classList.add(this.options.stateClasses.topBeforeClose);
    setTimeout(() => {
      this.ui.top.style.removeProperty('height');
      setTimeout(() => {
        this.ui.top.classList.remove(this.options.stateClasses.topOpen);
        this.ui.top.classList.remove(this.options.stateClasses.topBeforeClose);
        if (callback) {
          callback();
        }
      }, this.options.animationDelay);
    }, this.options.stackDelay);
  }

  /**
   * Animate step change
   * @param callback
   */
  animStepChange(callback = null) {
    let height = this.ui.form.clientHeight + this.options.stepperTopPadding;
    this.ui.element.classList.add(this.options.stateClasses.beforeStepChange);
    setTimeout(() => {
      this.ui.element.classList.remove(this.options.stateClasses.beforeStepChange);
      this.ui.stepper.style.height = `${height}px`;
      if (callback) {
        callback();
      }
      setTimeout(() => {
        let height = this.ui.form.clientHeight + this.options.stepperTopPadding;
        this.ui.stepper.style.height = `${height}px`;
        setTimeout(() => {
          this.ui.stepper.style.removeProperty('height');
        }, this.options.animationDelay);
      }, this.options.stackDelay);
    }, this.options.animationDelay);
  }


  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default DecisionTree;
