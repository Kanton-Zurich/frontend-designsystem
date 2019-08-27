/*!
 * Select
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class Select extends Module {
  public isOpen: boolean;
  public isMultiSelect: boolean;
  public hasFilter: boolean;
  public hasFilterAndButton: boolean;
  public focusOnFilter: boolean;
  public focusOnList: boolean;
  public focusOnButton: boolean;
  public focusOnClearButton: boolean;
  public isFirefox: boolean;
  public isKeyControlled: boolean;

  public buttonPostfix: string;

  public selectionIndex: number;
  public lastHoverIndex: number;
  public firefoxDelay: number;
  public listBlurDelay: number;

  public initialItems: any;
  public preSelections: Array<any>;
  public selections: Array<any>;

  public ui: {
    element: any,
    trigger: any,
    triggerValue: any,
    triggerLabel: any,
    dropdown: any,
    filter: any,
    list: any,
    items: any,
    applyButton: any,
    clearButton: any,
    phoneInput: any,
  };

  public options: {
    domSelectors: {
      trigger: string,
      triggerValue: string,
      triggerLabel: string,
      dropdown: string,
      filter: string,
      list: string,
      items: string,
      applyButton: string,
      clearButton: string,
      phoneInput: string,
    },
    stateClasses: {
      open: string,
      selected: string,
      touched: string,
    },
    dataSelectors: {
      itemType: string,
      isMultiSelect: string,
      selectPostfix: string,
    }
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        trigger: '.atm-form_input--trigger button',
        triggerValue: '.atm-form_input__trigger-value',
        triggerLabel: '.atm-form_input__trigger-label',
        dropdown: '.mdl-select__options',
        filter: '.mdl-select__filter input',
        phoneInput: '.atm-form_input--trigger-phone input',
        list: '.atm-list',
        items: '.atm-list__item',
        clearButton: '.atm-form_input__functionality',
        applyButton: '.mdl-select__apply button',
      },
      stateClasses: {
        open: 'mdl-select--open',
        selected: 'selected',
        touched: 'mdl-select--selected',
      },
      dataSelectors: {
        itemType: 'inputtype',
        isMultiSelect: 'multiple',
        selectPostfix: 'multiselectpostfix',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.isOpen = false;
    this.isMultiSelect = false;
    this.isKeyControlled = false;
    this.focusOnFilter = false;
    this.focusOnList = false;
    this.focusOnButton = false;
    this.focusOnClearButton = false;
    this.isFirefox = navigator.userAgent.search('Firefox') > -1;
    this.hasFilter = typeof this.ui.filter !== 'undefined';
    this.hasFilterAndButton = typeof this.ui.applyButton !== 'undefined' && this.hasFilter;
    if (this.ui.element.dataset[this.options.dataSelectors.isMultiSelect]) {
      this.isMultiSelect = true;
    }

    this.selectionIndex = 0;
    this.lastHoverIndex = 0;
    this.ui.list.scrollTop = 0;
    this.firefoxDelay = 180;
    this.listBlurDelay = 300;

    if (this.isMultiSelect) {
      this.buttonPostfix = this.ui.element.dataset[this.options.dataSelectors.selectPostfix];
    }

    this.initialItems = this.ui.items;
    // Array of selection indicies
    this.selections = [];

    // Handle pre-selections
    this.preSelections = this.ui.list.querySelectorAll('input:checked');
    if (this.preSelections.length > 0) {
      this.handlePreselection();
    }

    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      // eventname: `eventname.${ Select.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate
      .on('focus', this.options.domSelectors.list, this.onListFocus.bind(this))
      .on('focus', this.options.domSelectors.applyButton, this.onApplyButtonFocus.bind(this))
      .on('focus', this.options.domSelectors.clearButton, this.onClearButtonFocus.bind(this))
      .on('focus', this.options.domSelectors.filter, this.onFilterFocus.bind(this))
      .on('blur', this.options.domSelectors.list, this.onListBlur.bind(this))
      .on('blur', this.options.domSelectors.applyButton, this.onApplyButtonBlur.bind(this))
      .on('blur', this.options.domSelectors.clearButton, this.onClearButtonBlur.bind(this))
      .on('blur', this.options.domSelectors.filter, this.onFilterBlur.bind(this))
      .on('input', this.options.domSelectors.filter, this.onFilterInput.bind(this))
      .on('keydown', this.options.domSelectors.filter, this.onFilterKeypress.bind(this))
      .on('keydown', this.options.domSelectors.list, this.onListKeypress.bind(this))
      .on('keydown', this.options.domSelectors.applyButton, this.onButtonKeydown.bind(this))
      .on('keydown', this.options.domSelectors.trigger, this.onTriggerKeydown.bind(this))
      .on('click', this.options.domSelectors.applyButton, this.onButtonClick.bind(this))
      .on('click', this.options.domSelectors.items, this.onItemsClick.bind(this))
      .on('click', this.options.domSelectors.clearButton, this.onClearButtonClick.bind(this))
      .on('click', this.options.domSelectors.trigger, this.onTriggerClick.bind(this));
  }

  /**
   * Trigger action starte by any key set the key controlled flag
   * (for the inital focus on list or filter)
   */
  onTriggerKeydown() {
    this.isKeyControlled = true;
  }

  /**
   * On Trigger click callback. Responsible for opening/closing the dropdown.
   */
  onTriggerClick() {
    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  /**
   * Click on clear filter button callback. Deletes the input value and apply filter
   */
  onClearButtonClick() {
    this.ui.filter.focus();
    this.ui.filter.value = '';
    this.applyFilter();
  }

  /**
   * Click on list item callback. Responsible for de-/selecting items
   * and close dropdown on single selection
   *
   * @param event
   */
  onItemsClick(event) {
    const { target } = event;

    if (target.classList.contains('selected') && this.isMultiSelect) {
      this.deselectItem(target);
    } else if (!target.classList.contains('selected')) {
      this.selectItem(target);
      if (!this.isMultiSelect) {
        if (this.isFirefox) {
          setTimeout((() => {
            this.closeDropdown();
          }), this.firefoxDelay);
        } else {
          this.closeDropdown();
        }
      }
    }
  }

  /**
   * Apply button click callback. Simply closes the dropdown.
   */
  onButtonClick() {
    this.closeDropdown();
  }

  /**
   * Apply button keydown callback. Just catch the escape key on the apply button
   * @param event
   */
  onButtonKeydown(event) {
    const { key } = event;
    if (key === 'Escape' || key === 'Esc') {
      this.closeDropdown();
    }
  }

  /**
   * On list keypressed callback. Responsible to execute correspingly to the key.
   * @param event
   */
  onListKeypress(event) {
    const { key } = event;

    if (key === 'ArrowUp' || key === 'Up') {
      event.preventDefault();

      if (!this.isMultiSelect) {
        this.selectPreviousItem();
      }
      if (this.isMultiSelect) {
        this.focusPreviousItem();
      }
      this.scrollToOption();
    } else if (key === 'ArrowDown' || key === 'Down') {
      event.preventDefault();
      if (!this.isMultiSelect) {
        this.selectNextItem();
      } else {
        this.focusNextItem();
      }
      this.scrollToOption();
    } else if (key === 'Spacebar' || key === ' ' || key === 'Enter') {
      event.preventDefault();
      if (this.isMultiSelect) {
        const currentItem = this.ui.items[this.selectionIndex];
        if (currentItem.classList.contains('selected')) {
          this.deselectItem(currentItem);
        } else {
          this.selectItem(currentItem);
        }
      } else if (this.isFirefox) {
        setTimeout((() => {
          this.closeDropdown();
        }), this.firefoxDelay);
      } else {
        this.closeDropdown();
      }
    } else if (key === 'Escape' || key === 'Esc') {
      this.closeDropdown();
    } else if (key === 'End') {
      event.preventDefault();
      this.getLastVisibleItemIndex();
      if (!this.isMultiSelect) {
        // Handle Home or End key pressed on filtered list
        this.selectItemByIndex(this.getLastVisibleItemIndex());
      } else {
        this.focusItemByIndex(this.getLastVisibleItemIndex());
      }
      this.scrollToOption();
    } else if (key === 'Home') {
      event.preventDefault();

      if (!this.isMultiSelect) {
        // Handle Home or End key pressed on filtered list
        this.selectItemByIndex(this.getFirstVisibleItemIndex());
      } else {
        this.focusItemByIndex(this.getFirstVisibleItemIndex());
      }
      this.scrollToOption();
    }
  }

  /**
   * On filter input callback.
   */
  onFilterInput() {
    this.applyFilter();
  }

  /**
   * Applies the string value from the filter input as regex on all items
   */
  applyFilter() {
    const stringPattern = this.ui.filter.value;
    if (stringPattern.length > 0) {
      this.ui.filter.classList.add('dirty');
    } else {
      this.ui.filter.classList.remove('dirty');
    }
    const regex = new RegExp(stringPattern, 'i');
    const optionLength = this.ui.items.length;

    for (let i = 0; i < optionLength; i += 1) {
      const itemInput = this.ui.items[i].querySelector('input');
      if (regex.test(itemInput.placeholder)) {
        this.ui.items[i].style.display = 'flex';
        this.ui.items[i].removeAttribute('tabindex');
      } else {
        this.ui.items[i].style.display = 'none';
        this.ui.items[i].setAttribute('tabindex', '-1');
      }
    }
  }

  /**
   * On filter keypressed callback. Listen only the relevant navigation keys.
   * @param event
   */
  onFilterKeypress(event) {
    const { key } = event;
    if (key === 'ArrowDown' || key === 'Down' || key === 'End') {
      event.preventDefault();
      this.ui.list.focus();
    } else if (key === 'Escape' || key === 'Esc') {
      this.closeDropdown();
    } else if (key === 'Home') {
      event.preventDefault();
      if (this.hasFilterAndButton) {
        this.ui.applyButton.focus();
      } else {
        this.ui.list.focus();
      }
    }
  }

  /**
   * Iterate over the item array and search for the first item without an tabindex
   * @return {number}
   */
  getFirstVisibleItemIndex(): number {
    const listLength = this.ui.items.length - 1;
    const returnIndex = -1;
    for (let i = 0; i < listLength; i += 1) {
      if (!this.ui.items[i].getAttribute('tabindex')) {
        return i;
      }
    }
    return returnIndex;
  }

  /**
   * Iterate over the item array and search for the last item without an tabindex
   * @return {number}
   */
  getLastVisibleItemIndex(): number {
    const listLength = this.ui.items.length - 1;
    const returnIndex = -1;
    for (let i = listLength; i > 0; i -= 1) {
      if (!this.ui.items[i].getAttribute('tabindex')) {
        return i;
      }
    }
    return returnIndex;
  }

  /**
   * Select an item based on the given index or the current selectionIndex
   * @param {number} index
   */
  selectItemByIndex(index: number = this.selectionIndex) {
    let item: any;
    if (index <= this.initialItems.length && index >= 0) {
      item = this.ui.items[index];
    } else {
      // Return error?
      return;
    }

    this.selectionIndex = index;

    this.selectItem(item);
  }

  /**
   * Selects the next item based on the current selectionIndex
   * @return {any}
   */
  selectNextItem(): any {
    this.selectionIndex = this.getNextIndex();
    const item = this.ui.items[this.selectionIndex];
    // Handle filtered list
    if (item.getAttribute('tabindex')) {
      return this.selectNextItem();
    }
    return this.selectItem(item);
  }

  /**
   * Selects the previous item based on the current selectionIndex
   * @return {any}
   */
  selectPreviousItem() {
    this.selectionIndex = this.getPreviousIndex();
    const item = this.ui.items[this.selectionIndex];
    // Handle filtered list
    if (item.getAttribute('tabindex')) {
      return this.selectPreviousItem();
    }
    return this.selectItem(item);
  }

  /**
   * Select the given item
   * @param item
   */
  selectItem(item: any) {
    if (this.selections.length > 0 && !this.isMultiSelect) {
      this.deselectItem(this.selections[0].element);
    }
    const itemInput = item.querySelector('input');
    item.classList.add('selected');
    itemInput.checked = true;
    this.addSelection(item);
  }

  /**
   * Deselect the given item
   * @param item
   */
  deselectItem(item: any) {
    const itemInput = item.querySelector('input');
    item.classList.remove('selected');
    itemInput.checked = false;
    this.removeSelection(item);
  }

  /**
   * Set the focus on the item with the given index;
   * @param {number} index
   */
  focusItemByIndex(index: number = this.selectionIndex) {
    const item = this.ui.items[index];
    this.selectionIndex = index;
    this.focusItem(item);
  }

  /**
   * Focus the next item based on the current selectionIndex
   * @return {any}
   */
  focusNextItem() {
    this.selectionIndex = this.getNextIndex();
    const item = this.ui.items[this.selectionIndex];
    // Handle filtered list
    if (item.getAttribute('tabindex')) {
      return this.focusNextItem();
    }
    return this.focusItem(item);
  }

  /**
   * Focus the previous item based on the current selectionIndex
   * @return {any}
   */
  focusPreviousItem() {
    this.selectionIndex = this.getPreviousIndex();
    const item = this.ui.items[this.selectionIndex];
    // Handle filtered list
    if (item.getAttribute('tabindex')) {
      return this.focusPreviousItem();
    }
    return this.focusItem(item);
  }

  /**
   * Focus the given item
   * @param item
   */
  focusItem(item: any) {
    this.ui.items[this.lastHoverIndex].classList.remove('hover');
    item.classList.add('hover');
    this.lastHoverIndex = this.selectionIndex;
  }

  /**
   * Adds the given item to the selections array
   * @param item
   */
  addSelection(item: any) {
    const index = this.getIndexForItem(item);
    this.selectionIndex = index;
    this.selections.push({
      initialIndex: index,
      element: item,
    });
    this.setButtonLabel();
  }

  /**
   * Removes the given item from the selections array
   * @param selectedItem
   */
  removeSelection(selectedItem: any) {
    const selectionIndex = this.getIndexForItem(selectedItem);
    let indexToRemove: number;

    this.selections.forEach((item, index) => {
      if (item.initialIndex === selectionIndex) {
        indexToRemove = index;
      }
    });

    this.selections.splice(indexToRemove, 1);
    this.setButtonLabel();
  }

  /**
   * Calculate and returns the previous index position from the current selectionIndex
   * @return {number}
   */
  getPreviousIndex(): number {
    let selectIndex = this.selectionIndex - 1;
    if (selectIndex < 0) {
      selectIndex = this.ui.items.length - 1;
    }
    return selectIndex;
  }

  /**
   * Calculate and returns the next index position from the current selectionIndex
   * @return {number}
   */
  getNextIndex(): number {
    let selectIndex = this.selectionIndex + 1;
    if (selectIndex > this.ui.items.length - 1) {
      selectIndex = 0;
    }
    return selectIndex;
  }

  /**
   * Get the index of the given item. Returns index if its found else -1.
   * @param item
   * @return {number}
   */
  getIndexForItem(item: any): number {
    let index = -1;
    for (let i = 0; i < this.ui.items.length; i += 1) {
      if (this.ui.items[i] === item) {
        index = i;
      }
    }
    return index;
  }

  /**
   * Scroll to the option of the current focusIndex
   */
  scrollToOption() {
    const itemHeight = this.ui.items[this.selectionIndex].getBoundingClientRect().height;
    this.ui.list.scrollTop = itemHeight * this.selectionIndex;
  }

  /**
   * Updates the module state class for dirty/touched
   */
  updateModuleState() {
    const module = this.ui.element;
    const stateClass = this.options.stateClasses.touched;
    if (!module.classList.contains(stateClass)) {
      module.classList.add(stateClass);
    } else if (this.selections.length === 0 && module.classList.contains(stateClass)) {
      module.classList.remove(stateClass);
    }
  }

  /**
   * Set the button/trigger lable correspondingly to single- or multiselect
   */
  setButtonLabel() {
    this.updateModuleState();

    let triggerLabelText = '';

    if (this.selections.length > 0) {
      if (this.isMultiSelect) {
        triggerLabelText = `${this.selections.length} ${this.buttonPostfix}`;
      } else {
        const selectedInput = this.selections[0].element.querySelector('input');
        if (this.hasFilter) {
          triggerLabelText = selectedInput.value;
        } else {
          triggerLabelText = selectedInput.placeholder;
        }
      }
    }
    this.ui.triggerValue.innerText = triggerLabelText;
    this.updateAriaAttributes();
  }

  /**
   * Handles the rest of the aria attributes on the list(aria-activedescendant)
   * and items(aria-selected)
   */
  updateAriaAttributes() {
    // Reset aria-selected by applying false to all option
    for (let i = 0; i < this.ui.items.length; i += 1) {
      this.setAriaSelectedOnOption(this.ui.items[i], 'false');
    }
    // Set aria-selected
    this.selections.forEach((item) => {
      this.setAriaSelectedOnOption(item.element, 'true');
    });
    this.updateAriaActiveDescendats();
  }

  /**
   * Set explicit the aria-selected on the given element to the given value
   * @param element
   * @param {string} value
   */
  setAriaSelectedOnOption(element: any, value: string) {
    element.setAttribute('aria-selected', value);
  }

  /**
   * Sets explicit the aria-activedescendants based on the selectedElements
   */
  updateAriaActiveDescendats() {
    this.ui.list.setAttribute('aria-activedescendant', '');
    let idStrings = '';

    if (this.selections.length > 0) {
      for (let i = 0; i < this.selections.length; i += 1) {
        idStrings += `${this.selections[i].element.id} `;
      }
    }
    this.ui.list.setAttribute('aria-activedescendant', idStrings);
  }


  /**
   * Open dropdown/select
   */
  openDropdown() {
    const openClass = this.options.stateClasses.open;
    const dropDown = this.ui.element;
    dropDown.classList.add(openClass);
    this.isOpen = true;

    if (!this.isMultiSelect) {
      this.selectItemByIndex(this.selectionIndex);
    }

    this.ui.list.setAttribute('tabindex', '0');
    this.ui.trigger.setAttribute('aria-expanded', 'true');
    this.ui.dropdown.setAttribute('aria-hidden', 'false');

    if (this.isKeyControlled) {
      this.focusDropdown();
    }
  }

  /**
   * Close dropdown/select
   */
  closeDropdown() {
    const openClass = this.options.stateClasses.open;
    const dropDown = this.ui.element;
    dropDown.classList.remove(openClass);
    this.isOpen = false;

    this.ui.list.setAttribute('tabindex', '-1');
    this.ui.trigger.setAttribute('aria-expanded', 'false');
    this.ui.dropdown.setAttribute('aria-hidden', 'true');

    this.blurDropdown();
  }

  /**
   * Focus the list or the filter button depending on the mode
   */
  focusDropdown() {
    if (this.hasFilter) {
      this.ui.filter.focus();
    } else {
      this.ui.list.focus();
    }
  }

  /**
   * Handle preselection
   */
  handlePreselection() {
    this.preSelections.forEach((item) => {
      this.addSelection(item.parentElement);
    });
    if (!this.isMultiSelect) {
      // Check if needed
    }
    this.selectionIndex = this.selections[0].initialIndex;
    this.scrollToOption();
  }

  /**
   * Handle the correct focus after closing the dropdown
   */
  blurDropdown() {
    this.ui.items[this.selectionIndex].classList.remove('hover');
    if (this.ui.phoneInput) {
      this.ui.phoneInput.focus();
    } else {
      this.ui.trigger.focus();
    }
    this.isKeyControlled = false;
  }

  /**
   * On filter focus callback. Sets the corresping boolean flag.
   */
  onFilterFocus() {
    this.focusOnFilter = true;
  }

  /**
   * On filter blur callback. Sets the corresping boolean flag.
   */
  onFilterBlur() {
    this.focusOnFilter = false;
    this.timeOutClose();
  }

  /**
   * On list focus callback. Sets the corresping boolean flag.
   */
  onListFocus() {
    this.focusOnList = true;
  }

  /**
   * On list blur callback. Sets the corresping boolean flag
   * and closes he dropdown if nothing relevat is focused.
   */
  onListBlur() {
    this.focusOnList = false;
    this.timeOutClose();
  }

  /**
   * On apply button focus callback. Sets the corresping boolean flag.
   */
  onApplyButtonFocus() {
    this.focusOnButton = true;
  }

  /**
   * On apply button blur callback. Sets the corresping boolean flag.
   */
  onApplyButtonBlur() {
    this.focusOnButton = false;
    this.timeOutClose();
  }

  /**
   * On clear button focus callback. Sets the corresping boolean flag.
   */
  onClearButtonFocus() {
    this.focusOnClearButton = true;
  }

  /**
   * On clear button blur callback. Sets the corresping boolean flag.
   */
  onClearButtonBlur() {
    this.focusOnClearButton = false;
  }

  /**
   * Close the dropdown after the delay if no relevant element is focused.
   */
  timeOutClose() {
    setTimeout((() => {
      if (!this.focusOnButton && !this.focusOnFilter
        && !this.focusOnList && !this.focusOnClearButton) {
        this.closeDropdown();
      }
    }), this.listBlurDelay);
  }


  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default Select;
