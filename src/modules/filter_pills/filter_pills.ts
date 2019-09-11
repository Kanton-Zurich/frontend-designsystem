/*!
 * FilterPills
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import { template } from 'lodash';

class FilterPills extends Module {
  public ui: {
    element: any,
    clearButton: HTMLButtonElement,
    template: HTMLScriptElement,
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        clearButton: '[data-clear]',
        template: '[data-template]',
        pills: '[data-pill]',
        hiddenControl: 'mdl-filter-pills__hidden-control',
      },
      stateClasses: {
        // activated: 'is-activated'
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      addTag: 'FilterPills.addTag',
      removeTag: 'FilterPills.removeTag',
      clearFilters: 'FilterPills.clearFilters',
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.ui.clearButton.addEventListener('click', () => {
      this.emitClear();
    });
    this.eventDelegate.on(FilterPills.events.addTag, this.addTag.bind(this));
    this.eventDelegate.on(FilterPills.events.removeTag, this.removeTag.bind(this));
    this.eventDelegate.on(FilterPills.events.clearFilters, this.clearFilters.bind(this));
  }

  /**
   * Add Tag
   * @param event
   */
  addTag(event) {
    const container = document.createElement('div');
    container.innerHTML = template(this.ui.template.innerHTML)(event.detail);
    const pill = container.querySelector('span');
    pill.querySelector('button').addEventListener('click', () => {
      this.emitRemove(pill);
    });
    this.ui.element.insertBefore(pill, this.ui.element.firstChild);
    this.ui.clearButton.classList.remove(this.options.domSelectors.hiddenControl);
  }

  /**
   * Remove Tag
   * @param event
   */
  removeTag(event) {
    this.ui.element.removeChild(event.detail.target);
    if (this.ui.element.querySelectorAll(this.options.domSelectors.pills).length < 1) {
      this.ui.clearButton.classList.add(this.options.domSelectors.hiddenControl);
    }
  }

  /**
   * Clear filter tags
   */
  clearFilters() {
    this.ui.element.querySelectorAll('[data-pill]').forEach((element) => {
      this.ui.element.removeChild(element);
    });
    this.ui.clearButton.classList.add(this.options.domSelectors.hiddenControl);
  }

  /**
   * Dispatch event filter tags
   */
  emitClear() {
    this.ui.element.dispatchEvent(new CustomEvent(FilterPills.events.clearFilters));
  }

  /**
   * Emit remove element
   */
  emitRemove(element) {
    this.ui.element.dispatchEvent(
      new CustomEvent(FilterPills.events.removeTag, { detail: { target: element } }) // eslint-disable-line
    );
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default FilterPills;
