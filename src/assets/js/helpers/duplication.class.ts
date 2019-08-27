import { uniqueId } from 'lodash';
import { Delegate } from 'dom-delegate';
import { watch } from 'wrist';

class DuplicationElement {
  public ui: {
    element: HTMLDivElement,
    template: HTMLScriptElement,
    button: HTMLButtonElement,
  }

  public options: {
    eventSelectors: any,
    stateClasses: any,
  }

  public data: {
    duplications: number,
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
      },
    };

    this.data = {
      duplications: 0,
    };

    this.eventDelegate = new Delegate(element);

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
      if (element.hasAttribute('data-remove-uid')) {
        element.setAttribute('data-remove-uid', uid);
      }
    });

    this.ui.element.appendChild(parsedHTML);

    this.ui.element.dispatchEvent(new CustomEvent(DuplicationElement.events.domReParsed, {
      detail: parsedHTML,
    }));

    this.data.duplications += 1;
  }

  removeDuplication(event, delegate) {
    const button = delegate;
    const duplication = this.ui.element.querySelector(`[data-uid="${button.getAttribute('data-remove-uid')}"]`);

    duplication.parentNode.removeChild(duplication);

    this.data.duplications -= 1;
  }
}

export default DuplicationElement;
