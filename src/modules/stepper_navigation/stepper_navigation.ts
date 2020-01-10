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
        alignRightStep: 'mdl-stepper_navigation__step--align-right',
      },
      hasRules: false,
      hasTooManySteps: false,
      maxSteps: 5,
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi(['step']);

    this.options.hasTooManySteps = this.ui.step.length > this.options.maxSteps;
    const pendingSteps = Array.prototype.slice.call(this.data.steps).filter(step => step.dataset.pending === 'true');

    if (pendingSteps.length > 0) {
      pendingSteps.forEach((step) => {
        this.onStepStateChange({
          detail: {
            state: 'pending',
            index: parseInt(step.dataset.stepIndex, 10),
          },
        });
      });
    }

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

        navigationItem.dataset.status = 'pending';

        break;
      case 'enabled':
        navigationItem.classList.remove(this.options.stateClasses.pendingStep);
        navigationItem.parentElement.classList.remove(this.options.stateClasses.pendingStep);

        navigationItem.classList.remove(this.options.stateClasses.hiddenStep);
        navigationItem.parentElement.classList.remove(this.options.stateClasses.hiddenStep);

        navigationItem.dataset.status = 'enabled';

        break;
      case 'disabled':
        navigationItem.classList.remove(this.options.stateClasses.pendingStep);
        navigationItem.parentElement.classList.remove(this.options.stateClasses.pendingStep);

        navigationItem.classList.add(this.options.stateClasses.hiddenStep);
        navigationItem.parentElement.classList.add(this.options.stateClasses.hiddenStep);

        navigationItem.dataset.status = 'disabled';

        break;
      default:
        break;
    }

    this.setStepNumbers();

    if (this.options.hasTooManySteps) {
      this.hideSteps();
    }
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


  getPositionByStepIndex(index, steps) {
    return steps.findIndex(step => index.toString() === step.dataset.stepIndex);
  }

  getActiveNavigationSteps(activeFormSteps) {
    const navigationSteps = [];

    activeFormSteps.forEach((step) => {
      if (step.dataset.stepIndex) {
        navigationSteps.push(this.ui.step[parseInt(step.dataset.stepIndex, 10)]);
      } else {
        navigationSteps.push(this.ui.step[this.ui.step.length - 1]);
      }
    });

    return navigationSteps;
  }


  /* eslint-disable no-magic-numbers */
  hideSteps() {
    const arrSteps = Array.prototype.slice.call(this.data.steps);
    const indexOfFirstPending = arrSteps.findIndex(step => step.dataset.pending === 'true');
    const hasPending = indexOfFirstPending !== -1;
    const lastStepIndex = hasPending
      ? indexOfFirstPending : arrSteps.length - 1;
    const hideSteps = [];
    const visibleSteps = [];

    if (hasPending) {
      this.ui.multipleAfter.parentElement.classList.add(this.options.stateClasses.alignRightStep);
    } else {
      this.ui.multipleAfter.parentElement.classList
        .remove(this.options.stateClasses.alignRightStep);
    }

    this.moveContextMenuTrigger(indexOfFirstPending);

    arrSteps.length = lastStepIndex + 1;

    const activeSteps = arrSteps.filter(step => (!step.dataset.enabled || step.dataset.enabled === 'true') && step.dataset.pending !== '');
    const disabledSteps = arrSteps.filter(step => step.dataset.enabled === 'false' || step.dataset.pending === 'true').map(step => parseInt(step.dataset.stepIndex, 10));

    const activeNavigationSteps = this.getActiveNavigationSteps(activeSteps);
    const position = this.getPositionByStepIndex(this.data.active, activeSteps);

    const positionMaxBefore = hasPending ? 3 : 2;
    const positionMinAfter = activeSteps.length - 3;

    if (position <= positionMaxBefore) {
      for (let i = positionMaxBefore + 1; i <= lastStepIndex; i += 1) {
        hideSteps.push(i);
      }

      if (!hasPending) {
        hideSteps.length -= 1;
      }
    } else if (position >= positionMinAfter) {
      for (let i = positionMinAfter - 1; i > 0; i -= 1) {
        hideSteps.push(i);
      }
    } else {
      for (let i = 1; i <= activeSteps.length - 1; i += 1) {
        if (hasPending) {
          if (i !== position && i !== position + 1) {
            hideSteps.push(i);
          }
        } else {
          /* eslint-disable */
          if (i !== position) {
            hideSteps.push(i);
          }
          /* eslint-enable */
        }
      }

      if (!hasPending) {
        hideSteps.length -= 1;
      }
    }

    for (let i = 0; i < activeSteps.length; i += 1) {
      if (hideSteps.indexOf(i) === -1) {
        visibleSteps.push(i);
      }
    }

    hideSteps.forEach((stepToHide) => {
      const navigationElement = activeNavigationSteps[stepToHide];

      navigationElement.parentElement.classList.add(this.options.stateClasses.hiddenStep);
    });

    visibleSteps.forEach((stepToShow) => {
      const navigationElement = activeNavigationSteps[stepToShow];

      navigationElement.parentElement.classList.remove(this.options.stateClasses.hiddenStep);
    });

    const contextMenus = this.defineContextMenuItems(hideSteps, disabledSteps);

    this.setEllipsis(this.ui.multipleBefore, contextMenus.before.length > 0);
    this.setEllipsis(this.ui.multipleAfter, contextMenus.after.length > 0);
  }
  /* eslint-enable no-magic-numbers */

  setEllipsis(ellipsis, show) {
    if (show) {
      ellipsis.parentElement.classList.remove(this.options.stateClasses.hiddenStep);
    } else {
      ellipsis.parentElement.classList.add(this.options.stateClasses.hiddenStep);
    }
  }

  defineContextMenuItems(stepsInContextMenu, disabledSteps) {
    const contextMenus = {
      before: [],
      after: [],
    };

    stepsInContextMenu.forEach((stepInContextMenu) => {
      if (disabledSteps.indexOf(stepInContextMenu) === -1) {
        if (stepInContextMenu < this.data.active) {
          contextMenus.before.push(stepInContextMenu);
        } else {
          contextMenus.after.push(stepInContextMenu);
        }
      }
    });

    if (contextMenus.before.length > 0) {
      const beforeContextMenuItems = this.ui.multipleBefore.nextElementSibling
        .querySelectorAll(this.options.domSelectors.contextMenuItem);

      for (let i = 0; i < this.ui.step.length; i += 1) {
        if (contextMenus.before.indexOf(i) !== -1) {
          beforeContextMenuItems[i].classList
            .remove(this.options.stateClasses.hiddenContextMenuItem);
        } else {
          beforeContextMenuItems[i].classList
            .add(this.options.stateClasses.hiddenContextMenuItem);
        }
      }
    }

    if (contextMenus.after.length > 0) {
      const afterContextMenuItems = this.ui.multipleAfter.nextElementSibling
        .querySelectorAll(this.options.domSelectors.contextMenuItem);

      for (let i = 0; i < this.ui.step.length; i += 1) {
        if (contextMenus.after.indexOf(i) !== -1) {
          afterContextMenuItems[i].classList
            .remove(this.options.stateClasses.hiddenContextMenuItem);
        } else {
          afterContextMenuItems[i].classList
            .add(this.options.stateClasses.hiddenContextMenuItem);
        }
      }
    }

    return contextMenus;
  }

  initContextMenu(contextMenuButton) {
    const contextMenu = contextMenuButton.nextElementSibling;

    new ContextMenu(contextMenu, {}, {
      attachTo: contextMenuButton,
      trigger: contextMenuButton,
    });
  }

  moveContextMenuTrigger(_positionAfter: number = this.ui.step.length - 1) {
    const positionBefore = 1;
    let positionAfter = _positionAfter;

    if (positionAfter === -1) {
      positionAfter = this.ui.step.length - 1;
    }

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
