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
    notchButton: HTMLButtonElement,
    top: HTMLDivElement,
  };

  public options: {
    domSelectors: any,
    stateClasses: any,
    animationDelay: number,
    animationDelayShort: number,
    stackDelay: number,
    stepperTopPadding: number,
  };

  public currentStepIndex: number;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      animationDelay: 500,
      animationDelayShort: 60,
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
        notchButton: '.mdl-decision_tree__notch button',
        top: '.mdl-decision_tree__top',
        form: '.mdl-stepper form',
      },
      stateClasses: {
        endpoint : 'mdl-decision_tree--endpoint',
        focussable : 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        // animation states
        beforeInProgress: 'mdl-decision_tree--before-in-progress',
        beforeStepChange: 'mdl-decision_tree--before-step-change',
        betweenStepChange: 'mdl-decision_tree--between-step-change',
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
      const callback = (hasErrors) => {
        if (!hasErrors) {
          this.animStepChange(() => {
            this.ui.stepper.dispatchEvent(new CustomEvent(Stepper.events.triggerNext));
          });
        }
      };
      this.ui.stepper.dispatchEvent(new CustomEvent(Stepper.events.triggerValidateSection, { detail: { callback } }));
    });

    this.eventDelegate.on('click', this.options.domSelectors.showNavButton, () => {
      if (this.ui.top.classList.contains(this.options.stateClasses.topOpen)) {
        this.animCloseTop(() => {
          this.updateFlyingFocus();
        });
      } else {
        this.animOpenTop(() => {
          const focussable = this.ui.top.querySelector(this.options.stateClasses.focussable);
          if (focussable) {
            focussable.focus();
          }
        });
      }
    });

    this.ui.navSteps.forEach((navStep) => {
      const editButton = navStep.querySelector('button');
      const dataStepIndex = parseInt(navStep.getAttribute('data-step'), 10);

      editButton.addEventListener('click', () => {
        if (dataStepIndex === 0) {
          this.animToStart();
        }
        this.animCloseTop();
        setTimeout(() => {
          this.animStepChange(() => {
            this.ui.stepper.dispatchEvent(new CustomEvent(Stepper.events.triggerGoToStep, {detail: {newStepIndex: dataStepIndex}}));
          }, true);
        },  this.options.animationDelay);
      });
    });

    this.ui.stepper.addEventListener(Stepper.events.stepChanged, (event: any) => {
      this.currentStepIndex = event.detail.newStep;
      if (this.currentStepIndex > 0 && !this.ui.element.classList.contains(this.options.stateClasses.inProgress)) {
        this.animToInProgress(this.updateNavigation.bind(this));
      } else {
        this.updateNavigation();
      }
      this.setNotchEnabled(this.currentStepIndex > 0);
      this.ui.element.classList.remove(this.options.stateClasses.endpoint);
      if (this.ui.steps[this.currentStepIndex].hasAttribute('data-stepper-endpoint')) {
        this.ui.element.classList.add(this.options.stateClasses.endpoint);
      }
    });
  }

  /**
   * Update the values within the navigation
   */
  updateNavigation() {
    this.ui.navSteps.forEach((step, index) => {
      const navItems = step.querySelectorAll('[data-step-item]');
      const fields = this.ui.steps[index].querySelectorAll('[data-input]');
      const stepperStep = this.ui.steps[parseInt(step.getAttribute('data-step'), 10)];
      const enabled = !stepperStep.hasAttribute('data-enabled') || stepperStep.getAttribute('data-enabled') === 'true';
      step.setAttribute('data-active', (parseInt(step.getAttribute('data-step'),10) < this.currentStepIndex && enabled).toString());

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

  setNotchEnabled(enabled) {
    if (enabled) {
      this.ui.notch.setAttribute('aria-hidden', 'false');
      this.ui.notchButton.setAttribute('aria-hidden', 'false');
      this.ui.notchButton.removeAttribute('tabindex');
    } else {
      this.ui.notch.setAttribute('aria-hidden', 'true');
      this.ui.notchButton.setAttribute('aria-hidden', 'true');
      this.ui.notchButton.setAttribute('tabindex', '-1');
    }
  }

  /** --- Animations --- **/

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
   * Animation to in progress state
   * @param callback
   */
  animToStart(callback = null) {
    this.ui.element.classList.remove(this.options.stateClasses.inProgress);
    if (callback) {
      callback();
    }
  }

  /**
   * Animation to open top header
   * @param callback
   */
  animOpenTop(callback = null) {
    if (!this.ui.top.classList.contains(this.options.stateClasses.topOpen)) {
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
    } else {
      if (callback) {
        callback();
      }
    }
  }

  /**
   * Animation to close top header
   * @param callback
   */
  animCloseTop(callback = null) {
    if (this.ui.top.classList.contains(this.options.stateClasses.topOpen)) {
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
    } else {
      if (callback) {
        callback();
      }
    }
  }

  /**
   * Animate step change
   * @param callback
   */
  animStepChange(callback = null, downward = false) {
    const originalHeight = this.ui.form.clientHeight + this.options.stepperTopPadding;
    this.ui.element.classList.add(`${this.options.stateClasses.beforeStepChange}${ downward ? '-down' : '-up'}`);
    setTimeout(() => {
      this.ui.stepper.style.height = `${originalHeight}px`;
      if (callback) {
        callback();
      }
      setTimeout(() => {
        const newHeight = this.ui.form.clientHeight + this.options.stepperTopPadding;
        if (newHeight > originalHeight) {
          this.ui.stepper.style.height = `${newHeight}px`;
        }
        this.ui.element.classList.add(`${this.options.stateClasses.betweenStepChange}${ downward ? '-down' : '-up'}`);
        this.ui.element.classList.remove(`${this.options.stateClasses.beforeStepChange}${ downward ? '-down' : '-up'}`);
        setTimeout(() => {
          this.ui.element.classList.remove(`${this.options.stateClasses.betweenStepChange}${ downward ? '-down' : '-up'}`);
        }, this.options.animationDelayShort);
        setTimeout(() => {
          if (newHeight < originalHeight) {
            this.ui.stepper.style.height = `${newHeight}px`;
          }
          setTimeout(() => {
            this.ui.stepper.style.removeProperty('height');
          }, this.options.animationDelay);
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
