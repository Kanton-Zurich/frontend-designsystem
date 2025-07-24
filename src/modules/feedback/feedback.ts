/*!
 * Feedback
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class Feedback extends Module {
  public ui: {
    element: HTMLDivElement;
    steps: HTMLDivElement[];
  };
  currentStep: number;
  sessionKey: string;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        steps: '.mdl-feedback__step',
      },
      stateClasses: {
        active: 'active',
        visible: 'mdl-feedback--show',
      },
    };

    super($element, defaultData, defaultOptions, data, options);
    this.currentStep = 0;
    this.sessionKey = `czhdev_feedback_${window.location.href}`;
    if (!sessionStorage.getItem(this.sessionKey)) {
      this.ui.element.classList.add(this.options.stateClasses.visible);
    }
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
        [].slice.call(step.querySelectorAll('button')).forEach((button) => {
          button.onclick = () => {
            this.nextStep();
          };
        });
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

      if (this.currentStep + 1 === this.ui.steps.length) {
        // last step track session
        sessionStorage.setItem(this.sessionKey, 'true');
      }
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
