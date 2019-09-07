/*!
 * Select
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import { debounce } from 'lodash';

class Select extends Module {
  public isOpen: boolean;
  public isMultiSelect: boolean;
  public hasFilter: boolean;
  public hasFilterAndButton: boolean;
  public isFirefox: boolean;
  public buttonPostfix: string;
  public selectionIndex: number;
  public lastHoverIndex: number;
  public firefoxDelay: number;
  public dropdownDelay: number;
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
    items: HTMLUListElement[],
    inputItems: HTMLInputElement[],
    applyButton: any,
    clearButton: any,
    phoneInput: any,
  };

  public options: {
    inputDelay: number,
    domSelectors: any,
    stateClasses: any,
    dataSelectors: any,
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      inputDelay: 250,
      domSelectors: {
        trigger: '.atm-form_input--trigger button',
        triggerValue: '.atm-form_input__trigger-value',
        triggerLabel: '.atm-form_input__trigger-label',
        dropdown: '.mdl-select__options',
        filter: '.mdl-select__filter input',
        phoneInput: '.atm-form_input--trigger-phone input',
        list: '.atm-list',
        items: '.atm-list__item',
        inputItems: '.atm-list__item input',
        clearButton: '.atm-form_input__functionality',
        applyButton: '.mdl-select__apply button',
      },
      stateClasses: {
        open: 'mdl-select--open',
        selected: 'mdl-select--selected',
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
    this.dropdownDelay = 400;

    if (this.isMultiSelect) {
      this.buttonPostfix = this.ui.element.dataset[this.options.dataSelectors.selectPostfix];
    }

    // Array of selection indicies
    this.selections = [];

    // Handle pre-selections
    /* this.preSelections = this.ui.list.querySelectorAll('input[checked]');
		 if (this.preSelections.length > 0) {
			 this.handlePreselection();
		 }*/

    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      valueChanged: 'Select.valueChanged',
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate
    // ------------------------------
    // On click filter input
      .on('mouseup', this.options.domSelectors.filter, (event) => {
        event.stopPropagation();
      })
      // ----------------------------
      // On Click dropdown item
      .on('mouseup', this.options.domSelectors.inputItems, (event) => {
        if (!this.isMultiSelect) {
          if (this.isFirefox) {
            setTimeout((() => {
              this.closeDropdown();
            }), this.firefoxDelay);
          } else {
            this.closeDropdown();
          }
        }
        event.stopPropagation();
      })
      // ------------------------------
      // On Key press dropdown item
      .on('keydown', this.options.domSelectors.inputItems, (event) => {
        if (event.key === 'Tab') {
          if (!event.shiftKey) {
            this.closeDropdown(true);
          }
        }
      })
      // ------------------------------
      // On Key press Dropdown dropdown content element
      .on('keydown', this.options.domSelectors.dropdown, (event) => {
        if (event.key === 'Esc' || event.key === 'Escape' ||
          event.key === 'Enter' || event.key === ' '
        ) {
          if (!this.isMultiSelect) {
            this.closeDropdown();
          }
        }
      })
      // ------------------------------
      // On Key press Dropdown main element
      .on('keydown', this.options.domSelectors.trigger, (event) => {
        if (event.key === 'Tab') {
          if (event.shiftKey) {
            this.closeDropdown(true);
          }
        }
      })
      // On Mouseup dropdown main element -- prevent focus lost
      .on('mouseup', this.options.domSelectors.trigger, (event) => {
        event.stopPropagation();
      })
      // ------------------------------
      // On Click Dropdown main element
      .on('click', this.options.domSelectors.trigger, (event) => {
        if (this.isOpen) {
          this.closeDropdown();
        } else {
          this.openDropdown();
        }
        event.stopPropagation();
      })
      // ------------------------------
      // On value of select changed
      .on(Select.events.valueChanged, this.onValueChanged.bind(this));
    // ----------------------------
    // watch select items for status change
    this.ui.inputItems.forEach((item, index) => {

        item.addEventListener('change', (evt) => {
          if (!this.isMultiSelect) {
            this.ui.items.forEach((li) => {
              li.classList.remove('selected');
            });
            this.ui.items[index].classList.add('selected');
            this.emitValueChanged((<HTMLInputElement>evt.target).value);
          } else {
            if (item.checked) {
              this.ui.items[index].classList.add('selected');
            } else {
              this.ui.items[index].classList.remove('selected');
            }
            const values = [];
            this.ui.inputItems.forEach((inputItem) => {
              if (inputItem.checked) {
                values.push(inputItem.value);
              }
            });
            this.emitValueChanged(values);
          }
        });
    });

    // -------------------------------
    // Observe inputs and update values
    if (this.ui.filter) {
      this.watch(this.ui.filter, 'value', debounce((key, before, after) => { // eslint-disable-line
        this.ui.items.forEach((li) => {
          const regex = new RegExp(after, 'i');
          if (regex.test(li.querySelector('input').placeholder)) {
            li.classList.remove('hidden');
          } else {
            li.classList.add('hidden');
          }
        });
      }, this.options.inputDelay));
    }
  }

  /**
   * Emit that value has changed
   * @param value
   */
  emitValueChanged(value) {
    this.ui.element.dispatchEvent(new CustomEvent(Select.events.valueChanged, {detail: value}));
  }

  /**
   * Handle event on value changed
   * @param event
   */
  onValueChanged(event) {
    const value = event.detail;
    let triggerLabelText = '';
    if (this.isMultiSelect) {
      triggerLabelText = `${value.length} ${this.buttonPostfix}`;
    } else {
      if (this.ui.phoneInput) {
        triggerLabelText = value;
      } else {
        triggerLabelText = this.ui.list.querySelector(`[value="${value}"`).placeholder;
      }
    }
    this.ui.triggerValue.innerText = triggerLabelText;
    this.ui.element.classList.remove(this.options.stateClasses.selected);
    if (triggerLabelText !== '') {
      this.ui.element.classList.add(this.options.stateClasses.selected);
    }
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
      //  this.selectItemByIndex(this.selectionIndex);
    }

    this.ui.trigger.setAttribute('aria-expanded', 'true');
    this.ui.dropdown.setAttribute('aria-hidden', 'false');

    if (this.ui.filter) {
      this.ui.filter.focus();
    } else {
      this.ui.element.querySelector(`${this.options.domSelectors.inputItems}:checked`).focus();
    }
    // click out of element loose focus and close
    this.onFocusOut = this.onFocusOut.bind(this);
    window.addEventListener('mouseup', this.onFocusOut);
  }

  /**
   * Close dropdown/select
   */
  closeDropdown(focusLost = false) {
    window.removeEventListener('mouseup', this.onFocusOut);
    const openClass = this.options.stateClasses.open;
    const dropDown = this.ui.element;
    dropDown.classList.remove(openClass);
    this.isOpen = false;
    this.ui.trigger.setAttribute('aria-expanded', 'false');
    this.ui.dropdown.setAttribute('aria-hidden', 'true');
    if (!focusLost) {
      setTimeout(() => {
        this.ui.trigger.focus();
      }, this.dropdownDelay);
    }
  }

  onFocusOut() {
    this.closeDropdown(true);
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
