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
  public usedAnchors: boolean;
  public isFirefox: boolean;
  public buttonPostfix: string;
  public selections: Array<any>;

  public ui: {
    element: any,
    trigger: any,
    triggerValue: any,
    triggerLabel: any,
    dropdown: any,
    filter: any,
    list: any,
    items: HTMLLIElement[],
    inputItems: HTMLInputElement[],
    applyButton: any,
    filterClearButton: any,
    phoneInput: any,
  };

  public options: {
    inputDelay: number,
    firefoxDelay: number,
    dropdownDelay: number,
    domSelectors: any,
    stateClasses: any,
    dataSelectors: any,
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      inputDelay: 250,
      firefoxDelay: 180,
      dropdownDelay: 400,
      domSelectors: {
        trigger: '.atm-form_input--trigger button',
        triggerValue: '.atm-form_input__trigger-value',
        triggerLabel: '.atm-form_input__trigger-label',
        dropdown: '.mdl-select__options',
        filter: '.mdl-select__filter input',
        filterClearButton: '.mdl-select__filter .atm-form_input__functionality',
        phoneInput: '.atm-form_input--trigger-phone input',
        list: '.atm-list',
        items: '.atm-list__item',
        inputItems: '.atm-list__item input',
        visibleInputItems: '.atm-list__item:not(.hidden) input',
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
    this.usedAnchors = false;
    this.isFirefox = navigator.userAgent.search('Firefox') > -1;
    this.hasFilter = typeof this.ui.filter !== 'undefined';
    if (this.ui.element.dataset[this.options.dataSelectors.isMultiSelect]) {
      this.isMultiSelect = true;
    }

    if (this.ui.list.querySelector('a')) {
      this.usedAnchors = true;
    }

    this.ui.list.scrollTop = 0;


    if (this.isMultiSelect) {
      this.buttonPostfix = this.ui.element.dataset[this.options.dataSelectors.selectPostfix];
    }

    // Array of selection indicies
    this.selections = [];

    // Input Items should always be a Node List
    this.initUi(['inputItems', 'items']);
    this.initEventListeners();

    // preselection
    const selectedItems = [];
    this.ui.inputItems.forEach((item) => {
      if (item.checked) {
        selectedItems.push(item.value);
      }
    });

    if (selectedItems.length > 0) {
      if (this.isMultiSelect) {
        this.emitValueChanged(selectedItems);
      } else if (selectedItems[0].length > 0) {
        this.emitValueChanged(selectedItems[0]);
      }
    }
  }

  static get events() {
    return {
      valueChanged: 'Select.valueChanged',
      setValue: 'Select.setValue',
      open: 'Select.open',
      close: 'Select.close',
      disable: 'Select.disable',
      setFilter: 'Select.setFilter',
      clear: 'Select.clear',
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate
    // ------------------------------------------------------------
    // On Click dropdown item
      .on('mouseup', this.options.domSelectors.inputItems, (event) => {
        if (!this.isMultiSelect) {
          if (this.isFirefox) {
            setTimeout((() => {
              this.closeDropdown();
            }), this.options.firefoxDelay);
          } else {
            this.closeDropdown();
          }

          if (this.usedAnchors) {
            event.target.parentElement.click();
          }
        }
      })
      // ------------------------------------------------------------
      // On Key press dropdown item
      .on('keydown', this.options.domSelectors.inputItems, (event) => {
        if (event.key === 'Tab') {
          if (!event.shiftKey) {
            if (!this.ui.applyButton) {
              this.closeDropdown(true);
            } else {
              this.ui.applyButton.focus();
              event.preventDefault();
            }
          } else if (this.ui.filter) {
            this.ui.filter.focus();
            event.preventDefault();
          } else {
            this.ui.trigger.focus();
            event.preventDefault();
          }
        } else if (this.usedAnchors) {
          event.target.parentElement.click();
        }
      })
      // ------------------------------------------------------------
      // On Key press Dropdown dropdown content element
      .on('keydown', this.options.domSelectors.dropdown, (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          if (!this.isMultiSelect) {
            this.closeDropdown();
          }
        }
        if (event.key === 'Esc' || event.key === 'Escape') {
          this.closeDropdown();
        }
      })
      // ------------------------------------------------------------
      // On Key press Dropdown main element - close dropdown and leave element
      .on('keydown', this.options.domSelectors.trigger, (event) => {
        if (event.key === 'Tab') {
          if (event.shiftKey) {
            this.closeDropdown(true);
          } else {
            this.updateFlyingFocus();
          }
        }
      })
      // On Mouseup dropdown main element - prevent losing focus
      .on('mouseup', this.options.domSelectors.trigger, (event) => {
        if (this.isOpen) {
          event.stopPropagation();
        }
      })
      // ------------------------------------------------------------
      // On Click Dropdown main element - open/close and stop propagation to prevent losing focus
      .on('click', this.options.domSelectors.trigger, (event) => {
        if (!this.isDisabled()) {
          if (this.isOpen) {
            this.closeDropdown();
          } else {
            this.openDropdown();
          }
        }
        event.stopPropagation();
      })
      // apply button prevent propagation to prevent losing focus
      .on('mouseup', this.options.domSelectors.dropdown, (event) => {
        event.stopPropagation();
      })
      // apply button focus after close
      .on('click', this.options.domSelectors.applyButton, () => {
        this.closeDropdown();
      })
      // tab out and lose focus
      .on('keydown', this.options.domSelectors.applyButton, (event) => {
        if (event.key === 'Tab' && !event.shiftKey) {
          this.closeDropdown(true);
        } else {
          this.updateFlyingFocus();
        }
      })
      // ------------------------------------------------------------
      // On value of select changed
      .on(Select.events.valueChanged, this.onValueChanged.bind(this))
      .on(Select.events.setValue, this.onSetValue.bind(this))
      .on(Select.events.setFilter, this.onSetFilter.bind(this))
      .on(Select.events.clear, this.onClear.bind(this))
      .on(Select.events.disable, this.onSetDisabled.bind(this));
    // ------------------------------------------------------------
    // watch select items for status change and update style
    this.ui.inputItems.forEach((item, index) => {
      item.addEventListener('change', () => {
        console.log('change');
        this.changeUpdateItemEvent(item, index);
      });
    });
    // -------------------------------
    // arrow key navigation for select
    this.ui.items.forEach((li) => {
      li.querySelector('input').addEventListener('keydown', (evt) => {
        const pressed = evt.key;
        let newTarget = <any>evt.target;
        if (['ArrowUp', 'ArrowDown', 'Up', 'Down'].indexOf(pressed) >= 0) {
          if (this.isMultiSelect) {
            let nextFocusable = ['ArrowUp', 'Up'].indexOf(pressed) >= 0
              ? li.previousElementSibling
              : li.nextElementSibling;
            while (nextFocusable) {
              if (!nextFocusable.classList.contains('hidden')) {
                newTarget = nextFocusable.querySelector('input');
                break;
              }
              nextFocusable = ['ArrowUp', 'Up'].indexOf(pressed) >= 0
                ? nextFocusable.previousElementSibling
                : nextFocusable.nextElementSibling;
            }
            newTarget.focus();
            evt.stopPropagation();
            evt.preventDefault();
          }
          this.updateFlyingFocus();
        }
        if (!this.isMultiSelect && ['Enter', ' ', 'Spacebar'].indexOf(pressed) >= 0) {
          this.ui.trigger.click();
        }
      });
    });
    // -------------------------------
    // Observe inputs and update values -
    if (this.ui.filter) {
      this.ui.filter.addEventListener('keydown', (event) => {
        this.updateFlyingFocus();
        if (event.key === 'Enter') {
          event.preventDefault();
        }
      });
      this.ui.filterClearButton.addEventListener('keydown', (event) => {
        if (event.key === 'Tab' && !event.shiftKey) {
          const visibleItems = this.ui.element
            .querySelectorAll(this.options.domSelectors.visibleInputItems);
          if (visibleItems.length > 0) {
            visibleItems[0].focus();
            event.preventDefault();
          }
        }
      });
      this.watch(this.ui.filter, 'value', debounce((key, before, after) => { // eslint-disable-line
        this.setFilter(after);
      }, this.options.inputDelay));
    }
    // ------------------------------
    // Set disabled if initially set
    if (this.isDisabled()) {
      this.setDisabled(true);
    }
  }

  /**
   * Set filter value
   */
  setFilter(filterValue) {
    let filterAttribute;
    if (this.ui.element.hasAttribute('data-filter-attribute')) {
      filterAttribute = this.ui.element.getAttribute('data-filter-attribute');
    }
    this.ui.items.forEach((li) => {
      const searchString = filterValue.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      const regex = new RegExp(searchString, 'i');
      const testValue = filterAttribute ? li.querySelector('input').getAttribute(filterAttribute)
        : li.querySelector('input').placeholder;
      if (regex.test(testValue)) {
        li.classList.remove('hidden');
      } else {
        li.classList.add('hidden');
      }
    });
  }


  /**
   * Handle value change and trigger event for each item individually
   * @param item
   * @param index
   * @param emit
   */
  changeUpdateItemEvent(item, index, emit = true) {
    if (!this.isMultiSelect) {
      this.ui.items.forEach((li) => {
        li.classList.remove('selected');
      });
      this.ui.items[index].classList.add('selected');
      if (emit) {
        this.emitValueChanged(item.value);
      }
    } else {
      if (item.checked) {
        this.ui.items[index].classList.add('selected');
      } else {
        this.ui.items[index].classList.remove('selected');
      }

      if (emit) {
        const values = [];
        this.ui.inputItems.forEach((inputItem) => {
          if (inputItem.checked) {
            values.push(inputItem.value);
          }
        });
        this.emitValueChanged(values);
      }
    }
  }

  /**
   * Check if element is disabled
   */
  isDisabled() {
    return this.ui.element.hasAttribute('disabled');
  }

  /**
   * Set disabled or enabled
   */
  setDisabled(disabled) {
    if (disabled) {
      this.ui.trigger.setAttribute('disabled', '');
      return;
    }
    this.ui.trigger.removeAttribute('disabled');
  }

  /**
   * Emit that value has changed - this triggers valueChanged
   * @param value
   */
  emitValueChanged(value) {
    this.ui.element.dispatchEvent(new CustomEvent(Select.events.valueChanged, { detail: value }));
  }

  /**
   * Emit open event
   */
  emitOpen() {
    this.ui.element.dispatchEvent(new CustomEvent(Select.events.open));
  }

  /**
   * Emit close event
   */
  emitClose() {
    this.ui.element.dispatchEvent(new CustomEvent(Select.events.close));
  }

  /**
   * Handle event on value changed
   * @param event
   */
  onValueChanged(event) {
    const value = event.detail;
    let triggerLabelText = '';
    if (this.isMultiSelect) {
      triggerLabelText = value.length > 0 ? `${value.length} ${this.buttonPostfix}` : '';
    } else if (this.ui.phoneInput) {
      triggerLabelText = value;
    } else {
      triggerLabelText = this.ui.list.querySelector(`[value="${value}"`).placeholder;
    }
    this.ui.triggerValue.innerText = triggerLabelText;
    this.ui.element.classList.remove(this.options.stateClasses.selected);
    if (triggerLabelText !== '') {
      this.ui.element.classList.add(this.options.stateClasses.selected);
    }
  }

  /**
   * Handle Set Value from outside
   * @param event
   */
  onSetValue(event) {
    const { data, emit } = event.detail;
    this.ui.items.forEach((li, index) => {
      const input = li.querySelector('input');
      if (this.isMultiSelect) {
        input.checked = data.indexOf(input.value) >= 0;
        this.changeUpdateItemEvent(input, index, emit);
        this.onValueChanged({ detail: data });
      } else if (input.value === data) {
        input.checked = true;
        this.changeUpdateItemEvent(input, index, emit);
        this.onValueChanged({ detail: data });
      }
    });
  }

  /**
   * Handle set filter event
   * @param event
   */
  onSetFilter(event) {
    this.setFilter(event.detail.filterValue);
  }

  /**
   * Handle event when user clicks outside element
   */
  onFocusOut() {
    this.closeDropdown(true);
  }

  /**
   * Handle on disable event
   * @param event
   */
  onSetDisabled(event) {
    const { disabled } = event.detail;
    this.setDisabled(disabled);
    if (disabled) {
      this.closeDropdown(true);
    }
  }

  /**
   * Handle on clear event
   */
  onClear() {
    this.ui.items.forEach((li) => {
      const input = li.querySelector('input');
      input.checked = false;
      li.classList.remove('selected');
      this.ui.triggerValue.innerText = '';
    });
    this.ui.element.classList.remove(this.options.stateClasses.selected);
  }

  /**
   * Open dropdown/select
   */
  openDropdown() {
    const openClass = this.options.stateClasses.open;
    const dropDown = this.ui.element;
    dropDown.classList.add(openClass);
    this.isOpen = true;

    this.ui.trigger.setAttribute('aria-expanded', 'true');
    this.ui.dropdown.setAttribute('aria-hidden', 'false');

    if (this.ui.filter) {
      this.ui.filter.focus();
    } else if (!this.isMultiSelect) {
      if (this.ui.element.querySelector(`${this.options.domSelectors.inputItems}:checked`)) {
        this.ui.element.querySelector(`${this.options.domSelectors.inputItems}:checked`).focus();
      } else {
        this.ui.element.querySelector(this.options.domSelectors.inputItems).focus();
      }
      // adjust height if single select
      const visibleItems = this.ui.element
        .querySelectorAll(this.options.domSelectors.visibleInputItems);
      if (visibleItems.length > 0) {
        const itemsVerticalSize = visibleItems.length * visibleItems[0].clientHeight;
        if (this.ui.dropdown.clientHeight > itemsVerticalSize) {
          this.ui.dropdown.style.height = `${itemsVerticalSize}px`;
        }
      }
    } else {
      this.ui.element.querySelector(this.options.domSelectors.inputItems).focus();
    }
    // click out of element loose focus and close
    this.onFocusOut = this.onFocusOut.bind(this);
    window.addEventListener('mouseup', this.onFocusOut);
    this.emitOpen();
  }

  /**
   * Close dropdown/select
   */
  closeDropdown(focusLost = false) {
    if (this.isOpen) {
      window.removeEventListener('mouseup', this.onFocusOut);
      this.ui.dropdown.removeAttribute('style');
      const openClass = this.options.stateClasses.open;
      const dropDown = this.ui.element;
      dropDown.classList.remove(openClass);
      this.isOpen = false;
      this.ui.trigger.setAttribute('aria-expanded', 'false');
      this.ui.dropdown.setAttribute('aria-hidden', 'true');

      if (this.hasFilter) {
        this.ui.filter.value = '';
      }

      if (!focusLost) {
        setTimeout(() => {
          if (this.ui.phoneInput) {
            this.ui.phoneInput.focus();
          } else {
            this.ui.trigger.focus();
          }
        }, this.options.dropdownDelay);
      } else {
        this.ui.element.querySelector(this.options.domSelectors.visibleInputItems)
          .dispatchEvent(new CustomEvent('validateDeferred', {
            detail: { field: this.ui.inputItems[0] },
          }));
        this.updateFlyingFocus();
      }
      this.emitClose();
    }
  }

  /**
   * Update flying focus with a delay
   */
  updateFlyingFocus() {
    setTimeout(() => {
      (<any>window).estatico.flyingFocus.doFocusOnTarget(document.activeElement);
    }, this.options.inputDelay);
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
