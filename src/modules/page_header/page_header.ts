/*!
 * Breadcrumb
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import Modal from '../modal/modal';
import HeaderExpand from '../header_expand/header_expand';

class PageHeader extends Module {
  public ui: {
    element: HTMLDivElement;
    headerTitleCell: HTMLDivElement;
    title: HTMLHeadingElement;
  };
  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        expander: '.mdl-header_expand',
        header: '.mdl-header',
        headerTitleCell: '.cell:has(.mdl-page-header__title)',
        title: '.mdl-page-header__title',
      },
      stateClasses: {
        headerMinimal: 'mdl-page-header--minimal',
      },
    };
    super($element, defaultData, defaultOptions, data, options);
    this.initUi();
    this.initEventListeners();
  }

  setExpanded(expanded: boolean) {
    if (!expanded) {
      this.ui.element.classList.add(this.options.stateClasses.headerMinimal);
      this.ui.headerTitleCell.classList.add('tiny-7');
    } else {
      this.ui.element.classList.remove(this.options.stateClasses.headerMinimal);
      this.ui.headerTitleCell.classList.remove('tiny-7');
    }
    this.setHeaderVisibility(expanded);
    this.dispatchVerticalResizeEvent();
  }

  setHeaderVisibility(expanded: boolean) {
    const header = document.querySelector(this.options.domSelectors.header);
    if (header) {
      if (!expanded) {
        header.classList.add('visuallyhidden');
      } else {
        header.classList.remove('visuallyhidden');
      }
    }
  }

  setData(data) {
    this.ui.title.textContent = data.title;
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate.on(HeaderExpand.events.expandTriggered, () => {
      this.setExpanded(true);
    });
    this.eventDelegate.on(HeaderExpand.events.collapseTriggered, () => {
      this.setExpanded(false);
    });
    this.eventDelegate.on(Modal.events.setData, (event) => {
      this.setData(event.detail);
    });
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();
  }
}

export default PageHeader;
