/*!
 * StepperNavigation
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class StepperNavigation extends Module {
  public data: {
    active: number,
  }

  public ui: {
    element: HTMLOListElement,
    step: HTMLButtonElement,
  }

  public options: {
    domSelectors: any,
    stateClasses: any,
  }

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      active: 0,
    };
    const defaultOptions = {
      domSelectors: {
        step: '[data-stepper_navigation="step"]',
      },
      stateClasses: {
        activeStep: 'mdl-stepper_navigation__step--active',
        visitedStep: 'mdl-stepper_navigation__step--visited',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi(['step']);
    this.initEventListeners();

    this.setActiveItem(null, this.data.active);
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
  }

  setVisited(pageIndex) {
    this.ui.step[pageIndex].classList.add(this.options.stateClasses.visitedStep);
    this.ui.step[pageIndex].removeAttribute('disabled');
  }

  setActiveItem(before, after) {
    if (before !== null) {
      this.ui.step[before].classList.remove(this.options.stateClasses.activeStep);
    }

    this.log(after);

    this.ui.step[after].classList.add(this.options.stateClasses.activeStep);
    this.ui.step[after].classList.remove(this.options.stateClasses.visitedStep);

    this.ui.step[after].removeAttribute('disabled');

    this.data.active = after;
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
