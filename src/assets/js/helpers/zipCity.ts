import wrist from 'wrist';
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

  private data: any

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

    this.setWatcher();
  }

  setWatcher() {
    wrist.watch(this.fields.zip, 'value', debounce((propName, oldVal, newVal) => {
      if (oldVal !== newVal && /^[1-9][0-9]{3}$/.test(newVal)) {
        if (typeof this.data[newVal] === 'string') {
          this.fields.city.value = this.data[newVal];
        } else if (Array.isArray(this.data[newVal])) {
          this.fields.cityOptionsList.innerHTML = '';

          let listItems = '';

          this.data[newVal].forEach((city) => {
            const compiled = template(this.fields.cityOptionsTemplate.innerHTML);
            const html = compiled({ city });

            listItems = `${listItems}${html}`;
          });

          this.fields.cityOptionsList.innerHTML = listItems;

          this.fields.city.parentElement.classList.add(this.options.showOptionsClass);

          this.addEventListeners();
        }
      }
    }, this.options.debounce));
  }

  addEventListeners() {
    const buttons = this.fields.cityOptionsList.querySelectorAll('button');

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        this.fields.city.value = button.getAttribute('value');

        this.fields.city.parentElement.classList.remove(this.options.showOptionsClass);
      });
    });
  }
}

export default ZipCity;
