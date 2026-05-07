/*!
 * ServiceList
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import type { ServiceData } from '../edirectory/edirectory';
import Pagination from '../pagination/pagination';
import { cause, effect } from '../../assets/js/helpers/causeEffect';
import { showElement, hideElement } from '../../assets/js/helpers/common';

const MAX_RESULTS_PER_PAGE = 10;
const SERVICE_METADATA = [
  'relevantChannel',
  'electronicAddress',
  'inputFileFormats',
  'attachmentFileFormats',
];

class ServiceList extends Module {
  public ui: {
    element: HTMLElement;
    list: HTMLUListElement;
    templateServiceCardLinked: HTMLTemplateElement;
    templateServiceCardInert: HTMLTemplateElement;
    pagination: HTMLDivElement;
  };

  public data: {
    isSPA: boolean;
  };

  public paginationPage: () => number;
  public setPaginationPage: (v: number) => void; // eslint-disable-line no-unused-vars
  public pageCount: () => number;
  public setPageCount: (v: number) => void; // eslint-disable-line no-unused-vars

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      isSPA: false,
    };
    const defaultOptions = {
      domSelectors: {
        list: '[data-servicelist="list"]',
        items: '[data-url]',
        templateServiceCardLinked: '[data-servicelist="template-service-card--linked"]',
        templateServiceCardInert: '[data-servicelist="template-service-card--inert"]',
        pagination: '.mdl-pagination',
      },
      stateClasses: {},
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      // openModal: 'Modal.open',
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.ui.element.addEventListener('Component.setData', (event: CustomEvent) => {
      this.setData(event.detail);
    });

    const serviceElements = [].slice.call(
      this.ui.element.querySelectorAll(this.options.domSelectors.items)
    );
    serviceElements.forEach((service) => {
      service.addEventListener('click', (event) => {
        const modal = document.querySelector(`#${service.getAttribute('aria-controls')}`);
        const openModal = () => {
          modal.dispatchEvent(new CustomEvent('Modal.open'));
        };

        this.log(modal);
        if (modal.getAttribute('data-loaded')) {
          openModal();
        } else {
          this.fetchServicePage(service.getAttribute('data-url'), (data) => {
            const elem = document.createElement('div');
            elem.innerHTML = data;
            modal.innerHTML = elem.querySelector('#lightbox-content').innerHTML;
            modal.setAttribute('data-loaded', 'true');
            openModal();
            modal.dispatchEvent(new CustomEvent('Modal.initContent'));
          });
        }
        event.preventDefault();
      });
    });
  }

  setData(services: ServiceData[]) {
    const { list, pagination, templateServiceCardInert, templateServiceCardLinked } = this.ui;
    const pageCount = Math.ceil(services.length / MAX_RESULTS_PER_PAGE || 1);
    [this.paginationPage, this.setPaginationPage] = cause(1);
    [this.pageCount, this.setPageCount] = cause(pageCount);

    const fillList = (items: ServiceData[]) => {
      list.textContent = '';
      for (const item of items) {
        const href = item.serviceUrl;
        const template = href ? templateServiceCardLinked : templateServiceCardInert;
        const card = template.content.firstElementChild.cloneNode(true) as HTMLElement;
        card.querySelector('.mdl-service_card__title').textContent = item.title;
        card.querySelector('.mdl-service_card__text').textContent = item.teaserText;
        if (href) card.querySelector('a').setAttribute('href', href);
        const dl = card.querySelector<HTMLDListElement>('.mdl-service_card__description-list');
        if (item.metadata && Object.keys(item.metadata).length) {
          for (const key of SERVICE_METADATA) {
            const value = item.metadata[key];
            const metaItem = card.querySelector(`[data-key="${key}"]`);
            const metaPair = metaItem.closest('.mdl-service_card__description-pair');
            if (value) metaItem.textContent = value;
            else metaPair.remove();
          }
        } else {
          dl.remove();
        }
        list.appendChild(card);
      }
    };

    if (services.length) {
      showElement(this.ui.element);
      fillList(services);
    } else {
      hideElement(this.ui.element);
    }

    if (pageCount > 1) {
      showElement(pagination);

      pagination.addEventListener(Pagination.events.change, (e: CustomEvent) => {
        this.setPaginationPage(parseInt(e.detail.after, 10) || 1);
      });

      effect(() => {
        const currentPage = this.paginationPage();
        const paginatedServices = services.slice(
          (currentPage - 1) * MAX_RESULTS_PER_PAGE,
          currentPage * MAX_RESULTS_PER_PAGE
        );

        pagination.dispatchEvent(
          new CustomEvent(Pagination.events.setPageCount, {
            detail: this.pageCount(),
          })
        );

        showElement(pagination, this.pageCount() !== 1);
        fillList(paginatedServices);
      });
    } else {
      hideElement(pagination);
    }
  }

  /**
   * Fetch page data
   */
  async fetchServicePage(url: string, callback: Function) {
    return window
      .fetch(url)
      .then((response) => {
        if (response) {
          response.text().then((text) => {
            callback(text);
          });
        }
      })
      .catch((err) => {
        this.log('Data could not be loaded!', err);
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

export default ServiceList;
