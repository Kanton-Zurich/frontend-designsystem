/*!
 * SearchResultList
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import {
  type SearchResultData,
  type SearchResultItem,
  type SearchResultMeta,
  type ResultByType,
  DEFAULT_TYPE,
} from '../search_page/search_page';

const SIMILAR_TERMS_POSITION = 2; // Position to insert similar terms in the results list

class SearchResultList extends Module {
  public ui: {
    element: HTMLDivElement;
    list: HTMLUListElement;
    topResultTemplate: HTMLTemplateElement;
    similarTermsTemplate: HTMLTemplateElement;
    linklistItemTemplate: HTMLTemplateElement;
    contentpageTemplate: HTMLTemplateElement;
    documentTemplate: HTMLTemplateElement;
    newsTemplate: HTMLTemplateElement;
    serviceTemplate: HTMLTemplateElement;
    personTemplate: HTMLTemplateElement;
  };

  public options: {
    domSelectors: any;
    stateClasses: any;
    url: string;
  };

  public data: {
    type: string;
    page: number;
  };

  public result: SearchResultData;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      type: 'contentpage',
      page: 1,
    };
    const defaultOptions = {
      domSelectors: {
        list: '.mdl-search_result_list__list',
        topResultTemplate: '[data-search_result_list="template-top-result"]',
        similarTermsTemplate: '[data-search_result_list="template-similar-terms"]',
        linklistItemTemplate: '[data-search_result_list="template-linklist-item"]',
        contentpageTemplate: '[data-search_result_list="template-contentpage"]',
        documentTemplate: '[data-search_result_list="template-document"]',
        newsTemplate: '[data-search_result_list="template-news"]',
        serviceTemplate: '[data-search_result_list="template-service"]',
        personTemplate: '[data-search_result_list="template-person"]',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    const parseResults = (str: string): SearchResultData => {
      try {
        return JSON.parse(str);
      } catch (e) {
        console.error('Error parsing search results:', e);
        return {
          results: [],
          resultsData: {
            numberOfResultPages: 0,
            numberOfResults: 0,
            queryId: '',
            resultsByType: [],
          },
        };
      }
    };
    this.result = parseResults($element.getAttribute('data-search_result_list-results'));

    this.renderList();
    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      update: 'SearchResultList.update',
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.ui.element.addEventListener(SearchResultList.events.update, (event: CustomEvent) => {
      this.result = event.detail.result;
      this.data.page = parseInt(event.detail.page) || 1;
      this.renderList();
    });
  }

  renderItem(item: SearchResultItem, index: number) {
    const templateName = `${item.type}Template`;
    if (!this.ui[templateName]) {
      this.log(`No template found for type: ${item.type}`);
      return;
    }
    const template = document.importNode(this.ui[templateName].content, true);
    if (!template || !template.firstElementChild) {
      this.log(`Template for type ${item.type} is empty or invalid.`);
      return;
    }

    // General
    const link = template.querySelector('a');
    if (link) {
      const href = item.link || '#';
      link.setAttribute('href', href);
      if (new URL(href, window.location.origin).origin !== window.location.origin) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    }
    const title = template.querySelector('.atm-heading, h4');
    if (title) title.innerHTML = item.title || '';

    switch (item.type) {
      // Content page only
      case 'contentpage': {
        const breadcrumb = template.querySelector('.mdl-content_page_card__breadcrumb');
        if (breadcrumb) {
          if (item.breadcrumb) breadcrumb.innerHTML = item.breadcrumb;
          else breadcrumb.remove();
        }
        const content = template.querySelector('.mdl-content_page_card__content');
        if (content) content.innerHTML = item.teaserText || '';
        break;
      }

      // Document only
      case 'document': {
        const icon = template.querySelector('.mdl-document_card__svg');
        if (icon) {
          const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
          use.setAttributeNS(
            'http://www.w3.org/1999/xlink',
            'href',
            `#${item.icon || 'document-pdf'}`
          );
          icon.appendChild(use);
        }
        const descriptionList = template.querySelector('.mdl-document_card__description-list');
        if (descriptionList && item.metadata && Array.isArray(item.metadata)) {
          item.metadata.forEach((meta: SearchResultMeta) => {
            const div = document.createElement('div');
            div.className = 'mdl-document_card__description-pair';
            const dt = document.createElement('dt');
            dt.className = 'mdl-document_card__description-term';
            dt.textContent = meta.term || '';
            const dd = document.createElement('dd');
            dd.className = 'mdl-document_card__description-description';
            dd.innerHTML = meta.description || '';
            div.appendChild(dt);
            div.appendChild(dd);
            descriptionList.appendChild(div);
          });
        }
        break;
      }

      // News only
      case 'news': {
        const newsLabel = template.querySelector('.mdl-teaser_card__label');
        if (newsLabel) {
          newsLabel.textContent = item.publicationType || '';
          if (item.date) {
            const time = document.createElement('time');
            time.textContent = item.date;
            newsLabel.appendChild(time);
          }
        }
        const newsText = template.querySelector('.atm-paragraph');
        if (newsText) newsText.innerHTML = item.teaserText || '';
        break;
      }

      // Service only
      case 'service': {
        const serviceText = template.querySelector('.mdl-service_card__text');
        if (serviceText) serviceText.innerHTML = item.teaserText || '';
        const modalId = `modal_search-result_${index}`;
        const modal = template.querySelector('.mdl-modal');
        modal.id = modalId;
        const button = template.querySelector('a');
        button.setAttribute('aria-controls', modalId);
        break;
      }

      // Person only
      case 'person': {
        const personRole = template.querySelector('.mdl-person_card__role');
        if (personRole) {
          if (item.role) personRole.innerHTML = item.role;
          else personRole.remove();
        }
        const contactInfo = template.querySelector('.mdl-person_card__contactinfo');
        const links = [];
        if (contactInfo) {
          if (item.email)
            links.push(`<a class="atm-text_link" href="mailto:${item.email}">${item.email}</a>`);
          if (item.phone)
            links.push(
              `<a class="atm-text_link" href="${item.phone.link}">${item.phone.title}</a>`
            );
          if (links.length > 0) contactInfo.innerHTML = links.join('<br>');
          else contactInfo.remove();
        }
        break;
      }
    }

    // Append the item to the list
    const li = document.createElement('li');
    li.className = `atm-search_result_item mdl-search_result_list--${item.type}`;
    li.append(template);
    return li;
  }

  renderTopResult(item: SearchResultItem, index: number) {
    const template = document.importNode(this.ui.topResultTemplate.content, true);
    const container = template.querySelector('.mdl-top_result__container');
    const typeLabels = template.querySelectorAll('.mdl-top_result__type');
    const countEl = template.querySelector('.mdl-top_result__count');
    if (countEl && typeLabels.length) {
      if (container) container.appendChild(this.renderItem(item, index));
      this.result.resultsData.resultsByType.find((resultByType: ResultByType) => {
        if (resultByType.type === item.type) {
          const count = resultByType.numberOfResults - 1;
          const moreResults = template.querySelector('.mdl-top_result__more-results');
          if (moreResults) moreResults.classList.toggle('hidden', count <= 0);
          countEl.textContent = String(count);
          typeLabels.forEach((el) => {
            el.textContent = resultByType.typeLabel || '';
          });
          return true;
        }
        return false;
      });
    }
    return template;
  }

  renderSimilarTerms() {
    const terms = this.result.similarTerms;
    if (!terms || terms.length === 0) return;
    if (this.data.page !== 1) return;
    if (!this.ui.similarTermsTemplate || !this.ui.linklistItemTemplate) {
      this.log(
        `Error rendering similar terms. Ensure [data-search_result_list="template-similar-terms"] and [data-search_result_list="template-linklist-item"] are present in search result list for ${this.data.type}.`
      );
      return;
    }
    const template = document.importNode(this.ui.similarTermsTemplate.content, true);
    const list = template.querySelector('.mdl-linklist__list');
    if (!list) return;

    terms.forEach((term) => {
      const item = document.importNode(this.ui.linklistItemTemplate.content, true);
      const text = item.querySelector('.atm-linklist_item__text span');
      if (text) text.textContent = term;
      list.appendChild(item);
    });
    return template;
  }

  renderList() {
    const type = this.ui.element.dataset.type;
    if (type) this.data.type = type;
    this.ui.list.textContent = ''; // Clear existing list content
    if (!this.result || !this.result.results || this.result.results.length === 0) return;

    const appendToList = (item: DocumentFragment | HTMLElement | undefined) => {
      if (item) this.ui.list.appendChild(item);
    };

    for (let i = 0; i < this.result.results.length; i++) {
      const item = this.result.results[i];
      appendToList(
        item.isTopResult && type === DEFAULT_TYPE
          ? this.renderTopResult(item, -1)
          : this.renderItem(item, i)
      );
      if (i === SIMILAR_TERMS_POSITION) appendToList(this.renderSimilarTerms());
    }
    if (this.result.results.length <= SIMILAR_TERMS_POSITION)
      appendToList(this.renderSimilarTerms());
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default SearchResultList;
