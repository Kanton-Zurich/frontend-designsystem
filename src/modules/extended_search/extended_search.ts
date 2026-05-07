/*!
 * DownloadList
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import FilterPills from '../filter_pills/filter_pills';

class ExtendedSearch extends Module {
  public options: {
    domSelectors: { [element: string]: string };
    stateClasses: Object;
    filterPillsThreshold: number;
  };

  private filterTags: Set<string>;

  public ui: {
    element: any;
    triggerButton: HTMLButtonElement;
    dialogForm: HTMLFormElement;
    dialog: HTMLDivElement;
    pills: HTMLDivElement;
    pillsClearButton: HTMLButtonElement;
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        triggerButton: '.mdl-extended_search__trigger',
        dialogForm: '.mdl-dialog__form',
        dialog: '.mdl-dialog',
        pills: '.mdl-filter-pills',
        pillsClearButton: '.mdl-filter-pills button[data-clear]',
      },
      filterPillsThreshold: 5,
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.filterTags = new Set<string>();
    this.initEventListeners();
  }

  initEventListeners() {
    this.ui.triggerButton.addEventListener('click', () => {
      this.updateDialogSelection();
      this.clearInput(false);
      this.ui.dialog.dispatchEvent(new CustomEvent('Dialog.open'));
    });

    // Listen to set selection from outside
    this.ui.element.addEventListener(ExtendedSearch.events.setFilter, (event: CustomEvent) => {
      this.filterTags = new Set(event.detail);
      this.updateDialogSelection();
      this.updatePills();
    });

    // Listen to remove event from filter pills
    this.ui.pills.addEventListener(FilterPills.events.removeTag, (event: CustomEvent) => {
      const value = event.detail.target.getAttribute('data-pill');
      if (value.startsWith('filter>')) {
        const filterValues = value.split('>')[1];
        this.filterTags = new Set([...this.filterTags].filter((e) => e !== filterValues));
        this.updateDialogSelection();
        this.updatePills();
        this.emitFilterChanged();
      }
    });

    // Listen to clear event from filter pills
    this.ui.pills.addEventListener(FilterPills.events.clearTags, () => {
      this.resetFilters();
      this.emitFilterChanged();
    });

    // Listen to dialog form submission
    if (this.ui.dialogForm) {
      this.ui.dialogForm.addEventListener('submit', (event) => {
        event.preventDefault();
        this.setFiltersFromDialog();
        this.updatePills();
        this.ui.dialog.dispatchEvent(new CustomEvent('Dialog.close'));
        this.emitFilterChanged();
      });
    }
  }

  static get events() {
    return {
      setFilter: 'ExtendedSearch.setFilter',
      filterChanged: 'ExtendedSearch.filterChanged',
    };
  }

  /**
   * Dispatch a filterChanged custom event
   */
  emitFilterChanged() {
    this.ui.element.dispatchEvent(
      new CustomEvent(ExtendedSearch.events.filterChanged, { detail: this.filterTags })
    );
  }

  /**
   * Update checkboxes in advanced search dialog
   */
  updateDialogSelection() {
    if (!this.ui.dialogForm) return;
    [...this.ui.dialogForm.querySelectorAll('.atm-checkbox input')].forEach(
      (checkbox: HTMLInputElement) => {
        checkbox.checked = false;
        [...this.filterTags].forEach((filterTag) => {
          if (filterTag === checkbox.value) {
            checkbox.checked = true;
          }
        });
      }
    );
  }

  /**
   * Check which checkboxes are selected in advanced search dialog and set in filterTags
   */
  setFiltersFromDialog() {
    const selectedValues = [...this.ui.dialogForm.querySelectorAll('input[type="checkbox"]')]
      .filter((checkbox: HTMLInputElement) => checkbox.checked)
      .map((checkbox: HTMLInputElement) => checkbox.value);
    this.filterTags = new Set(selectedValues);
  }

  /**
   * Update pills to correspond with filter settings
   */
  updatePills() {
    const tags = [];
    // add pills for selected filters
    this.filterTags.forEach((filterValue) => {
      const inputCheckbox: HTMLInputElement = this.ui.dialogForm.querySelector(
        `.atm-checkbox input[value="${filterValue}"]`
      );
      if (inputCheckbox) {
        const tag = {
          text: inputCheckbox.parentNode.querySelector('label').childNodes[0].textContent,
          value: `filter>${filterValue}`,
          disabled: inputCheckbox.disabled,
        };
        tags.push(tag);
      }
    });

    const eventData = {
      detail: tags,
    };

    // update pills module
    this.ui.pills.dispatchEvent(new CustomEvent(FilterPills.events.setTags, eventData));

    // visual indicator - show cyan dot when there are any active filters
    this.ui.element.classList.toggle(
      'mdl-extended_search--has-filters',
      [...this.filterTags].length > 0
    );

    // clear button visibility
    this.ui.pillsClearButton.classList.toggle(
      'hidden',
      [...this.filterTags].length < this.options.filterPillsThreshold
    );
  }

  /**
   * Reset filters
   */
  resetFilters() {
    this.filterTags = new Set<string>();
    this.updatePills();
    this.updateDialogSelection();
  }

  /**
   * Clear search word input
   */
  clearInput(focusInput = true) {
    if (focusInput) {
      this.updateFlyingFocus(0);
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

export default ExtendedSearch;
