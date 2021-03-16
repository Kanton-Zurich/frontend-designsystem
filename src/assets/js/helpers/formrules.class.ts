import Stepper from '../../../modules/stepper/stepper';
import FormGlobalHelper from './form';

class FormRules {
  private ui: {
    owner: HTMLElement,
    form: HTMLFormElement,
    step: HTMLDivElement,
  };

  private options: {
    domSelectors: any,
    stateClasses: any,
    isStep: boolean,
  };

  private data: {
    stepIndex: number,
    watchesOtherStep: boolean,
  };

  private rules: any;

  constructor($ruleOwner) {
    this.options = {
      domSelectors: {
        inputSelector: '[data-input]',
      },
      stateClasses: {
        hiddenByRule: 'form__element--hidden-by-rule',
      },
      isStep: $ruleOwner.hasAttribute('data-step-index'),
    };

    this.ui = {
      owner: $ruleOwner,
      form: $ruleOwner.closest('form'),
      step: $ruleOwner.closest('[data-step-index]'),
    };

    this.data = {
      stepIndex: null,
      watchesOtherStep: false,
    };

    if (!$ruleOwner.hasAttribute('data-step-index') && $ruleOwner.closest('[data-step-index]')) {
      this.data.stepIndex = parseInt($ruleOwner.closest('[data-step-index]').getAttribute('data-step-index'), 10);
    }

    this.getRules();

    this.getHierarchicalRules();

    if (this.data.stepIndex) {
      this.checkRulesForSameStep();
    }

    this.initEventListeners();
    this.setInitialState();
    this.addWatchers();
  }

  static get events() {
    return {
      stateChange: 'formrules.stateChange',
      hidden: 'formrules.hidden',
    };
  }

  initEventListeners() {
    if (this.data.watchesOtherStep) {
      this.ui.step.addEventListener(Stepper.events.checkRules, this.checkRules.bind(this));
    }
  }

  getRules() {
    this.rules = JSON.parse(this.ui.owner.getAttribute('data-rules'));
  }

  checkRulesForSameStep() {
    if (this.data.stepIndex) {
      for (let i = 0; i < this.rules.length; i += 1) {
        const rule = this.rules[i];

        for (let x = 0; x < rule.conditions.length; x += 1) {
          const condition = rule.conditions[x];
          const querySelector = condition.field.charAt(0) === '#' ? condition.field : `[name="${condition.field}"]`;
          const field = this.ui.form.querySelector(querySelector);

          if (field) {
            this.rules[i].conditions[x].isElementInSameStep = this.isElementInSameStep(field);

            if (!this.rules[i].conditions[x].isElementInSameStep) {
              this.ui.owner.setAttribute('data-watches-other-step', 'true');
              this.data.watchesOtherStep = true;
            }
          }
        }
      }
    }
  }

  isElementInSameStep(targetElement) {
    const targetStep = targetElement.closest('[data-step-index]');

    if (targetStep) {
      const targetStepIndex = parseInt(targetStep.getAttribute('data-step-index'), 10);

      return targetStepIndex === this.data.stepIndex;
    }

    return false;
  }

  getHierarchicalRules() {
    const copiedRules = this.rules;

    this.rules.forEach((rule, ruleIdx) => {
      // Necessary to have the source, because we alter the source
      const ruleCopy = JSON.parse(JSON.stringify(rule));

      rule.conditions.forEach((condition) => {
        const querySelector = condition.field.charAt(0) === '#' ? condition.field : `[name="${condition.field}"]`;
        const field = this.ui.form.querySelector(querySelector);

        const closestParent = field ? field.closest('[data-rules]') : null;

        if (closestParent) {
          const parentRules = JSON.parse(closestParent.dataset.rules);

          parentRules.forEach((parentRule, c) => {
            if ((parentRule.action !== rule.action)
            && parentRule.action !== 'show' && rule.action !== 'enable') {
              for (let i = 0; i < parentRule.conditions; i += 1) {
                parentRule.conditions[i].equals = !parentRule.conditions[i].equals;
              }
            }
            // Don't take the rules over when it is a step
            if (parentRule.action !== 'enable' && parentRule.action !== 'disable') {
              if (c === 0) {
                this.rules[ruleIdx].conditions = [...ruleCopy.conditions,
                  ...parentRule.conditions];
              } else {
                copiedRules.push({
                  action: rule.action,
                  conditions: [...ruleCopy.conditions,
                    ...parentRule.conditions],
                });
              }
            }
          });
        }
      });
    });

    this.ui.owner.setAttribute('data-rules', JSON.stringify(this.rules));
  }

