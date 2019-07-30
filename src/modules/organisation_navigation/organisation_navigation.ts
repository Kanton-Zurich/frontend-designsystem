/*!
 * ImageGallery
 *
 * @author
 * @copyright
 */
import { template } from 'lodash';
import Module from '../../assets/js/helpers/module';

class OrganisationNavigation extends Module {
  public ui: {
    element: HTMLElement,
    topiclist: HTMLElement,
    topSection: HTMLElement,
    bottomSection: HTMLElement,
    organisationTeaserTemplate: HTMLElement,
  }

  public options: {
    domSelectors: {
      topiclist: string,
    },
    stateClasses: any,
  }

  public data: {
    topSection: any,
    bottomSection: Array<any>,
    moreLabel: string,
  }

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      topSection: null,
      bottomSection: null,
      moreLabel: '',
    };
    const defaultOptions = {
      domSelectors: {
        topiclist: '[data-init="topiclist"]',
        topSection: '[data-organisation_navigation="topSection"]',
        bottomSection: '[data-organisation_navigation="bottomSection"]',
        organisationTeaserTemplate: '[data-organisation_navigation="organisationTeaserTemplate"]',
      },
      stateClasses: {
        nextLayer: 'mdl-organisation_navigation--next-layer',
      },
    };

    super($element, defaultData, defaultOptions, data, options);
    this.initEventListeners();
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.ui.topiclist.addEventListener('loadNavigationFinished', (event) => {
      if (this.data.topSection === null && this.data.bottomSection === null) {
        const { topSection, bottomSection } = (<CustomEvent>event).detail.pages;

        this.data.topSection = topSection;
        this.data.bottomSection = bottomSection;
        this.data.moreLabel = (<CustomEvent>event).detail.moreInformationLabel;
      }

      this.renderOrganisationTeasers();
    });

    this.ui.topiclist.addEventListener('layerChange', (event) => {
      this.log((<CustomEvent>event).detail);
      if ((<CustomEvent>event).detail === 0) {
        this.ui.element.classList.remove(this.options.stateClasses.nextLayer);
      } else {
        this.ui.element.classList.add(this.options.stateClasses.nextLayer);
      }
    });
  }

  renderOrganisationTeasers() {
    this.renderTeaser(this.ui.topSection, {
      orgTitle: this.data.topSection.title,
      orgLead: this.data.topSection.text,
      url: this.data.topSection.link,
      moreLabel: this.data.moreLabel,
    });

    this.data.bottomSection.forEach((section) => {
      this.renderTeaser(this.ui.bottomSection, {
        orgTitle: section.title,
        orgLead: section.text,
        url: section.link,
        moreLabel: this.data.moreLabel,
      });
    });
  }

  renderTeaser(appendTo, context) {
    const compiled = template(this.ui.organisationTeaserTemplate.innerHTML);
    const htmlString = compiled(context);

    const parsedHTML = new DOMParser().parseFromString(htmlString, 'text/html').querySelector('div');

    appendTo.append(parsedHTML);
  }


  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default OrganisationNavigation;
