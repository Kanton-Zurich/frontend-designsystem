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
      clearTags: 'FilterPills.clearTags',
      setTags: 'FilterPills.setTags',
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.ui.clearButton.addEventListener('click', () => {
      this.emitClear();
    });
    this.eventDelegate.on(FilterPills.events.addTag, this.onAddTag.bind(this));
    this.eventDelegate.on(FilterPills.events.removeTag, this.onRemoveTag.bind(this));
    this.eventDelegate.on(FilterPills.events.clearTags, this.onClearTags.bind(this));
    this.eventDelegate.on(FilterPills.events.setTags, this.onSetTags.bind(this));
  }

  /**
   * Add Tag
   * @param data
   */
  addTag(data) {
    const container = document.createElement('div');
    container.innerHTML = template(this.ui.template.innerHTML)(data);
    const pill = container.querySelector('span');
    pill.querySelector('button').addEventListener('click', () => {
      this.emitRemove(pill);
    });
    this.ui.element.insertBefore(pill, this.ui.element.firstChild);
    this.ui.clearButton.classList.remove(this.options.domSelectors.hiddenControl);
  }

  /**
   * Remove tag
   * @param target
   */
  removeTag(target) {
    this.ui.element.removeChild(target);
    if (this.ui.element.querySelectorAll(this.options.domSelectors.pills).length < 1) {
      this.ui.clearButton.classList.add(this.options.domSelectors.hiddenControl);
    }
  }

  /**
   * Clear filters
   */
  clearTags() {
    this.ui.element.querySelectorAll('[data-pill]').forEach((element) => {
      this.ui.element.removeChild(element);
    });
    this.ui.clearButton.classList.add(this.options.domSelectors.hiddenControl);
  }

  /**
   * Handle Add Tag
   * @param event
   */
  onAddTag(event) {
    this.addTag(event.detail);
  }

  /**
   * Handle Remove Tag
   * @param event
   */
  onRemoveTag(event) {
    this.removeTag(event.detail.target);
  }

  /**
   * Handle Set filter tags
   */
  onSetTags(event) {
    this.clearTags();
    event.detail.forEach((tag) => {
      this.addTag(tag);
    });
  }

  /**
   * Handle Clear filter tags
   */
  onClearTags() {
    this.clearTags();
  }

  /**
   * Dispatch event filter tags
   */
  emitClear() {
    this.ui.element.dispatchEvent(new CustomEvent(FilterPills.events.clearTags));
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
