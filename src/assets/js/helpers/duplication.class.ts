import { uniqueId } from 'lodash';
import { Delegate } from 'dom-delegate';
import { watch } from 'wrist';

import FormRules from './formrules.class';
import { INTERACTION_ELEMENTS_QUERY } from './constants';

class DuplicationElement {
  public ui: {
    element: HTMLDivElement,
    template: HTMLScriptElement,
    button: HTMLButtonElement,
  }

  public options: {
    eventSelectors: any,
    stateClasses: any,
    rulesSelector: string,
  }

  public data: {
    duplications: number,
    maxDuplications: number,
  }

  private eventDelegate: any;

  constructor(element) {
    this.ui = {
      element,
      button: element.querySelector('.form__duplicator'),
      template: element.querySelector('script'),
    };

    this.options = {
      eventSelectors: {
        duplicator: '[data-duplicate="duplicator"]',
        remover: '[data-duplicate="remover"]',
      },
      stateClasses: {
        hasDuplicated: 'form__group--has-duplicated',
        maxDuplicationsReached: 'form__group--limited',
      },
      rulesSelector: '[data-rules]',
    };

    this.data = {
      duplications: 0,
      maxDuplications: Infinity,
    };

    this.eventDelegate = new Delegate(element);

    if (this.ui.element.hasAttribute('data-max-duplications')) {
      this.data.maxDuplications = parseInt(this.ui.element.getAttribute('data-max-duplications'), 10);
    }

    if (this.data.maxDuplications <= 0) {
      this.ui.element.classList.add(this.options.stateClasses.maxDuplicationsReached);
    }

    this.initEventListeners();
    this.initWatcher();
  }

  static get events() {
    return {
      domReParsed: 'domReParsed.form',
    };
  }

  initEventListeners() {
    this.eventDelegate.on('click', this.options.eventSelectors.duplicator, this.duplicateItself.bind(this));
    this.eventDelegate.on('click', this.options.eventSelectors.remover, this.removeDuplication.bind(this));
  }

  initWatcher() {
    watch(this.data, 'duplications', this.toggleDuplicationClasses.bind(this));
  }

  toggleDuplicationClasses(propName, oldVal, newVal) {
    if (newVal === 0) {
      this.ui.element.classList.remove(this.options.stateClasses.hasDuplicated);
    } else {
      this.ui.element.classList.add(this.options.stateClasses.hasDuplicated);
    }
  }

  duplicateItself() {
    if (this.data.duplications < this.data.maxDuplications) {
      const parsedHTML = new DOMParser().parseFromString(this.ui.template.innerHTML, 'text/html').querySelector('div');
      const uid = uniqueId();
      const fields = parsedHTML.querySelectorAll('[for], [name], [id], [data-remove-uid]');

      parsedHTML.setAttribute('data-uid', uid);

      fields.forEach((element) => {
        if (element.hasAttribute('name')) {
          element.setAttribute('name', `${element.getAttribute('name')}_${uid}`);
        }
        if (element.hasAttribute('id')) {
          element.setAttribute('id', `${element.getAttribute('id')}_${uid}`);
        }
        if (element.hasAttribute('for')) {
          element.setAttribute('for', `${element.getAttribute('for')}_${uid}`);
        }
        if (element.hasAttribute('data-fills-city')) {
          element.setAttribute('data-fills-city', `${element.getAttribute('data-fills-city')}_${uid}`);
        }
        if (element.hasAttribute('data-remove-uid')) {
          element.setAttribute('data-remove-uid', uid);
        }
      });

      this.ui.element.appendChild(parsedHTML);
      [].slice.call(parsedHTML.querySelectorAll('[data-init]')).forEach((subElement) => {
        (<any>window).estatico.helpers.initModule
          .bind((<any>window).estatico.helpers.app)(subElement.getAttribute('data-init'), subElement);
      });

      this.ui.element.dispatchEvent(new CustomEvent(DuplicationElement.events.domReParsed, {
        detail: parsedHTML,
      }));

      // Focus the first focusable element in the duplicated group
      setTimeout(() => {
        (<HTMLElement>parsedHTML.querySelector(INTERACTION_ELEMENTS_QUERY)).focus();
      }, 1);

      this.data.duplications += 1;

      this.initRules(parsedHTML, uid);

      if (this.data.duplications >= this.data.maxDuplications) {
        this.ui.element.classList.add(this.options.stateClasses.maxDuplicationsReached);
      }
    }
  }

  removeDuplication(event, delegate) {
    const button = delegate;
    const duplication = this.ui.element.querySelector(`[data-uid="${button.getAttribute('data-remove-uid')}"]`);

    duplication.parentNode.removeChild(duplication);

    this.data.duplications -= 1;

    const duplicators = this.ui.element.querySelectorAll(this.options.eventSelectors.duplicator);

    setTimeout(() => {
      duplicators[duplicators.length - 1].focus();
    }, 1);

    if (this.data.duplications < this.data.maxDuplications) {
      this.ui.element.classList.remove(this.options.stateClasses.maxDuplicationsReached);
    }
  }

  initRules(duplicatedGroup, uid) {
    const rulesElements = duplicatedGroup.querySelectorAll(this.options.rulesSelector);

    rulesElements.forEach(($elementWithARule) => {
      const rules = JSON.parse($elementWithARule.dataset.rules);

      rules.forEach((rule) => {
        rule.conditions.forEach((condition) => {
          const querySelector = condition.field.charAt(0) === '#' ? condition.field : `[name="${condition.field}"]`;
          const field = this.ui.element.querySelector(querySelector);

          if (field) {
            condition.field = `${condition.field}_${uid}`;
          }
        });
      });

      $elementWithARule.setAttribute('data-rules', JSON.stringify(rules));

      new FormRules($elementWithARule);
    });
  }
}

export default DuplicationElement;
