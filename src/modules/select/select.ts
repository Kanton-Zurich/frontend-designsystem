/*!
 * Select
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import namespace from '../../assets/js/helpers/namespace';

class Select extends Module {
  public isOpen: boolean;
  public hasFilter: boolean;
  public hasFilterAndButton: boolean;
  public focusOnFilter: boolean;
  public focusOnList: boolean;
  public focusOnButton: boolean;

  public itemType: string;
  public initialItems: any;
  public selections: Array<number>;
  public currentIndex: number;

  public ui: {
    element: any,
    trigger: any,
    triggerLabel: any,
    filter: any,
    list: any,
    items: any,
  };

  public options: {
    domSelectors: {
      trigger: string,
      triggerValue: string,
      filter: string,
      list: string,
      items: string,
    },
    stateClasses: {
      open: string,
      filter: string,
      filterAndButton: string,
    },
    dataSelectors: {
      itemType: string,
    }
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        trigger: '.atm-form_input--trigger button',
        triggerValue: '.atm-form_input__trigger-value',
        filter: '.mdl-select__filter input',
        list: '.atm-list',
        items: '.atm-list__item',
      },
      stateClasses: {
        open: 'mdl-select--open',
        selected: 'selected',
        filter: 'mdl-select--filter',
        filterAndButton: 'mdl-select--filter-ext',
      },
      dataSelectors: {
        itemType: 'inputtype',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.isOpen = false;
    this.hasFilter = this.ui.element.classList.contains(this.options.stateClasses.filter);
    this.hasFilterAndButton = this.ui.element.classList.contains(this.options.stateClasses.filterAndButton);
    this.focusOnFilter = false;
    this.focusOnList = false;
    this.focusOnButton = false;

    this.initialItems = this.ui.items;
    this.selections = [];

    this.ui.list.scrollTop = 0;
    this.currentIndex = 0;

    this.itemType = this.ui.list.dataset[this.options.dataSelectors.itemType];

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
      .on('blur', this.options.domSelectors.list, this.onListBlur.bind(this))
      .on('focus', this.options.domSelectors.filter, this.onFilterFocus.bind(this))
      .on('blur', this.options.domSelectors.filter, this.onFilterBlur.bind(this))
      .on('keydown', this.options.domSelectors.filter, this.onFilterKeypress.bind(this))
      .on('keydown', this.options.domSelectors.list, this.onListKeypress.bind(this))
      .on('click', this.options.domSelectors.trigger, this.onTriggerClick.bind(this));
  }

  onTriggerClick() {
    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }

    if (this.hasFilter) {
      this.ui.filter.focus();
    } else {
      this.ui.list.focus();
      // this.ui.items[0].focus();
    }
  }

  onListKeypress(event) {
    const { key } = event;
    const { target } = event;
    console.log('onItemKeypress');
    /*console.log('target: ', target);
    console.log('key: ', key);*/

    if (key === 'ArrowUp' || key === 'Up' ) {
      if (this.itemType === 'radio') {
        this.selectNextItem();
      }
      if (this.itemType === 'checkbox') {
        this.focusNextItem();
      }
    } else if (key === 'ArrowDown' || key === 'Down') {
      /*event.preventDefault();
      event.stopPropagation();*/
      if (this.itemType === 'radio') {
        this.selectPreviousItem();
      }
      if (this.itemType === 'checkbox') {
        this.focusPreviousItem();
      }
    }
    /*
    if (key === 'ArrowUp' || key === 'Up' ) {}
    if ( key === 'ArrowDown' || key === 'Down') {}
    if ( key === 'End' ) {}
    if ( key === 'Tab' ) {}
    */
  }

  selectItemByIndex(index: number = this.currentIndex) {
    const item = this.ui.items[index];
    this.selectItem(item);
    this.currentIndex = index;
  }

  selectNextItem() {
    let selectIndex = this.currentIndex + 1;
    if (selectIndex < 0) {
      selectIndex = 0;
    }
    const item = this.ui.items[selectIndex];
    this.selectItem(item);
    this.currentIndex = selectIndex;
  }

  selectPreviousItem() {
    let selectIndex = this.currentIndex - 1;
    if (selectIndex > this.ui.items.length) {
      selectIndex = 0;
    }
    const item = this.ui.items[selectIndex];
    this.selectItem(item);
    this.currentIndex = selectIndex;
  }

  selectItem(item: any) {
    console.log(item);
    let itemInput = item.querySelector('input');
    /*
    if (this.itemType === 'radio') {
      this.clearSelections();
    }
    */


    if (item.classList.contains('selected')) {
      item.classList.remove('selected');
      itemInput.checked = false;
    } else {
      item.classList.add('selected');
      itemInput.checked = true;
    }
    this.updateSelections();
  }

  clearSelections() {
    if (this.selections.length) {
      this.selections.forEach((index)=> {
        const input = this.ui.items[index].querySelector('input');
        input.checked = false;
        this.ui.items[index].classList.remove('selected');
      });

      this.selections = [];
    }
  }

  updateSelections() {
    this.ui.items = this.ui.list.querySelectorAll('.atm-list__item.selected');
  }

  focusNextItem() {

  }

  focusPreviousItem() {

  }

  onFilterKeypress(event) {
    const { key } = event;
    const { target } = event;
    console.log('onFilterKeypress');
    console.log('target: ', target);
    console.log('key: ', key);
  }

  /**
   * Open dropdown/select by adding the corresponding class
   */
  openDropdown() {
    const openClass = this.options.stateClasses.open;
    const dropDown = this.ui.element;
    dropDown.classList.add(openClass);
    this.isOpen = true;

    if(this.itemType === 'radio') {
      this.selectItemByIndex(0)
    }
  }

  /**
   * Close dropdown/select by removing the corresponding class
   */
  closeDropdown() {
    const openClass = this.options.stateClasses.open;
    const dropDown = this.ui.element;
    dropDown.classList.remove(openClass);
    this.isOpen = false;
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
