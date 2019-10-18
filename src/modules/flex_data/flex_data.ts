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
    submitButton: HTMLButtonElement,
    clearButton: HTMLButtonElement,
  };
  public options: any;
  public dataUrl: string;
  private dataIdle: boolean;
  private currentUrl: string;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      initDelay: 300,
      domSelectors: {
        results: '.mdl-flex-data__results',
        resultsTable: '.mdl-table',
        resultsTitle: '.mdl-table .mdl-table__title',
        resultsBody: '.mdl-table .mdl-table__body',
        resultsTemplate: '[data-flex-template]',
        resultsColumns: '.mdl-table [data-column-name]',
        form: 'form',
        submitButton: 'form [data-search-flex]',
        clearButton: 'form [data-clear-flex]',
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
    this.ui.submitButton.addEventListener('click', this.onSearchResults.bind(this));
    this.ui.clearButton.addEventListener('click', this.onClearResults.bind(this));
    this.ui.form.addEventListener('keypress', (event: any) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.ui.submitButton.click();
        return false;
      }
      return true;
    });
    // -----------------------------------------------
    // Listen to pagination change event
    this.ui.pagination.addEventListener(Pagination.events.change, () => {
      this.loadResults();
    });
    this.updateViewFromURLParams();
    setTimeout(() => { this.loadResults(); }, this.options.initDelay);
  }

  /**
   * Search for data
   */
  onSearchResults() {
    this.loadResults();
  }

  /**
   * Clear search entries
   */
  onClearResults() {
    this.ui.form.reset();
    this.ui.form.querySelectorAll('.mdl-select').forEach((select: HTMLElement) => {
      select.dispatchEvent(new CustomEvent(Select.events.clear));
    });
    this.loadResults();
  }

  /**
   * Handle sort event on table
   * @param event
   */
  onSortResults(event) {
    const { column, direction } = event.detail;
    const newDirection = direction === 'ascending' ? 'descending' : 'ascending';
    const eventDetail = {
      detail: {
        column: column, // eslint-disable-line
        direction: newDirection,
      },
    };
    this.ui.resultsTable.dispatchEvent(new CustomEvent(Table.events.sortColumn, eventDetail));
    this.ui.paginationInput.value = '1';
    this.loadResults();
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
        const canonicalUrl = `${this.getBaselUrl()}?${this.currentUrl.split('?')[1]}`;
        let prevUrl = '';
        if (parseInt(this.ui.paginationInput.value, 10) > 1) {
          prevUrl = `${this.getBaselUrl()}?${this.currentUrl.split('?')[1].replace(/page=(0|[1-9][0-9]*)/, `page=${parseInt(this.ui.paginationInput.value, 10) - 1}`)}`;
        }
        let nextUrl = '';
        if (parseInt(this.ui.paginationInput.value, 10) < jsonData.numberOfResultPages) {
          nextUrl = `${this.getBaselUrl()}?${this.currentUrl.split('?')[1].replace(/page=(0|[1-9][0-9]*)/, `page=${parseInt(this.ui.paginationInput.value, 10) + 1}`)}`;
        }
        this.ui.pagination.dispatchEvent(new CustomEvent(Pagination.events.setCanonicalUrls,
          { detail: { prev: prevUrl, next: nextUrl } }));
        // update canonical links
        this.upsertLinkRel('prev', prevUrl);
        this.upsertLinkRel('next', nextUrl);
        this.upsertLinkRel('canonical', canonicalUrl);
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
    this.ui.pagination.setAttribute('data-pagecount', jsonData.numberOfResultPages);
    this.ui.pagination.querySelector('.mdl-pagination__page-count > span').innerHTML = jsonData.numberOfResultPages;
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
        resultUrl += `${key}=${encodeURIComponent(value)}`;
      }
    };
    const formData = window[namespace].form.formToJSON(this.ui.form.elements);

    Object.keys(formData).forEach((key) => {
      append(key, formData[key]);
    });
    append('page', this.ui.paginationInput.value);
    append('order', this.ui.resultsTable.getAttribute('data-sort-direction') === 'descending' ? 'desc' : 'asc');
    append('orderBy', this.ui.resultsTable.getAttribute('data-sort-column'));
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
          [this.ui.paginationInput.value] = params[key];
          break;
        case 'order':
          this.ui.resultsTable.setAttribute('data-sort-direction',
            params[key][0] === 'desc' ? 'descending' : 'ascending');
          break;
        case 'orderBy':
          this.ui.resultsTable.setAttribute('data-sort-column', params[key][0]);
          break;
        default:
          setTimeout(() => {
            const selectedElements = this.ui.form.querySelectorAll(`input[name=${key}]`); // eslint-disable-line
            const values = params[key]; // eslint-disable-line
            if (selectedElements.length > 0) {
              const item = <HTMLInputElement>selectedElements[0];

              if (item.hasAttribute('data-select-option')) {
                // -----------
                // dropdown
                const payload = {
                  data: item.getAttribute('type') === 'radio' ? values[0] : values,
                  emit: true,
                };
                const module = item.parentElement.parentElement.parentElement.parentElement;
                if (module.hasAttribute('data-drilldown-secondary')) {
                  setTimeout(() => {
                    module
                      .dispatchEvent(new CustomEvent(Select.events.setValue, { detail: payload }));
                  }, 0);
                } else {
                  module
                    .dispatchEvent(new CustomEvent(Select.events.setValue, { detail: payload }));
                }
              } else if (item.classList.contains('flatpickr-input')) {
                // -----------
                // datepicker
                item.value = decodeURIComponent(values[0]); // eslint-disable-line
                item.classList.add('dirty');
                item.parentElement.parentElement.parentElement.classList.add('dirty');
              } else {
                // -----------
                // textfield
                item.value = decodeURIComponent(values[0]); // eslint-disable-line
                item.classList.add('dirty');
              }
            }
          }, this.options.initDelay);
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
    this.currentUrl = this.constructUrl();
    return fetch(this.currentUrl)
      .then(response => response.json())
      .then((response) => {
        if (response) {
          const canonical = `${this.getBaselUrl()}?${this.currentUrl.split('?')[1]}`;
          history.pushState({url: canonical, }, null, canonical); // eslint-disable-line
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