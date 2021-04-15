/*!
 * DecisionTree
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import Stepper from '../stepper/stepper';
import { animationEvent } from '../../assets/js/helpers/common';

class DecisionTree extends Module {
  public ui: {
    element: HTMLDivElement,
    heading: HTMLHeadingElement,
    stepper: HTMLDivElement,
    form: HTMLFormElement,
    steps: HTMLDivElement[],
    navSteps: HTMLDivElement[],
    nextButton: HTMLButtonElement,
    showNavButton: HTMLButtonElement,
    navigation: HTMLDivElement,
    notch: HTMLDivElement,
    notchButton: HTMLButtonElement,
    intro: HTMLDivElement,
    top: HTMLDivElement,
  };

  public options: {
    domSelectors: any,
    stateClasses: any,
    animationDelay: number,
    stackDelay: number,
    stepperTopPadding: number,
    scrollTopMargin: number,
  };

  public currentStepIndex: number;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      animationDelay: 300,
      stackDelay: 10,
      stepperTopPadding: 32,
      scrollTopMargin: 200,
      domSelectors: {
        stepper: '.mdl-stepper',
        heading: '.mdl-decision_tree__heading',
        steps: '[data-stepper="step"]',
        navSteps: '.mdl-decision_tree__navigation [data-step]',
        nextButton: '.mdl-decision_tree__next',
        showNavButton: '.mdl-decision_tree__notch button',
        navigation: '.mdl-decision_tree__navigation',
        notch: '.mdl-decision_tree__notch',
        notchButton: '.mdl-decision_tree__notch button',
        top: '.mdl-decision_tree__top',
        intro: '.mdl-decision_tree__intro',
        form: '.mdl-stepper form',
      },
      stateClasses: {
        endpoint: 'mdl-decision_tree--endpoint',
        focussable: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        // animation states
        beforeInProgress: 'mdl-decision_tree--before-in-progress',
        inProgress: 'mdl-decision_tree--in-progress',
        topBeforeShow: 'mdl-decision_tree__top--before-show',
        topBeforeOpen: 'mdl-decision_tree__top--before-open',
        topBeforeClose: 'mdl-decision_tree__top--before-close',
        topOpen: 'mdl-decision_tree__top--open',
        notchOpen: 'mdl-decision_tree__notch--open',
        stepSlideIn: 'mdl-decision_tree--anim-slide-in',
        stepSlideOut: 'mdl-decision_tree--anim-slide-out',
        stepFadeIn: 'mdl-decision_tree--anim-fade-in',
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
    this.eventDelegate.on('click', this.options.domSelectors.nextButton, (event) => {
      event.preventDefault();
      const callback = (hasErrors) => {
        if (!hasErrors) {
          if (this.ui.stepper.getBoundingClientRect().y < 0) {
            const marginTop = this.ui.heading ? parseInt(getComputedStyle(this.ui.heading).marginTop.slice(0, -2), 10) : 0; // eslint-disable-line
            this.scrollTo(this.ui.element, -(marginTop - 10));
          }
          this.animStepChange(() => {
            this.ui.stepper.dispatchEvent(new CustomEvent(Stepper.events.triggerNext));
          });
        }
      };
      this.ui.stepper.dispatchEvent(new CustomEvent(
        Stepper.events.triggerValidateSection,
        { detail: { callback } },
      ));
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
        if (this.ui.navigation.getBoundingClientRect().y < 0) {
          if (dataStepIndex === 0) {
            this.scrollTo(this.ui.navigation, this.options.scrollTopMargin);
          } else {
            const marginTop = this.ui.heading ? parseInt(getComputedStyle(this.ui.heading).marginTop.slice(0, -2), 10) : 0; // eslint-disable-line
            this.scrollTo(this.ui.element, -(marginTop - 10));
          }
        }
        if (dataStepIndex === 0) {
          this.animToStart();
        }
        this.animCloseTop(null, dataStepIndex === 0);
        this.animStepChange(() => {
          this.ui.stepper.dispatchEvent(new CustomEvent(
            Stepper.events.triggerGoToStep,
            { detail: { newStepIndex: dataStepIndex } },
          ));
        }, true);
      });
    });

    this.ui.stepper.addEventListener(Stepper.events.stepChanged, (event: any) => {
      this.currentStepIndex = event.detail.newStep;
      if (this.currentStepIndex > 0
        && !this.ui.element.classList.contains(this.options.stateClasses.inProgress)) {
        this.animToInProgress(this.updateNavigation.bind(this));
      } else {
        this.updateNavigation();
      }
      this.setNotchEnabled(this.currentStepIndex > 0);
      // check and set endpoint status
      this.ui.element.classList.remove(this.options.stateClasses.endpoint);
      this.ui.nextButton.removeAttribute('tabindex');
      this.ui.nextButton.removeAttribute('aria-hidden');
      if (this.ui.steps[this.currentStepIndex].hasAttribute('data-stepper-endpoint')) {
        this.ui.element.classList.add(this.options.stateClasses.endpoint);
        this.ui.nextButton.setAttribute('tabindex', '-1');
        this.ui.nextButton.setAttribute('aria-hidden', 'true');
      }
    });
  }

  /**
   * Update the values within the navigation
   */
  updateNavigation() {
    this.ui.navSteps.forEach((step, stepIndex) => {
      const navItems = step.querySelectorAll('[data-step-item]');
      const fields = this.ui.steps[stepIndex].querySelectorAll('[data-input]');
      const stepperStep = this.ui.steps[parseInt(step.getAttribute('data-step'), 10)];
      const enabled = !stepperStep.hasAttribute('data-enabled') || stepperStep.getAttribute('data-enabled') === 'true';
      step.setAttribute('data-active', (parseInt(step.getAttribute('data-step'), 10) < this.currentStepIndex && enabled).toString());

      if (navItems.length !== fields.length) {
        console.warn('Decision Tree: Form field count does not correspond with navigation items'); // eslint-disable-line
        return;
      }

      fields.forEach((field, fieldIndex) => {
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
        navItems[fieldIndex].querySelector('dd').innerText = value;
      });
    });
  }

  /**
   * Enabled or disable not at the top
   * @param enabled
   */
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

  /**
   * Scroll helper function
   * @param element
   * @param marginTop
   */
  scrollTo(element, marginTop = 0) {
    setTimeout(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const rect = element.getBoundingClientRect();
      window.scroll(0, rect.top + scrollTop - marginTop);
    }, 0);
  }

  /** --- Animations --- */
  /**
   * Animation to in progress state
   * @param callback
   */
  animToInProgress(callback = null) {
    this.ui.element.classList.remove(this.options.stateClasses.inProgress);
    this.ui.top.style.height = `${this.ui.top.clientHeight}px`;
    setTimeout(() => {
      this.ui.top.style.height = '0';
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
      this.ui.notch.classList.add(this.options.stateClasses.notchOpen);
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
    } else if (callback) {
      callback();
    }
  }

  /**
   * Animation to close top header
   * @param callback
   * @param preserveIntro
   */
  animCloseTop(callback = null, preserveIntro = false) {
    if (this.ui.top.classList.contains(this.options.stateClasses.topOpen)) {
      const height = this.ui.top.clientHeight;
      this.ui.top.style.height = `${height}px`;
      this.ui.top.classList.add(this.options.stateClasses.topBeforeClose);
      this.ui.notch.classList.remove(this.options.stateClasses.notchOpen);
      const { marginBottom } = getComputedStyle(this.ui.intro);
      const introHeight = this.ui.intro.clientHeight + parseInt(marginBottom.slice(0, -2), 10); // eslint-disable-line
      setTimeout(() => {
        if (preserveIntro) {
          this.ui.top.style.height = `${introHeight}px`;
        } else {
          this.ui.top.style.removeProperty('height');
        }
        setTimeout(() => {
          this.ui.top.classList.remove(this.options.stateClasses.topOpen);
          this.ui.top.classList.remove(this.options.stateClasses.topBeforeClose);
          if (callback) {
            callback();
          }
          this.ui.top.style.removeProperty('height');
        }, this.options.animationDelay);
      }, this.options.stackDelay);
    } else if (callback) {
      callback();
    }
  }

  /**
   * Animate step change
   * @param callback
   * @param fade
   */
  animStepChange(callback = null, fade = false) {
    const onAnimationEvent = (event) => {
      if (event.target.nodeName === 'FORM') {
        switch (event.animationName) {
          case 'slide-out':
            this.ui.stepper.style.height = `${this.ui.form.clientHeight + this.options.stepperTopPadding}px`;
            if (callback) {
              callback();
            }
            setTimeout(() => {
              const newHeight = this.ui.form.clientHeight + this.options.stepperTopPadding;
              this.ui.stepper.style.height = `${newHeight}px`;
            }, 0);
            this.ui.element.classList.add(this.options.stateClasses.stepSlideIn);
            break;
          case 'slide-in':
            this.ui.element.classList.remove(this.options.stateClasses.stepSlideOut);
            this.ui.element.classList.remove(this.options.stateClasses.stepSlideIn);
            this.ui.stepper.style.removeProperty('height');
            this.ui.element.removeEventListener(animationEvent('end'), onAnimationEvent);
            break;
          case 'fade-in':
            this.ui.element.classList.remove(this.options.stateClasses.stepFadeIn);
            break;
          default:
            break;
        }
      }
    };

    this.ui.element.addEventListener(animationEvent('end'), onAnimationEvent);
    if (fade) {
      setTimeout(() => {
        this.ui.element.classList.add(this.options.stateClasses.stepFadeIn);
        if (callback) {
          callback();
        }
      }, this.options.animationDelay);
    } else {
      this.ui.element.classList.add(this.options.stateClasses.stepSlideOut);
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

export default DecisionTree;
