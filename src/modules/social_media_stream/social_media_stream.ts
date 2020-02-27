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
    moreButton: any,
    footer: any,
    notification: any,
  };
  private currentPage: number;
  private dataIdle: boolean;


  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        list: '.mdl-social-media-stream__items',
        postTemplate: '[data-social-media="socialMediaPostTemplate"]',
        footer: '.mdl-social-media-stream__footer',
        moreButton: '.mdl-social-media-stream__footer-button',
        notification: '.mdl-social-media-stream__notification',
      },
      stateClasses: {},
    };
    super($element, defaultData, defaultOptions, data, options);
    this.currentPage = 0;
    this.dataIdle = true;
    this.initUi();
    this.initEventListeners();
    this.loadPosts();
  }

  static get events() {
    return {};
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.ui.moreButton.addEventListener('click', () => {
      this.loadPosts();
    });
  }

  async fetchData(callback: Function) {
    const dataSource = this.ui.element.getAttribute('data-source').replace('{page}', this.currentPage);
    if (!window.fetch) {
      await import('whatwg-fetch');
    }
    this.ui.moreButton.classList.add('atm-button--loading');
    this.ui.notification.classList.add('hidden');
    return fetch(dataSource)
      .then((response) => {
        if (response.status !== 200 && response.status !== 204) { // eslint-disable-line
          throw new Error('Error fetching data');
        }
        return response.status === 204 ? {} : response.json(); // eslint-disable-line
      })
      .then((response) => {
        this.ui.moreButton.classList.remove('atm-button--loading');
        if (response) {
          callback(response);
        }
      })
      .catch((err) => {
        this.ui.moreButton.classList.remove('atm-button--loading');
        this.ui.notification.classList.remove('hidden');
        this.ui.footer.style.display = 'none';
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

  private populatePostList(jsonData) {
    const items = jsonData.posts;
    this.currentPage += 1;
    if (jsonData.hasMorePosts) {
      this.ui.footer.style.display = 'flex';
    } else {
      this.ui.footer.style.display = 'none';
    }
    items.forEach((item) => {
      const element = document.createElement('li');
      element.classList.add('mdl-social-media-stream__item');
      element.innerHTML = this.postFromTemplate(this.ui.postTemplate.innerHTML, item);
      [].slice.call(element.querySelectorAll('a')).forEach((elem) => {
        elem.addEventListener('click', (event) => {
          event.stopPropagation();
        });
      });
      const citeElement = element.querySelector('div.mdl-social-media-post__cite');
      if (citeElement) {
        citeElement.addEventListener('click', (event) => {
          window.open(item.cite.link, '_blank');
          event.stopPropagation();
        });
      }
      element.addEventListener('click', () => {
        window.open(item.link, '_blank');
      });
      this.ui.list.appendChild(element);
    });
  }

  /**
   * Show more posts in list
   */
  private loadPosts() {
    if (this.dataIdle) {
      this.dataIdle = false;
      this.fetchData((jsonData) => {
        this.populatePostList(jsonData);
        this.dataIdle = true;
      });
    }
  }

  /**
   * Create markup with template and properties
   * @param postTemplate
   * @param props
   */
  private postFromTemplate(postTemplate, props) {
    const output = postTemplate.replace(/\${> (.*?)}/gm, (m) => {
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
