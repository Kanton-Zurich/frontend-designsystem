/*!
 * Topiclist
 *
 * @author
 * @copyright
 */
import { template } from 'lodash';

import Module from '../../assets/js/helpers/module';
import Form from '../../assets/js/helpers/form.class';
import Autosuggest from '../../assets/js/helpers/autosuggest';
import Modal from '../modal/modal';

class Topiclist extends Module {
  public options: {
    url: string,
    hasFilter: Boolean,
    inputDelay: number,
    maxEntries: number,
    domSelectors: {
      showAllButton: string,
      contentNavItems: string,
      hiddenContentNavItems: any,
      subnavLayerUp: string,
      input: string,
    },
    stateClasses: {
      expanded: string,
      filtered: string,
      nav: string,
      hidden: string,
      visible: string,
      loading: string,
    };
  }

  public data: {
    query: string,
    isNav: boolean,
    json: {
      pages: any,
      filterField: {
        noResultsLabel: string,
        searchInSiteSearchLabel: string,
        searchPage: string,
      },
    },
    filteredPages: any,
    currentLayer: number,
  }

  public ui: {
    element: any,
    showAllButton: any,
    input: any,
    autosuggest: any,
    contentNav: any,
    contentTeaserTemplate: any,
    searchLink: any,
    navigation: any,
    subnavigationTemplate: any,
    firstLayer: any,
    furtherLayers: any,
  }

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      query: '',
      json: {},
      filteredPages: [],
      isNav: false,
      currentLayer: 0,
      url: null,
    };
    const defaultOptions = {
      hasFilter: false,
      maxEntries: 8,
      domSelectors: {
        showAllButton: '[data-topiclist="showAllTrigger"]',
        contentNavItems: '[data-init="topiclist"] .mdl-content_nav > ul > li',
        input: '[data-topiclist="input"]',
        autosuggest: '[data-topiclist="autosuggest"]',
        contentNav: '[data-topiclist="contentNav"]',
        contentTeaserTemplate: '[data-topiclist="contentTeaserTemplate"]',
        searchLink: '[data-topiclist="searchLink"]',
        navigation: '[data-topiclist="navigation"]',
        subnavigationTemplate: '[data-topiclist="subnavigationTemplate"]',
        firstLayer: '[data-topiclist="firstLayer"]',
        furtherLayers: '[data-topiclist="furtherLayers"]',
        subnavLayerUp: '[data-subnavigation="layerUp"]',
      },
      stateClasses: {
        expanded: 'mdl-topiclist--expanded',
        filtered: 'mdl-topiclist--filtered',
        nav: 'mdl-topiclist--nav',
        hidden: 'mdl-topiclist--hidden',
        visible: 'mdl-topiclist--visible',
        loading: 'mdl-topiclist--loading',
      },
    };
    super($element, defaultData, defaultOptions, data, options);

    this.options.hasFilter = typeof this.ui.input !== typeof undefined;

    this.data.isNav = this.ui.element.classList.contains(this.options.stateClasses.nav);

    this.initUi();
    this.initEventListeners();
    this.initWatchers();

    if (this.options.hasFilter) {
      new Form(this.ui.element);
    }
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate
      .on('click', this.options.domSelectors.showAllButton, this.showAll.bind(this))
      .on(Autosuggest.events.filtered, this.onAutosuggestDisplay.bind(this))
      .on(Autosuggest.events.reset, this.onAutosuggestReset.bind(this))
      .on(Autosuggest.events.noResult, this.renderNoResult.bind(this))
      .on('focus', this.options.domSelectors.input, () => {
        if (Object.keys(this.data.json).length === 0) {
          this.fetchData();
        }
      });

    if (this.data.isNav) {
      this.eventDelegate
        .on(Modal.events.display, async () => {
          await this.fetchData();
          if (Object.keys(this.data.json).length > 0) {
            this.renderNavigation();
          }

          this.ui.element.dispatchEvent(new CustomEvent('loadNavigationFinished', {
            detail: this.data.json,
          }));
        });
    }
  }

  initWatchers() {
    this.watch(this.data, 'currentLayer', this.onLayerChange.bind(this));
  }

  /**
   * Shows all hidden items from the content nav list
   */
  showAll() {
    this.ui.element.classList.add(this.options.stateClasses.expanded);

    this.ui.showAllButton.style.display = 'none';
  }

  /**
   * When Autosuggest has done something
   *
   * @param {*} event
   * @memberof Topiclist
   */
  onAutosuggestDisplay(event) {
    this.removeNoResult();

    this.ui.element.classList.add(this.options.stateClasses.filtered);
    this.ui.element.classList.remove(this.options.stateClasses.expanded);

    if (event.detail >= this.options.maxEntries) {
      this.ui.showAllButton.style.display = 'inline-flex';
    } else {
      this.ui.showAllButton.style.display = 'none';
    }
  }

  onAutosuggestReset() {
    this.removeNoResult();

    this.ui.element.classList.remove(this.options.stateClasses.filtered);
    this.ui.showAllButton.style.display = 'none';
  }

  /**
   * Fetching the data from the json, is only fired once
   */
  async fetchData() {
    this.ui.element.classList.add(this.options.stateClasses.loading);

    if (!window.fetch) {
      await import('whatwg-fetch');
    }

    return fetch(this.options.url)
      .then(response => response.json())
      .then((response) => {
        if (response) {
          this.data.json = response;

          // Initialize the autosuggest, which we have data for now
          new Autosuggest({
            input: this.ui.input,
            target: this.ui.autosuggest,
            parent: this.ui.element,
            template: this.ui.contentTeaserTemplate.innerHTML,
          }, this.data.json.pages.middleSection);
        }

        this.ui.element.classList.remove(this.options.stateClasses.loading);
      })
      .catch((err) => {
        this.log('error', err);
      });
  }


  /**
   * This renders the initial navigation
   */
  renderNavigation() {
    const { middleSection } = this.data.json.pages;

    middleSection.forEach((topic) => {
      this.renderContentTeaser(this.ui.navigation, {
        shortTitle: topic.title,
        buzzwords: topic.keywords,
        target: Object.prototype.hasOwnProperty.call(topic, 'subpages') ? '' : topic.path,
      }, Object.prototype.hasOwnProperty.call(topic, 'subpages'),
      topic);
    });

    window.dispatchEvent(new CustomEvent('reloadLineClamper'));

    this.addNavigationEventListeners();
  }

  /**
   * Renders the content teaser which is appended to a content nav
   * @param appendTo The container to which the teaser is applied to
   * @param context The data of the item
   * @param isButton If the item should be rendered as button
   (dependent on if the item has subpages, or is in the navigation)
   * @param topic The topic item, with all the data
   */
  renderContentTeaser(appendTo, context, isButton, topic) {
    const compiled = template(this.ui.contentTeaserTemplate.innerHTML);
    let html = compiled(context);

    html = `<li class="mdl-content_nav__item">${html}</li>`;

    const parsedHTML = new DOMParser().parseFromString(html, 'text/html').querySelector('li');

    if (isButton) {
      parsedHTML.querySelector('a').setAttribute('role', 'button');
      parsedHTML.querySelector('a').setAttribute('data-topic', JSON.stringify(topic));
    }

    appendTo.querySelector('ul').appendChild(parsedHTML);
  }

  /**
   * Renders the no result display for the filter
   */
  renderNoResult(event) {
    this.onAutosuggestDisplay(event);

    const compiled = template(this.ui.contentTeaserTemplate.innerHTML);
    const html = compiled({
      shortTitle: this.data.json.filterField.noResultsLabel,
      buzzwords: '',
      target: '',
    });

    const parsedHTML = new DOMParser().parseFromString(html, 'text/html').querySelector('a');

    parsedHTML.setAttribute('disabled', 'disabled');
    parsedHTML.setAttribute('data-topiclist', 'noResult');

    if (parsedHTML.querySelector('[data-lineclamp]')) {
      parsedHTML.querySelector('[data-lineclamp]').removeAttribute('data-lineclamp');
    }

    parsedHTML.removeAttribute('href');

    this.ui.autosuggest.appendChild(parsedHTML);

    // Render the link to the search
    const compiled2 = template(this.ui.searchLink.innerHTML);
    const html2 = compiled2({
      title: this.data.json.filterField.searchInSiteSearchLabel.replace(/\${query}/g, event.detail.query),
      path: this.data.json.filterField.searchPage.replace(/\${query}/g, event.detail.query),
    });

    const parsedLink = new DOMParser().parseFromString(html2, 'text/html').querySelector('a');
    parsedLink.setAttribute('data-topiclist', 'noResult');


    this.ui.autosuggest.appendChild(parsedLink);
  }

  /**
   * Removing the no result block
   */
  removeNoResult() {
    const noResultBlocks = this.ui.element.querySelectorAll('[data-topiclist="noResult"]');

    noResultBlocks.forEach((block) => {
      block.remove();
    });
  }

  setSubnav(topic) {
    const compiled = template(this.ui.subnavigationTemplate.innerHTML);
    const html = compiled({
      title: topic.title,
      pageUrl: topic.path,
      layer: this.data.currentLayer + 1,
      parent: this.data.currentLayer === 0 ? document.querySelector('.mdl-header__nav-item--active').textContent.trim() : this.ui.element.querySelector(`[data-layer="${this.data.currentLayer}"] h3`).textContent.trim(),
    });

    const parsedHTML = new DOMParser().parseFromString(html, 'text/html').querySelector('div');

    parsedHTML.querySelector(this.options.domSelectors.subnavLayerUp).addEventListener('click', () => { this.data.currentLayer -= 1; });

    this.ui.furtherLayers.appendChild(parsedHTML);

    this.setContentNavOfSubnav(topic, parsedHTML);

    this.data.currentLayer += 1;

    (<HTMLElement>parsedHTML.querySelector(this.options.domSelectors.subnavLayerUp)).focus();
  }

  setContentNavOfSubnav(topic, subnav) {
    if (Object.prototype.hasOwnProperty.call(topic, 'subpages')) {
      const { subpages } = topic;

      subpages.forEach((subtopic) => {
        this.renderContentTeaser(subnav.querySelector('[data-subnavigation="contentNav"]'), {
          shortTitle: subtopic.title,
          buzzwords: subtopic.keywords,
          target: Object.prototype.hasOwnProperty.call(subtopic, 'subpages') ? '' : subtopic.path,
        }, Object.prototype.hasOwnProperty.call(subtopic, 'subpages'), subtopic);
      });

      this.addNavigationEventListeners();
      window.dispatchEvent(new CustomEvent('reloadLineClamper'));
    }
  }

  onLayerChange(propName, oldValue, newValue) {
    if (newValue === 0) {
      this.ui.firstLayer.classList.remove(this.options.stateClasses.hidden);

      this.ui.element.querySelector(`[data-layer="${oldValue}"]`).remove();

      (<HTMLElement>document.querySelector('[data-modal="close"]')).focus();
    } else {
      this.ui.firstLayer.classList.add(this.options.stateClasses.hidden);

      this.ui.element.querySelector(`[data-layer="${newValue}"]`).classList.add(this.options.stateClasses.visible);

      if (oldValue > newValue) {
        this.ui.element.querySelector(`[data-layer="${oldValue}"]`).remove();
      } else if (this.ui.element.querySelector(`[data-layer="${oldValue}"]`)) {
        this.ui.element.querySelector(`[data-layer="${oldValue}"]`).classList.remove(this.options.stateClasses.visible);
      }
    }

    this.ui.element.dispatchEvent(new CustomEvent('layerChange', {
      detail: newValue,
    }));
  }

  addNavigationEventListeners() {
    this.eventDelegate.on('click', '[role="button"]', (event, delegate) => {
      event.preventDefault();

      const buttonData = JSON.parse(delegate.getAttribute('data-topic'));

      this.setSubnav(buttonData);
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

export default Topiclist;
