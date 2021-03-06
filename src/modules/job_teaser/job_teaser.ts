/*!
 * JobTeaser
 *
 * @author Robert Wueest
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import { template } from 'lodash';

class JobTeaser extends Module {
  public ui: {
    element: HTMLDivElement,
    list: HTMLUListElement,
    template: HTMLScriptElement,
  };
  public apiUrl;
  public baseUrl;
  public filters;
  public limit;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        list: '[data-job-teaser-list]',
        template: '[data-job-teaser-template]',
      },
      stateClasses: {
        apiUrlAttr: 'data-api-url',
        baseUrlAttr: 'data-base-url',
        filterAttr: 'data-filters',
        limitAttr: 'data-limit',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.apiUrl = this.ui.element.getAttribute(this.options.stateClasses.apiUrlAttr);
    this.baseUrl = this.ui.element.getAttribute(this.options.stateClasses.baseUrlAttr);
    this.filters = this.ui.element.getAttribute(this.options.stateClasses.filterAttr);
    this.limit = this.ui.element.getAttribute(this.options.stateClasses.limitAttr);
    this.initEventListeners();
  }

  static get events() {
    return {
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    // Event listeners
    this.fetchData(this.apiUrl);
  }

  /**
   * Fetch data from api
   * @param apiUrl
   */
  fetchData(apiUrl) {
    this.fetchJsonData(`${apiUrl}`).then((data) => {
      this.populateList(data);
    });
  }

  /**
   * Populate joblist after successful data fetch
   * @param data
   */
  populateList(data) {
    const scriptTemplate = this.ui.template.innerHTML;
    let jobsCompiled = '';
    // sort jobs descending from date modified
    const jobsSorted = data.jobs.sort((a, b) => {
      if ((new Date(a.dateModified2)).getTime() < ((new Date(b.dateModified2)).getTime())) {
        return 1;
      }
      return -1;
    });
    // Filter out jobs using the filters attribute
    const jobsFiltered = jobsSorted.filter((job) => {
      if (this.filters) {
        const filters = this.filters.split(';');
        // eslint-disable-next-line no-restricted-syntax
        for (const filter of filters) {
          const filterValue = filter.split('=')[1];
          const filterProperty = filter.split('=')[0].split('.');
          const drillDown = (object, properties) => {
            const drilledObj = object[properties[0]];
            if (properties.length > 1) {
              return drillDown(drilledObj, properties.splice(1));
            }
            return drilledObj;
          };

          const jobPropertyValue = drillDown(job, filterProperty);
          if (jobPropertyValue !== filterValue) {
            return false;
          }
        }
      }
      return true;
    });
    // limit jobs if required
    if (this.limit && jobsFiltered.length > parseInt(this.limit, 10)) {
      jobsFiltered.splice(parseInt(this.limit, 10));
    }
    // Populate the list with filtered jobs
    jobsFiltered.forEach((job) => {
      job.link = this.baseUrl + job.link;
      const compiled = template(scriptTemplate.replace(/this\./gm, 'self.')); // eslint-disable-line
      jobsCompiled += compiled(job);
    });
    // Update DOM
    this.ui.list.innerHTML = jobsCompiled;
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default JobTeaser;
