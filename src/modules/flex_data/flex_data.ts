/*!
 * FlexData
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import { template } from 'lodash';
import Table from '../table/table';
import Select from '../select/select';
import namespace from '../../assets/js/helpers/namespace';
import Pagination from '../pagination/pagination';

class FlexData extends Module {
  public ui: {
    element: HTMLDivElement,
    results: HTMLDivElement,
    resultsTable: HTMLTableElement,
    resultsTitle: HTMLHeadingElement,
    resultsBody: HTMLElement,
    resultsTemplate: HTMLScriptElement,
    resultsColumns: HTMLElement[],
    form: HTMLFormElement,
    pagination: HTMLDivElement,
    paginationInput: HTMLInputElement,
  };
  public dataUrl: string;
  private dataIdle: boolean;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        results: '.mdl-flex-data__results',
        resultsTable: '.mdl-table',
        resultsTitle: '.mdl-table .mdl-table__title',
        resultsBody: '.mdl-table .mdl-table__body',
        resultsTemplate: '[data-flex-template]',
        resultsColumns: '.mdl-table [data-column-name]',
        form: 'form',
        pagination: '.mdl-pagination',
        paginationInput: '.mdl-pagination input',
      },
      stateClasses: {
        // activated: 'is-activated'
      },
    };
    super($element, defaultData, defaultOptions, data, options);
    this.dataUrl = this.ui.element.getAttribute('data-source');
    this.dataIdle = true;
    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      // eventname: `eventname.${ FlexData.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.ui.resultsTable.addEventListener(Table.events.sort, this.onSortResults.bind(this));
    // -----------------------------------------------
    // Listen to pagination change event
    this.ui.pagination.addEventListener(Pagination.events.change, () => {
      this.loadResults();
    });

    this.updateViewFromURLParams();

    this.loadResults();
  }

  /**
   * Handle sort event on table
   * @param event
   */
  onSortResults(event) {
    const { detail } = event;
  }

  /**
   * Load results
   */
  private loadResults() {
    if (this.dataIdle) {
      this.dataIdle = false;
      this.fetchData((jsonData) => {
        this.ui.pagination.setAttribute('data-pagecount', jsonData.numberOfResultPages);
        this.ui.pagination.querySelector('.mdl-pagination__page-count > span').innerHTML = jsonData.numberOfResultPages;
        this.populateResultList(jsonData);
        this.dataIdle = true;
      });
    }
  }

  /**
   * Clear and add results
   * @param jsonData
   */
  populateResultList(jsonData) {
    this.ui.resultsBody.innerHTML = '';
    this.ui.resultsTitle.innerText = this.ui.results.getAttribute('data-result-count-title')
      .replace('%1', jsonData.numberOfResults);
    jsonData.data.forEach((item) => {
      const tr = document.createElement('tr');
      tr.classList.add('mdl-table__row');
      this.ui.resultsColumns.forEach((col) => {
        const colName = col.getAttribute('data-column-name');
        const td = document.createElement('td');
        td.classList.add('mdl-table__cell');
        td.setAttribute('data-table', 'cell');
        const props = {
          text: item[colName],
          link: item.link,
        };
        td.innerHTML = this.markupFromTemplate(this.ui.resultsTemplate.innerHTML, props);
        tr.appendChild(td);
      });
      this.ui.resultsBody.appendChild(tr);
    });
  }

  /**
   * Create markup with template and properties
   * @param scriptTemplate
   * @param props
   */
  private markupFromTemplate(scriptTemplate, props) {
    const compiled = template(scriptTemplate.replace(/this\./gm, 'self.')); // eslint-disable-line
    return compiled(props);
  }

  /**
   * Assemble URL from base url and filters
   */
  private constructUrl() {
    let resultUrl = this.dataUrl;

    const append = (key, value) => {
      if (value.length > 0) {
        resultUrl += resultUrl === this.dataUrl ? '?' : '&';
        resultUrl += `${key}=${value}`;
      }
    };
    const formData = window[namespace].form.formToJSON(this.ui.form.elements);

    Object.keys(formData).forEach((key) => {
      append(key, formData[key]);
    });
    append('page', this.ui.paginationInput.value);
    return resultUrl;
  }

  /**
   * Update from URL params
   */
  updateViewFromURLParams() {
    const params = this.getAllURLParams();
    Object.keys(params).forEach((key) => {
      switch (key) {
        case 'page':
          break;
        default:
          const selectedElements = this.ui.form.querySelectorAll(`input[name=${key}]`);
          const values = params[key];
          if (selectedElements.length > 0) {
            const item = <HTMLInputElement>selectedElements[0];
            // -----------
            // dropdown
            if (item.hasAttribute('data-select-option')) {
              const payload = item.getAttribute("type") === 'radio' ? values[0] : values;
              setTimeout(() => {
                item.parentElement.parentElement.parentElement.parentElement
                  .dispatchEvent(new CustomEvent(Select.events.setValue, {detail: payload}));
              },0);
            }
            // -----------
            // datepicker
            // else if (item.classList.contains('flatpickr-input')) {
            //   item.parentElement.parentElement.parentElement.dispatchEvent()
            // }
            // -----------
            // textfield
            else {
              item.value = values[0];
              item.classList.add('dirty');
            }
          }
          break;
      }
    });
  }

  /**
   * Fetch teaser data
   * @param callback
   */
  async fetchData(callback: Function) {
    if (!window.fetch) {
      await import('whatwg-fetch');
    }

    return fetch(this.constructUrl())
      .then(response => response.json())
      .then((response) => {
        if (response) {
          callback(response);
        }
      })
      .catch((err) => {
        this.log('error', err);
      });
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default FlexData;
