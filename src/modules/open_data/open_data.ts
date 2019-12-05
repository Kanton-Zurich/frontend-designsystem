/*!
 * OpenData
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import namespace from '../../assets/js/helpers/namespace';
import { sanitizeFileSize } from '../../assets/js/helpers/common';
import { template } from 'lodash';

class OpenData extends Module {
  public options: {
    domSelectors: any,
    stateClasses: any,
    apiCalls: Array<string>,
    licenseKeys: any,
  }

  public ui: {
    element: HTMLDivElement,
    wrapper: HTMLDivElement|HTMLUListElement,
    template: HTMLScriptElement,
  }

  public data: {
    resources: Array<any>;
  }

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      resources: [],
    };
    const defaultOptions = {
      domSelectors: {
        template: '[data-open_data="template"]',
        wrapper: '[data-open_data="wrapper"]',
        licenseLink: '[data-open_data="license_link"]',
      },
      stateClasses: {
        initialised: 'mdl-open_data--initialised',
      },
      apiCalls: JSON.parse($element.dataset.apiCalls),
      licenseKeys: {
        'NonCommercialAllowed-CommercialAllowed-ReferenceNotRequired': '1',
        'NonCommercialAllowed-CommercialAllowed-ReferenceRequired': '2',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();

    this.init();
  }

  async init() {
    await this.loadData();


    this.renderResults();
  }

  static get events() {
    return {
      // eventname: `eventname.${ OpenData.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate.on('click', this.options.domSelectors.licenseLink, (event, delegate) => {
      const url = delegate.dataset.href;

      window.open(url, '_blank');

      return false;
    });
  }

  renderResults() {
    const resources = this.data.resources.map(resource => ({
      title: resource.title[window[namespace].lang],
      url: resource.download_url,
      label: this.sanitizeLabel(resource.modified, resource.byte_size, resource.format),
      license: this.options.licenseKeys[resource.rights],
    }));
    const compiled = template(this.ui.template.innerHTML);
    const generated = compiled({ resources });

    this.ui.wrapper.innerHTML = generated;

    this.initEventListeners();
  }

  async loadData() {
    const promises = [];

    if (!window.fetch) {
      await import('whatwg-fetch');
    }

    this.options.apiCalls.forEach((resourceURL, index) => {
      promises.push(fetch(resourceURL, {})
        .then(response => response.json())
        .then((response) => {
          if (response && response.success) {
            this.data.resources.push(response.result);
          }
        }));
    });

    return Promise.all(promises);
  }

  sanitizeLabel(modifiedDate, byteSize, format) {
    const formattedDate = new Date(modifiedDate).toLocaleDateString(`${window[namespace].lang}-CH`, {
      year: 'numeric',
      month: '2-digit',
      day: 'numeric',
    });

    return [formattedDate, sanitizeFileSize(byteSize), format].join(' | ');
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default OpenData;