  setInitialState() {
    const { action } = this.rules[0];

    this.rules.forEach((rule) => {
      if (action !== rule.action) {
        console.error('Rule mismatching, you can\'t mix show and hide rules');
      }
    });

    switch (action) {
      case 'show':
        this.checkRules();

        break;
      case 'enable':
      case 'disable':
        this.ui.owner.setAttribute('data-pending', 'true');
        this.ui.owner.removeAttribute('data-enabled');
        this.ui.owner.dispatchEvent(new CustomEvent(FormRules.events.stateChange, {
          detail: {
            state: 'pending',
            index: parseInt(this.ui.owner.getAttribute('data-step-index'), 10),
          },
        }));

        break;
      default:
        break;
    }
  }

  doAction(action, conditionsMet) {
    switch (action) {
      case 'show':
        if (conditionsMet) {
          this.ui.owner.classList.remove(this.options.stateClasses.hiddenByRule);
        } else {
          this.ui.owner.classList.add(this.options.stateClasses.hiddenByRule);
        }

        this.checkForWarning();

        break;
      case 'hide':
        if (conditionsMet) {
          this.ui.owner.classList.add(this.options.stateClasses.hiddenByRule);
        } else {
          this.ui.owner.classList.remove(this.options.stateClasses.hiddenByRule);
        }

        this.checkForWarning();

        break;
      case 'enable':
        if (conditionsMet) {
          this.ui.owner.setAttribute('data-enabled', 'true');
          this.ui.owner.removeAttribute('data-pending');

          this.ui.owner.dispatchEvent(new CustomEvent(FormRules.events.stateChange, {
            detail: {
              state: 'enabled',
              index: parseInt(this.ui.owner.getAttribute('data-step-index'), 10),
            },
          }));
        } else {
          this.ui.owner.setAttribute('data-enabled', 'false');
          this.ui.owner.removeAttribute('data-pending');

          this.ui.owner.dispatchEvent(new CustomEvent(FormRules.events.stateChange, {
            detail: {
              state: 'disabled',
              index: parseInt(this.ui.owner.getAttribute('data-step-index'), 10),
            },
          }));
        }
        break;
      case 'disable':
        if (conditionsMet) {
          this.ui.owner.setAttribute('data-enabled', 'false');
          this.ui.owner.removeAttribute('data-pending');

          this.ui.owner.dispatchEvent(new CustomEvent(FormRules.events.stateChange, {
            detail: {
              state: 'disabled',
              index: parseInt(this.ui.owner.getAttribute('data-step-index'), 10),
            },
          }));
        } else {
          this.ui.owner.setAttribute('data-enabled', 'true');
          this.ui.owner.removeAttribute('data-pending');

          this.ui.owner.dispatchEvent(new CustomEvent(FormRules.events.stateChange, {
            detail: {
              state: 'enabled',
              index: parseInt(this.ui.owner.getAttribute('data-step-index'), 10),
            },
          }));
        }

        break;
      default:
        break;
    }
  }

