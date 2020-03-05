import Stepper from '../../../modules/stepper/stepper';

class FormRules {
  private ui: {
    owner: HTMLElement,
    form: HTMLFormElement,
  }

  private options: {
    domSelectors: any,
    stateClasses: any,
    isStep: boolean,
  }

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
    };

    this.getRules();

    this.getHierarchicalRules();

    this.setInitialState();
    this.addWatchers();
  }

  static get events() {
    return {
      stateChange: 'formrules.stateChange',
      hidden: 'formrules.hidden',
    };
  }

  getRules() {
    this.rules = JSON.parse(this.ui.owner.getAttribute('data-rules'));
  }

  getHierarchicalRules() {
    const copiedRules = this.rules;

    this.rules.forEach((rule) => {
      // Necessary to have the source, because we alter the source
      const ruleCopy = JSON.parse(JSON.stringify(rule));

      rule.conditions.forEach((condition) => {
        const querySelector = condition.field.charAt(0) === '#' ? condition.field : `[name="${condition.field}"]`;
        const field = this.ui.form.querySelector(querySelector);

        const closestParent = field ? field.closest('[data-rules]') : null;

        if (closestParent) {
          const parentRules = JSON.parse(closestParent.dataset.rules);

          parentRules.forEach((parentRule, c) => {
            // Don't take the rules over when it is a step
            if (parentRule.action !== 'enable' && parentRule.action !== 'disable') {
              if (c === 0) {
                this.rules[c].conditions = [...ruleCopy.conditions,
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
    this.rules.forEach((rule) => {
      rule.conditions.forEach((condition) => {
        const querySelector = condition.field.charAt(0) === '#' ? condition.field : `[name="${condition.field}"]`;
        const fields = this.ui.form.querySelectorAll(querySelector);

        fields.forEach((field) => {
          if (field.hasAttribute('data-select-option')) {
            field.addEventListener('click', () => {
              this.checkRules();
            });
          } else {
            field.addEventListener('change', () => {
              this.checkRules();
            });
          }
        });
      });
    });
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

        if (condition.value) {
          querySelector = `${querySelector}[value="${condition.value}"]`;
        }

        correctField = this.ui.form.querySelector(querySelector);

        if (typeof correctField !== typeof undefined) {
          if ((condition.equals && !correctField.checked)
            || (!condition.equals && correctField.checked)) {
            conditionsMet = false;
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
