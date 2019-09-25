import wrist from 'wrist';
import { debounce } from 'lodash';

class ZipCity {
  private fields: {
    zip: HTMLInputElement,
    city: HTMLInputElement,
  }

  private options: {
    debounce: number,
  }

  private data: any

  constructor($zipField, $cityField) {
    this.fields = {
      zip: $zipField,
      city: $cityField,
    };

    this.options = {
      debounce: 250,
    };

    this.data = JSON.parse(this.fields.zip.getAttribute('data-zip'));

    this.setWatcher();
  }

  setWatcher() {
    wrist.watch(this.fields.zip, 'value', debounce((propName, oldVal, newVal) => {
      if (oldVal !== newVal && /^[1-9][0-9]{3}$/.test(newVal)) {
        if (this.data[newVal]) {
          this.fields.city.value = this.data[newVal];
        }
      }
    }, this.options.debounce));
  }
}

export default ZipCity;