  addWatchers() {
    for (let i = 0; i < this.rules.length; i += 1) {
      const rule = this.rules[i];

      for (let x = 0; x < rule.conditions.length; x += 1) {
        const condition = rule.conditions[x];
        const querySelector = condition.field.charAt(0) === '#' ? condition.field : `[name="${condition.field}"]`;
        const fields = this.ui.form.querySelectorAll(querySelector);

        for (let c = 0; c < fields.length; c += 1) {
          const field = fields[c];

          if (condition.isElementInSameStep || !this.data.stepIndex) {
            if (field.hasAttribute('data-select-option')) {
              field.addEventListener('click', () => {
                this.checkRules();
              });
            } else {
              field.addEventListener('change', () => {
                this.checkRules();
              });
            }
            if (field.hasAttribute('data-live')) {
              let checkLock = false;
              field.addEventListener('keyup', () => {
                if (!checkLock) {
                  // Block checks inside safety interval to prevent browser performance issues
                  checkLock = true;
                  setTimeout(() => {
                    this.checkRules();
                    checkLock = false;
                  }, 500); // eslint-disable-line
                }
              });
            }
          }
        }
      }
    }
  }

  checkRules() {
    // Fill an array with all the results from the rules
    const rulesResult = [];
    const { action } = this.rules[0];


    for (let i = 0; i < this.rules.length; i += 1) {
      let conditionsMet = true;
      const rule = this.rules[i];

      for (let x = 0; x < rule.conditions.length; x += 1) {
        const condition = rule.conditions[x];
        let querySelector = condition.field.charAt(0) === '#' ? condition.field : `[name="${condition.field}"]`;
        let correctField = null;

        if (condition.equals) {
          if (condition.value) {
            querySelector = `${querySelector}[value="${condition.value}"]`;
          }

          correctField = this.ui.form.querySelector(querySelector);

          if (typeof correctField !== typeof undefined && correctField) {
            if ((condition.equals && !correctField.checked)
              || (!condition.equals && correctField.checked)) {
              conditionsMet = false;
            }
          }
        }

        if (condition.compare) {
          let compareModeDate = false;
          let value = this.ui.form.querySelector(querySelector).value.replace('\'', '');
          conditionsMet = false;

          if (isNaN(value)) { // eslint-disable-line
            value = FormGlobalHelper.ParseDateTimeString(value);
            compareModeDate = true;
          }

          const parseValue = (val) => {
            // check if there is an age comparison required
            if (condition.compareAge) {
              return FormGlobalHelper.CurrentDateAgeDifference(val);
            }
            if (compareModeDate) {
              return FormGlobalHelper.ParseDateTimeString(val);
            }
            return parseFloat(val);
          };

          if (!isNaN(value)) { // eslint-disable-line
            const valueNumeric = parseFloat(value);
            switch (condition.compare) {
              case 'greater':
                if (valueNumeric > parseValue(condition.value)) {
                  conditionsMet = true;
                }
                break;
              case 'less':
                if (valueNumeric < parseValue(condition.value)) {
                  conditionsMet = true;
                }
                break;
              case 'greaterEqual':
                if (valueNumeric >= parseValue(condition.value)) {
                  conditionsMet = true;
                }
                break;
              case 'lessEqual':
                if (valueNumeric <= parseValue(condition.value)) {
                  conditionsMet = true;
                }
                break;
              default:
                conditionsMet = false;
            }
          }
        }
      }

      rulesResult.push(conditionsMet);
    }

    this.doAction(action, rulesResult.filter(result => result === true).length > 0);
  }

  // Checks if the parent step was visited once and is currently hidden
  checkForWarning() {
    const step = this.ui.owner.closest('.mdl-stepper__step');
    const stepper = this.ui.owner.closest('.mdl-stepper');

    if (step && stepper) {
      const isStepVisited = step.hasAttribute('data-visited');
      const isHidden = step.classList.contains('mdl-stepper__step--hidden');

      if (isStepVisited && isHidden) {
        stepper.dispatchEvent(new CustomEvent(Stepper.events.showRuleNotification, {
          detail: parseInt(step.getAttribute('data-step-index'), 10),
        }));
      }
    }
  }
}

export default FormRules;
