/*!
 * SocialMediaStream
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import { template } from 'lodash';

class SocialMediaStream extends Module {
  public ui: {
    element: any,
    postTemplate: any,
    list: any,
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        list: '.mdl-social-media-stream__items',
        postTemplate: '[data-social-media="socialMediaPostTemplate"]',
      },
      stateClasses: {},
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();

    this.fetchData((jsonData) => {
      jsonData.forEach((item) => {
        const element = document.createElement('li');
        element.classList.add('mdl-social-media-stream__item');
        element.innerHTML = this.postFromTemplate(this.ui.postTemplate.innerHTML, item);
        this.ui.list.appendChild(element);
      });
    });
  }

  static get events() {
    return {};
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    // Event listeners
  }

  async fetchData(callback: Function) {
    if (!window.fetch) {
      await import('whatwg-fetch');
    }

    return fetch(this.ui.element.getAttribute('data-source'))
      .then(response => response.json())
      .then((response) => {
        if (response) {
          callback(response);
        }
      })
      .catch((err) => {
        this.log('error', err);
        callback(err);
      });
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();
    // Custom destroy actions go here
  }

  private postFromTemplate(templ, props) {
    const output = templ.replace(/\${> (.*?)}/gm, (m) => {
      const partial = m.match(/"(.*?)"/)[0].replace(/"/gm, '');
      const dataAttr = m.match(/" (.*?)}/)[0].replace(/"? ?}?/gm, '');
      const partialTemplate = this.ui.element.querySelector(`[data-social-media="${partial}"]`).innerHTML;
      if (props[dataAttr]) {
        return this.postFromTemplate(partialTemplate, props[dataAttr]);
      }
      return '';
    });
    const compiled = template(output.replace(/\${( *?)this( *?)}/gm, '${self}')); // eslint-disable-line
    const data = props instanceof Object ? props : {
      self: props,
    };
    return compiled(data);
  }
}

export default SocialMediaStream;
