/*!
 * HeaderExpand
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class HeaderExpand extends Module {
  private expanded: boolean;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        expanderText: '.mdl-header_expand .atm-button__text',
        expanderIcon: '.mdl-header_expand__icon use',
      },
    };
    super($element, defaultData, defaultOptions, data, options);
    this.expanded = true;
    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      expandTriggered: 'HeaderExpand.ExpandTriggered',
      collapseTriggered: 'HeaderExpand.CollapseTriggered',
    };
  }

  setExpanded(expanded: boolean) {
    const xlink = this.ui.element.querySelector(this.options.domSelectors.expanderIcon);
    const text = this.ui.element.querySelector(this.options.domSelectors.expanderText);
    if (!xlink) return;
    if (!expanded) {
      xlink.setAttribute('xlink:href', '#angle_drop_down');
      text.innerHTML = text.getAttribute('data-expand');
    } else {
      xlink.setAttribute('xlink:href', '#angle_drop_up');
      text.innerHTML = text.getAttribute('data-collapse');
    }
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

    this.ui.element.addEventListener('click', () => {
      this.expanded = !this.expanded;
      const myEvent = this.expanded
        ? HeaderExpand.events.expandTriggered
        : HeaderExpand.events.collapseTriggered;
      this.ui.element.dispatchEvent(new CustomEvent(myEvent, { bubbles: true }));
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

export default HeaderExpand;
