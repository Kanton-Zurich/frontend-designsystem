/*!
 * Breadcrumb
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class PageHeader extends Module {
  private expanded: boolean;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        pageLogo: '.mdl-page-header__logo-container',
        expander: '.mdl-page-header__expander',
        expanderText: '.mdl-page-header__expander .atm-button__text',
        expanderIcon: '.mdl-page-header__expander-icon use',
        header: '.mdl-header',
      },
      stateClasses: {
        headerMinimal: 'mdl-page-header--minimal',
      },
    };
    super($element, defaultData, defaultOptions, data, options);
    this.expanded = true;
    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      expand: 'PageHeader.expand',
      collapse: 'PageHeader.collapse',
    };
  }

  setExpanded(expanded: boolean) {
    const pageLogo = this.ui.element.querySelector(this.options.domSelectors.pageLogo);
    const xlink = this.ui.element.querySelector(this.options.domSelectors.expanderIcon);
    const text = this.ui.element.querySelector(this.options.domSelectors.expanderText);
    const pageHeaderContainer = this.ui.element.querySelectorAll('.cell')[1];
    const headerElement = document.querySelector(this.options.domSelectors.header);
    if (!expanded) {
      pageLogo.classList.remove('tiny-2');
      pageHeaderContainer.classList.remove('tiny-10', 'xsmall-10', 'small-10');
      this.ui.element.classList.add(this.options.stateClasses.headerMinimal);
      pageLogo.classList.add('tiny-0');
      pageHeaderContainer.classList.add('tiny-6', 'xsmall-6', 'small-7');
      if (xlink) {
        xlink.setAttribute('xlink:href', '#angle_drop_down');
        text.innerHTML = text.getAttribute('data-expand');
        headerElement.classList.add('visuallyhidden');
      }
    } else {
      this.ui.element.classList.remove(this.options.stateClasses.headerMinimal);
      pageLogo.classList.remove('tiny-0');
      pageHeaderContainer.classList.remove('tiny-6', 'xsmall-6', 'small-7');
      pageLogo.classList.add('tiny-2');
      pageHeaderContainer.classList.add('tiny-10', 'xsmall-10', 'small-10');
      if (xlink) {
        xlink.setAttribute('xlink:href', '#angle_drop_up');
        text.innerHTML = text.getAttribute('data-collapse');
        headerElement.classList.remove('visuallyhidden');
      }
    }
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate.on('PageHeader.expand', () => {
      this.setExpanded(true);
    });

    this.eventDelegate.on('PageHeader.collapse', () => {
      this.setExpanded(false);
    });

    const expanderButton = this.ui.element.querySelector(this.options.domSelectors.expander);
    if (expanderButton) {
      expanderButton.addEventListener('click', () => {
        this.expanded = !this.expanded;
        this.setExpanded(this.expanded);
      });
    }
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();
    // Custom destroy actions go here
  }
}

export default PageHeader;
