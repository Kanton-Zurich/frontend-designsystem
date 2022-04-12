/*!
 * Feedback
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class Feedback extends Module {
  public ui: {
    element: HTMLDivElement,
    steps: HTMLDivElement[],
  };
  currentStep: number;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        steps: '.mdl-feedback__step',
      },
      stateClasses: {
        active: 'active',
        targetAttr: 'data-step-target',
      },
    };

    super($element, defaultData, defaultOptions, data, options);
    this.currentStep = 0;
    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      // eventname: `eventname.${ Feedback.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    if (this.ui.steps && this.ui.steps.length > 0) {
      this.ui.steps.forEach((step) => {
        if (step.hasAttribute(this.options.stateClasses.targetAttr)) {
          const target = step.getAttribute(this.options.stateClasses.targetAttr);
          [].slice.call(step.querySelectorAll('[data-value]')).forEach((button) => {
            button.onclick = () => {
              this.fetchJsonData(`${target}?value=${button.getAttribute('data-value')}`, false).then(() => {
                this.nextStep();
              });
            };
          });
        }
      });
      this.ui.steps[0].classList.add(this.options.stateClasses.active);
    }
  }

  nextStep() {
    if (this.ui.steps.length > this.currentStep + 1) {
      this.currentStep += 1;
      this.ui.steps.forEach((step) => {
        step.classList.remove(this.options.stateClasses.active);
      });
      this.ui.steps[this.currentStep].classList.add(this.options.stateClasses.active);
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

export default Feedback;
