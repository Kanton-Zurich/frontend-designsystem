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

  public buttonPostfix: string;

  public selectionIndex: number;

  public initialItems: any;
  public preSelections: Array<any>;
  public selections: Array<any>;
  public selectionItems: {
    initialIndex: number,
    element: any,
  };

  public ui: {
    element: any,
    trigger: any,
    triggerValue: any,
    filter: any,
    list: any,
    items: any,
    applyButton: any,
  };

  public options: {
    domSelectors: {
      trigger: string,
      triggerValue: string,
      filter: string,
      list: string,
      items: string,
      applyButton: string,
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
        filter: '.mdl-select__filter input',
        list: '.atm-list',
        items: '.atm-list__item',
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
    this.focusOnFilter = false;
    this.focusOnList = false;
    this.focusOnButton = false;
    this.hasFilter = typeof this.ui.filter !== 'undefined';
    this.hasFilterAndButton = typeof this.ui.applyButton !== 'undefined' && this.hasFilter;
    if (this.ui.element.dataset[this.options.dataSelectors.isMultiSelect]) {
      this.isMultiSelect = true;
    }

    this.selectionIndex = 0;
    this.ui.list.scrollTop = 0;

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
      .on('focus', this.options.domSelectors.filter, this.onFilterFocus.bind(this))
      .on('blur', this.options.domSelectors.list, this.onListBlur.bind(this))
      .on('blur', this.options.domSelectors.filter, this.onFilterBlur.bind(this))
      .on('input', this.options.domSelectors.filter, this.onFilterInput.bind(this))
      .on('keydown', this.options.domSelectors.filter, this.onFilterKeypress.bind(this))
      .on('keydown', this.options.domSelectors.list, this.onListKeypress.bind(this))
      .on('click', this.options.domSelectors.items, this.onItemsClick.bind(this))
      .on('click', this.options.domSelectors.trigger, this.onTriggerClick.bind(this));
  }

  onTriggerClick() {
    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  onItemsClick(event) {
    const { target } = event;

    if (target.classList.contains('selected') && this.isMultiSelect) {
      this.deselect(target);
    } else if (!target.classList.contains('selected')) {
      this.selectItem(target);
    }
  }

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
      // event.stopPropagation();
      if (!this.isMultiSelect) {
        this.selectNextItem();
      }
      if (this.isMultiSelect) {
        this.focusNextItem();
      }
      this.scrollToOption();
    } else if (key === 'Spacebar' || key === ' ') {
      event.preventDefault();
      if (this.isMultiSelect) {
        const currentItem = this.ui.items[this.selectionIndex];
        if (currentItem.classList.contains('selected')) {
          this.deselect(currentItem);
        } else {
          this.selectItem(currentItem);
        }
      } else {
        this.closeDropdown();
      }
    } else if (key === 'Escape' || key === 'Esc') {
      this.closeDropdown();
    }
  }

  onFilterInput() {
    /* TODO
    const filterString = this.ui.filter.value;
    if (filterString != null && filterString.length > 0) {
      this.deleteFilterInput(filterString);
      this.applyFilter();
    }
    */
  }

  /**
   * TODO
   */
  applyFilter() {
    this.ui.items = this.initialItems;
    const stringPattern = this.ui.filter.value;
    const regex = new RegExp(stringPattern, 'i');
    const optionLength = this.initialItems.length;

    for (let i = 0; i < optionLength; i += 1) {
      const itemInput = this.initialItems[i].childNodes[1];
      if (regex.test(itemInput.placeholder)) {
        const elementExists = this.ui.list.querySelector(itemInput.id);
        if (!elementExists) {
          this.ui.list.appendChild(this.initialItems[i]);
        }
      } else {
        this.ui.items[i].remove();
      }
    }
  }

  onFilterKeypress(event) {
    const { key } = event;
    if (key === 'ArrowDown' || key === 'Down' || key === 'Tab') {
      event.preventDefault();
      this.ui.list.focus();
    } else if (key === 'Escape' || key === 'Esc') {
      this.closeDropdown();
    } else if (true) {
      // TODO other keys
    }
  }

  selectItemByIndex(index: number = this.selectionIndex) {
    let item: any;
    if (index <= this.initialItems.length && index >= 0) {
      item = this.ui.items[index];
    }
    // TODO else return error?
    this.selectItem(item);
    this.selectionIndex = index;
  }

  selectNextItem() {
    let selectIndex = this.selectionIndex + 1;
    if (selectIndex > this.ui.items.length - 1) {
      selectIndex = 0;
    }

    const item = this.ui.items[selectIndex];
    this.selectItem(item);
    this.selectionIndex = selectIndex;
  }

  selectPreviousItem() {
    let selectIndex = this.selectionIndex - 1;
    if (selectIndex < 0) {
      selectIndex = this.ui.items.length - 1;
    }
    const item = this.ui.items[selectIndex];
    this.selectItem(item);
    this.selectionIndex = selectIndex;
  }

  selectItem(item: any) {
    if (this.selections.length > 0 && !this.isMultiSelect) {
      this.deselect(this.selections[0].element);
    }
    const itemInput = item.querySelector('input');
    item.classList.add('selected');
    itemInput.checked = true;
    this.addSelection(item);
  }

  deselect(item: any) {
    const itemInput = item.querySelector('input');
    item.classList.remove('selected');
    itemInput.checked = false;
    this.removeSelection(item);
  }

  addSelection(item: any) {
    const index = this.getInitialIndex(item);
    this.selectionIndex = index;
    this.selections.push({
      initialIndex: index,
      element: item,
    });
    this.setButtonLabel();
  }

  removeSelection(item) {
    const  selectionIndex = this.getInitialIndex(item);
    let indexToRemove: number;

    this.selections.forEach((item, index) => {
      if (item.initialIndex === selectionIndex) {
        indexToRemove = index;
      }
    });

    this.selections.splice(indexToRemove, 1);
    this.setButtonLabel();
  }

  getInitialIndex(item: any): number {
    let index = -1;
    for (let i = 0; i < this.initialItems.length; i += 1) {
      if (this.initialItems[i] ===  item) {
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

  setButtonLabel() {
    // TODO REFACTOR
    if (!this.ui.element.classList.contains(this.options.stateClasses.touched)) {
      this.ui.element.classList.add(this.options.stateClasses.touched)
    }else if (this.selections.length === 0 &&
      this.ui.element.classList.contains(this.options.stateClasses.touched)) {
      this.ui.element.classList.remove(this.options.stateClasses.touched)
    }
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
    // this.updateAriaAttributes();
  }

  focusNextItem() {
    this.ui.items[this.selectionIndex].classList.remove('hover');
    let selectIndex = this.selectionIndex + 1;
    if (selectIndex > this.ui.items.length - 1) {
      selectIndex = 0;
    }
    const item = this.ui.items[selectIndex];
    this.focusItem(item);
    this.selectionIndex = selectIndex;
  }

  focusPreviousItem() {
    this.ui.items[this.selectionIndex].classList.remove('hover');
    let selectIndex = this.selectionIndex - 1;
    if (selectIndex < 0) {
      selectIndex = this.ui.items.length - 1;
    }
    const item = this.ui.items[selectIndex];
    this.focusItem(item);
    this.selectionIndex = selectIndex;
  }

  focusItem(item:any) {
    item.classList.add('hover');
  }

  /**
   * Open dropdown/select by adding the corresponding class
   */
  openDropdown() {
    const openClass = this.options.stateClasses.open;
    const dropDown = this.ui.element;
    dropDown.classList.add(openClass);
    this.isOpen = true;

    if (!this.isMultiSelect) {
      this.selectItemByIndex(this.selectionIndex);
    }
    this.focusDropdown();
  }

  /**
   * Close dropdown/select by removing the corresponding class
   */
  closeDropdown() {
    const openClass = this.options.stateClasses.open;
    const dropDown = this.ui.element;
    dropDown.classList.remove(openClass);
    this.isOpen = false;
    this.blurDropdown();
  }

  focusDropdown() {
    if (this.hasFilter) {
      this.ui.filter.focus();
    } else {
      this.ui.list.focus();
    }
  }

  handlePreselection() {
    this.preSelections.forEach((item) => {
      this.addSelection(item.parentElement);
    });
    if (!this.isMultiSelect) {

    }
    this.selectionIndex = this.selections[0].initialIndex;
    this.scrollToOption();
  }

  blurDropdown() {
    this.ui.trigger.focus();
    this.ui.items[this.selectionIndex].classList.remove('hover');
  }

  onFilterFocus() {
    this.focusOnFilter = true;
  }

  onFilterBlur() {
    this.focusOnFilter = false;
  }

  onListFocus() {
    this.focusOnList = true;
  }

  onListBlur() {
    this.focusOnList = false;
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
