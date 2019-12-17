/*!
 * StepperNavigation
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import FormRules from '../../assets/js/helpers/formrules.class';

import ContextMenu from '../context_menu/context_menu';

class StepperNavigation extends Module {
  public data: {
    active: number,
    steps: NodeListOf<HTMLDivElement>
    stepper: HTMLDivElement,
  }

  public ui: {
    element: HTMLOListElement,
    step: NodeListOf<HTMLButtonElement>,
    multipleBefore: HTMLButtonElement,
    multipleAfter: HTMLButtonElement,
  }

  public options: {
    domSelectors: any,
    stateClasses: any,
    hasRules: boolean,
    hasTooManySteps: boolean,
    maxSteps: Number,
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
        multipleBefore: '[data-stepper_navigation="multipleBefore"]',
        multipleAfter: '[data-stepper_navigation="multipleAfter"]',
        contextMenuItem: '[data-context-menu="item"]',
      },
      stateClasses: {
        activeStep: 'mdl-stepper_navigation__step--active',
        visitedStep: 'mdl-stepper_navigation__step--visited',
        pendingStep: 'mdl-stepper_navigation__step--pending',
        hiddenStep: 'mdl-stepper_navigation__step--hidden',
        multipleStep: 'mdl-stepper_navgiation__step--multiple',
        multipleStepVisible: 'mdl-stepper_navgiation__step--multiple-visible',
        tight: 'mdl-stepper_navigation--tight',
        hiddenContextMenuItem: 'atm-context_menu_item--hidden',
      },
      hasRules: false,
      hasTooManySteps: false,
      maxSteps: 5,
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi(['step']);

    this.options.hasTooManySteps = this.ui.step.length > this.options.maxSteps;

    if (this.options.hasTooManySteps) {
      this.moveContextMenuTrigger();
      this.initContextMenu(this.ui.multipleBefore);
      this.initContextMenu(this.ui.multipleAfter);
    }

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

    this.eventDelegate.on('click', this.options.domSelectors.contextMenuItem, (event, delegate) => {
      const dataIndex = parseInt(delegate.parentElement.dataset.itemIndex, 10);

      this.ui.element.dispatchEvent(new CustomEvent(StepperNavigation.events.navigationChange, {
        detail: {
          clickedPage: dataIndex,
        },
      }));
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

    if (this.options.hasTooManySteps) this.hideSteps();
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

  /* eslint-disable no-magic-numbers */
  hideSteps() {
    const lastStepWithoutGoBack = 3;
    const firstStepWithoutPreview = this.ui.step.length - 3;
    let dontHideSteps = [0, this.ui.step.length - 1];
    let showEllipsisBefore = true;
    let showEllipsisAfter = true;
    const dontHideStepsBefore = [];
    const dontHideStepsAfter = [];

    if (this.data.active < lastStepWithoutGoBack) {
      dontHideSteps = [...dontHideSteps, 1, 2];

      showEllipsisBefore = false;
    } else if (this.data.active >= firstStepWithoutPreview) {
      dontHideSteps = [...dontHideSteps, this.ui.step.length - 2, this.ui.step.length - 3];

      showEllipsisAfter = false;
    } else {
      dontHideSteps = [...dontHideSteps, this.data.active];
    }

    this.ui.step.forEach((step, index) => {
      if (dontHideSteps.indexOf(index) === -1) {
        step.parentElement.classList.add(this.options.stateClasses.hiddenStep);
      } else {
        step.parentElement.classList.remove(this.options.stateClasses.hiddenStep);
      }
    });

    if (showEllipsisBefore) {
      const contextMenuBefore = this.ui.multipleBefore.nextElementSibling;
      const contextMenuItems = contextMenuBefore.querySelectorAll('[data-item-index]');

      for (let i = 0; i < this.data.active; i += 1) {
        if (dontHideSteps.indexOf(i) === -1) dontHideStepsBefore.push(i);
      }

      this.setContextMenuItems(contextMenuItems, dontHideStepsBefore);
    }

    if (showEllipsisAfter) {
      const contextMenuAfter = this.ui.multipleAfter.nextElementSibling;
      const contextMenuItems = contextMenuAfter.querySelectorAll('[data-item-index]');

      for (let i = this.data.active + 1; i < this.ui.step.length; i += 1) {
        if (dontHideSteps.indexOf(i) === -1) dontHideStepsAfter.push(i);
      }

      this.setContextMenuItems(contextMenuItems, dontHideStepsAfter);
    }

    this.setEllipsis(showEllipsisBefore, showEllipsisAfter);
  }
  /* eslint-enable no-magic-numbers */

  setEllipsis(showEllipsisBefore, showEllipsisAfter) {
    if (showEllipsisBefore) {
      this.ui.multipleBefore.parentElement.classList.remove(this.options.stateClasses.hiddenStep);
    } else {
      this.ui.multipleBefore.parentElement.classList.add(this.options.stateClasses.hiddenStep);
    }

    if (showEllipsisAfter) {
      this.ui.multipleAfter.parentElement.classList.remove(this.options.stateClasses.hiddenStep);
    } else {
      this.ui.multipleAfter.parentElement.classList.add(this.options.stateClasses.hiddenStep);
    }
  }

  setContextMenuItems(contextMenuItems, dontHideSteps) {
    contextMenuItems.forEach((menuItem) => {
      const index = parseInt(menuItem.dataset.itemIndex, 10);

      this.log(dontHideSteps.indexOf(index) === -1);

      if (dontHideSteps.indexOf(index) === -1) {
        menuItem.classList.add(this.options.stateClasses.hiddenContextMenuItem);
      } else {
        menuItem.classList.remove(this.options.stateClasses.hiddenContextMenuItem);
      }
    });
  }

  initContextMenu(contextMenuButton) {
    const contextMenu = contextMenuButton.nextElementSibling;

    new ContextMenu(contextMenu, {}, {
      attachTo: contextMenuButton,
      trigger: contextMenuButton,
    });
  }

  moveContextMenuTrigger() {
    const positionBefore = 1;
    const positionAfter = this.ui.step.length - 1;

    this.ui.element
      .insertBefore(this.ui.multipleBefore.parentNode, this.ui.step[positionBefore].parentNode);
    this.ui.element
      .insertBefore(this.ui.multipleAfter.parentNode, this.ui.step[positionAfter].parentNode);
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
