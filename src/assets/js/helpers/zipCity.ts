import wrist from 'wrist';
import SimpleScrollbar from 'simple-scrollbar';
import { debounce, template } from 'lodash';

class ZipCity {
  private fields: {
    zip: HTMLInputElement,
    city: HTMLInputElement,
    cityOptionsWrap: HTMLDivElement,
    cityOptionsList: HTMLUListElement,
    cityOptionsTemplate: HTMLScriptElement,
  }

  private options: {
    debounce: number,
    showOptionsClass: string;
  }

  private data: any;

  private scrollbarInitialized: Boolean;

  private clickListener = () => {
    this.openOptionList();
  }

  private keydownListener = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === 'Spacebar' || event.key === ' ') {
      event.stopPropagation();
      event.preventDefault();

      this.openOptionList();
    } else if ((event.key === 'Tab') && !event.shiftKey) {
      this.closeOptionList();
    }
  }

  private mouseupListener = () => {
    this.closeOptionList();
  }

  constructor($zipField, $cityField) {
    this.fields = {
      zip: $zipField,
      city: $cityField,
      cityOptionsWrap: $cityField.parentElement.querySelector('[data-form_input="cityOptions"]'),
      cityOptionsList: $cityField.parentElement.querySelector('[data-form_input="cityOptionsList"]'),
      cityOptionsTemplate: $cityField.parentElement.querySelector('[data-form_input="cityOptionsTemplate"]'),
    };

    this.options = {
      debounce: 250,
      showOptionsClass: 'atm-form_input--show-city-options',
    };

    this.data = JSON.parse(this.fields.zip.getAttribute('data-zip'));

    this.scrollbarInitialized = false;

    this.setWatcher();
  }

  setWatcher() {
    wrist.watch(this.fields.zip, 'value', debounce((propName, oldVal, newVal) => {
      if (oldVal !== newVal) {
        this.fields.cityOptionsList.innerHTML = '';

        if (/^[1-9][0-9]{3}$/.test(newVal)) {
          this.fields.city.readOnly = true;

          if (typeof this.data[newVal] === 'string') {
            this.setValue(this.data[newVal]);
          } else if (Array.isArray(this.data[newVal])) {
            let listItems = '';

            this.data[newVal].forEach((city) => {
              const compiled = template(this.fields.cityOptionsTemplate.innerHTML);
              const html = compiled({ city });

              listItems = `${listItems}${html}`;
            });

            this.fields.cityOptionsList.innerHTML = listItems;

            this.fields.city.parentElement.classList.add(this.options.showOptionsClass);

            this.fields.city.addEventListener('click', this.clickListener);
            this.fields.city.addEventListener('keydown', this.keydownListener);

            if (!this.scrollbarInitialized) {
              SimpleScrollbar.initEl(this.fields.cityOptionsList);
              this.scrollbarInitialized = true;
            }

            this.addEventListeners();
          }
        } else {
          this.fields.city.readOnly = false;
          this.unsetValue();
          this.removeEventListeners();
        }
      }
    }, this.options.debounce));
  }

  addEventListeners() {
    const buttons = this.fields.cityOptionsList.querySelectorAll('button');

    this.fields.city.addEventListener('click', this.clickListener);
    this.fields.city.addEventListener('keydown', this.keydownListener);

    window.addEventListener('mouseup', this.mouseupListener);

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        this.setValue(button.getAttribute('value'));
      });
      button.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Esc' || event.key === 'Escape') {
          this.fields.city.parentElement.classList.remove(this.options.showOptionsClass);

          this.fields.city.focus();
          (<any>window).estatico.flyingFocus.doFocusOnTarget(document.activeElement);
        }
      });
    });
  }

  removeEventListeners() {
    this.fields.city.removeEventListener('click', this.clickListener);
    this.fields.city.removeEventListener('keydown', this.keydownListener);
  }

  openOptionList() {
    this.fields.city.parentElement.classList.add(this.options.showOptionsClass);

    const listitems = this.fields.cityOptionsList.querySelectorAll('li');

    listitems.forEach((listitem) => {
      listitem.classList.remove('selected');
    });

    window.addEventListener('mouseup', this.mouseupListener);

    const button: HTMLButtonElement = this.fields.cityOptionsList.querySelector(`button[value="${this.fields.city.value}"]`);

    button.parentElement.classList.add('selected');
    button.focus();
    (<any>window).estatico.flyingFocus.doFocusOnTarget(document.activeElement);
  }

  closeOptionList() {
    window.removeEventListener('mouseup', this.mouseupListener);
    this.fields.city.parentElement.classList.remove(this.options.showOptionsClass);
  }

  setValue(value: string) {
    this.fields.city.value = value;

    this.fields.city.parentElement.classList.remove(this.options.showOptionsClass);

    // show options again on click
    if (this.fields.cityOptionsList.childElementCount > 0) {
      this.fields.city.focus();
      (<any>window).estatico.flyingFocus.doFocusOnTarget(document.activeElement);
    }
  }

  unsetValue() {
    this.fields.city.value = '';

    this.fields.city.parentElement.classList.remove(this.options.showOptionsClass);
  }
}

export default ZipCity;
