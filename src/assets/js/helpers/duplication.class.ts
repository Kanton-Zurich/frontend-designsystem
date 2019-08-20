import { uniqueId } from 'lodash';

class DuplicationElement {
  public ui: {
    element: HTMLDivElement,
    template: HTMLScriptElement,
    button: HTMLButtonElement,
  }

  constructor(element) {
    this.ui = {
      element,
      button: element.querySelector('.form__duplicator'),
      template: element.querySelector('script'),
    };

    this.initEventListeners(this.ui.element);
  }

  static get events() {
    return {
      domReParsed: 'domReParsed.form',
    };
  }

  initEventListeners(targetElement) {
    targetElement.querySelector('.form__duplicator').addEventListener('click', this.duplicateItself.bind(this));
  }

  duplicateItself() {
    const parsedHTML = new DOMParser().parseFromString(this.ui.template.innerHTML, 'text/html').querySelector('div');
    const uid = uniqueId();
    const fields = parsedHTML.querySelectorAll('[for], [name], [id]');

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
    });

    this.ui.element.appendChild(parsedHTML);
    this.initEventListeners(parsedHTML);

    this.ui.element.dispatchEvent(new CustomEvent(DuplicationElement.events.domReParsed, {
      detail: parsedHTML,
    }));
  }
}

export default DuplicationElement;
