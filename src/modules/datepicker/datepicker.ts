import flatpickr from 'flatpickr';
import { German } from 'flatpickr/dist/l10n/de';
import { French } from 'flatpickr/dist/l10n/fr';
import { Italian } from 'flatpickr/dist/l10n/it';
import { english } from 'flatpickr/dist/l10n/default';

import merge from 'lodash/merge';
/*!
 * Datepicker
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import WindowEventListener from '../../assets/js/helpers/events';

class Datepicker extends Module {
  public isOpen: boolean;
  public ignoreFlatpickr: boolean;
  public pickerMode: string;
  public usedConfig: any;
  public flatpickr: any;

  public globalConfig: {
    nextArrow: string;
    prevArrow: string;
    onChange: any;
    onClose: any;
    static: boolean;
  };

  public customConfigs: {
    time: {
      enableTime: boolean;
      noCalendar: boolean;
      time_24hr: boolean; // eslint-disable-line
      dateFormat: string;
      position: string;
      allowInput: boolean;
      disableMobile: boolean;
    };
    date: {
      dateFormat: string;
      position: string;
      allowInput: boolean;
      disableMobile: boolean;
    };
    dateRange: {
      mode: string;
      separator: string;
      disableMobile: boolean;
      allowInput: boolean;
    };
    dataTime: {
      dateFormat: string;
      position: string;
      noCalendar: boolean;
      disableMobile: boolean;
      allowInput: boolean;
    };
  };

  public ui: {
    element: any;
    trigger: any;
    container: any;
    calendar: any;
  };

  public options: {
    domSelectors: {
      trigger: string;
      container: string;
    };
    stateClasses: {};
    dataSelectors: {
      pickerMode: string;
    };
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        trigger: '.atm-form_input input',
        container: '.mdl-datepicker__container',
      },
      stateClasses: {
        calendarDays: '.flatpickr-day',
      },
      dataSelectors: {
        pickerMode: 'datetimeformat',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();

    this.isOpen = false;
    this.ignoreFlatpickr = this.ui.element.hasAttribute('data-no-flatpickr');

    this.customConfigs = {
      time: {
        enableTime: true,
        noCalendar: true,
        time_24hr: true,
        dateFormat: 'H:i',
        position: 'below',
        allowInput: true,
        disableMobile: this.ignoreFlatpickr,
      },
      date: {
        dateFormat: 'd.m.Y',
        position: 'below',
        allowInput: true,
        disableMobile: this.ignoreFlatpickr,
      },
      dateRange: {
        mode: 'range',
        separator: ' - ',
        disableMobile: true,
        allowInput: true,
      },
      dataTime: {
        dateFormat: 'd.m.Y H:i',
        position: 'below',
        noCalendar: false,
        disableMobile: true,
        allowInput: true,
      },
    };

    this.pickerMode = this.ui.element.dataset[this.options.dataSelectors.pickerMode];
    this.globalConfig = {
      nextArrow:
        '<svg class="icon" focusable="false">\n' +
        '<use xlink:href="#angle_right"></use>\n' +
        '</svg>',
      prevArrow:
        '<svg class="icon" focusable="false">\n' +
        '<use xlink:href="#angle_left"></use>\n' +
        '</svg>',
      onChange: this.onValueChange.bind(this),
      onClose: this.onClose.bind(this),
      static: true,
    };

    this.constructConfig();

    this.ui.element.dataset.initialised = 'true';
  }

  static get events() {
    return {
      close: 'Datepicker.close',
      dateSet: 'Datepicker.dateSet',
      clear: 'Datepicker.clear',
      injectDate: 'Datepicker.injectDate',
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate
      .on('click', this.options.domSelectors.trigger, this.onTriggerClick.bind(this))
      .on('focusin', this.options.domSelectors.trigger, this.onTriggerFocusIn.bind(this))
      .on('blur', this.options.domSelectors.trigger, this.onTriggerFocusOut.bind(this))
      .on('keyup', this.options.domSelectors.trigger, (event) => event.stopPropagation())
      .on(Datepicker.events.injectDate, this.onInjectDate.bind(this))
      .on(Datepicker.events.clear, this.onClear.bind(this));

    (<any>WindowEventListener).addDebouncedResizeListener(this.positionCorrection.bind(this));
  }

  /**
   * Merge the configs correspondingly to the pickerMode data attribute
   */
  constructConfig() {
    // Setup type specific config
    if (this.pickerMode === 'time') {
      this.usedConfig = this.customConfigs.time;
    } else if (this.pickerMode === 'date') {
      this.usedConfig = this.customConfigs.date;
    } else if (this.pickerMode === 'date-range') {
      this.usedConfig = merge({}, this.customConfigs.date, this.customConfigs.dateRange);
    } else if (this.pickerMode === 'date-time') {
      this.usedConfig = merge({}, this.customConfigs.time, this.customConfigs.dataTime);
    }

    // Merge with global config
    this.usedConfig = merge({}, this.usedConfig, this.globalConfig);

    // Merge conditions for data attributes
    // minDate
    if (this.ui.element.dataset.mindate) {
      this.usedConfig = merge({}, this.usedConfig, {
        minDate: Date.now(),
      });
    }
    // maxDate
    if (this.ui.element.dataset.maxdate) {
      this.usedConfig = merge({}, this.usedConfig, {
        maxDate: Date.now(),
      });
    }
    // localization
    if (this.ui.element.dataset.localization) {
      let localization;
      switch (this.ui.element.dataset.localization) {
        case 'de':
          localization = German;
          break;
        case 'fr':
          localization = French;
          break;
        case 'it':
          localization = Italian;
          break;
        default:
          localization = english;
          break;
      }
      this.usedConfig = merge({}, this.usedConfig, {
        locale: localization,
      });
    }
    this.initFlatpickr();
  }

  /**
   * Initialize the Flatpickr plugin
   */
  initFlatpickr() {
    this.flatpickr = flatpickr(this.ui.trigger, this.usedConfig);
    // Replace default range separator
    if (this.pickerMode === 'date-range') {
      this.flatpickr.l10n.rangeSeparator = ' - ';
    }
    const flatpickrElement = this.ui.element.querySelector('.flatpickr-calendar');
    if (flatpickrElement) {
      flatpickrElement.setAttribute('aria-hidden', 'true');
    }

    this.addResetListener();
  }

  // Reset the field, when the form is reset
  addResetListener() {
    if (this.flatpickr.form) {
      this.flatpickr.form.addEventListener('reset', () => {
        this.flatpickr.setDate(null, true);
      });
    }
  }

  /**
   * Move picker if horizontally out of window
   */
  positionCorrection() {
    const borderMargin = 20;
    if (this.ui.element.classList.contains('open')) {
      const element = this.ui.element.querySelector('.flatpickr-calendar');
      const calendarRect = element.getBoundingClientRect();
      if (calendarRect.width < window.innerWidth) {
        const rightEnd = calendarRect.left + calendarRect.width;
        if (rightEnd + borderMargin > window.innerWidth) {
          element.style.marginLeft = `-${rightEnd - window.innerWidth + borderMargin}px`;
        } else {
          element.removeAttribute('style');
        }
      }
    }
  }

  /**
   * Inject date from external
   * @param event
   */
  onInjectDate(event) {
    const { format, date } = event.detail;
    this.ui.element.classList.add('dirty');
    this.ui.trigger.classList.add('dirty');
    this.flatpickr.setDate(date, true, format);
  }

  /**
   * On change callback. Adds the dirty class to the container element
   */
  onValueChange(val) {
    if (this.pickerMode === 'date-range') {
      if (val.length === 1) {
        this.ui.trigger.value = `${this.ui.trigger.value} - ...`;
      }
    }
    if (val.length > 0) {
      this.ui.element.classList.add('dirty');
    } else {
      this.ui.element.classList.remove('dirty');
    }
  }

  /**
   * On close callback from faltpickr. Removes the open class on the main element.
   */
  onClose() {
    this.ui.element.classList.remove('open');
    this.emitDateSet();
    this.emitClose();
  }

  /**
   * Handle clear event
   */
  onClear() {
    this.flatpickr.clear();
    this.ui.element.classList.remove('dirty');
  }

  /**
   * On trigger click. Close the dropdown if its open
   * @param event
   */
  onTriggerClick(event) {
    this.isOpen = this.ui.element.classList.contains('open');
    if (event.target === this.flatpickr.input && this.isOpen) {
      this.flatpickr.close();
    } else {
      this.ui.element.classList.add('open');
      this.positionCorrection();
    }
  }

  /**
   * On trigger focus
   */
  onTriggerFocusIn() {
    this.ui.element.classList.add('dirty');
  }

  /**
   * On trigger lose focus
   * @param event
   */
  onTriggerFocusOut(event) {
    if (event.target.value.length === 0) {
      this.ui.element.classList.remove('dirty');
    }
  }

  formatDateRange(dateRangeString: string) {
    const dates = dateRangeString
      .replace(/\s/g, '')
      .split('-')
      .map((part) => this.formatDate(part));
    // eslint-disable-next-line
    if (dates.length >= 2) {
      return `${dates[0]} - ${dates[1]}`;
    }
    return dateRangeString;
  }

  formatDateTime(dateTimeString: string) {
    const dateTimeParts = dateTimeString.split('-');
    // eslint-disable-next-line
    if (dateTimeParts.length >= 2) {
      const date = this.formatDate(dateTimeParts[0]);
      const time = this.formatTime(dateTimeParts[1]);
      return `${date} ${time}`;
    }
    return dateTimeString;
  }

  formatDate(dateString: string) {
    const dateParts = dateString.split('.').map((part, index) => {
      // eslint-disable-next-line
      if (index < 2) {
        // eslint-disable-next-line
        if (part.length < 2) {
          return `0${part}`;
        }
      }
      return part;
    });
    // eslint-disable-next-line
    if (dateParts.length === 3) {
      return `${dateParts[0]}.${dateParts[1]}.${dateParts[2]}`; // eslint-disable-line
    }
    return dateString;
  }

  formatTime(timeString: string) {
    const timeParts = timeString.split(':').map((part) => {
      // eslint-disable-next-line
      if (part.length < 2) {
        return `0${part}`;
      }
      return part;
    });
    // eslint-disable-next-line
    if (timeParts.length === 2) {
      return `${timeParts[0]}:${timeParts[1]}`;
    }
    return timeString;
  }

  /**
   * Emits event if date has been set
   */
  emitDateSet() {
    const eventData = {
      detail: {
        dateString: this.ui.trigger.value,
        dates: this.flatpickr.selectedDates,
      },
    };

    this.ui.element.dispatchEvent(new CustomEvent(Datepicker.events.dateSet, eventData));
  }

  /**
   * CLose event
   */
  emitClose() {
    const pattern = new RegExp(this.flatpickr.input.getAttribute('data-pattern'), 'i');
    if (pattern) {
      const type = this.ui.element.getAttribute('data-datetimeformat');
      let format = '';
      switch (type) {
        case 'time':
          format = 'H:i';
          this.flatpickr.input.value = this.formatTime(this.flatpickr.input.value);
          break;
        case 'date-time':
          format = 'd.m.Y H:i';
          this.flatpickr.input.value = this.formatDateTime(this.flatpickr.input.value);
          break;
        case 'date-range':
          format = 'd.m.Y - d.m.Y';
          this.flatpickr.input.value = this.formatDateRange(this.flatpickr.input.value);
          break;
        default:
          format = 'd.m.Y';
          this.flatpickr.input.value = this.formatDate(this.flatpickr.input.value);
          break;
      }
      if (pattern.test(this.flatpickr.input.value)) {
        this.flatpickr.setDate(this.flatpickr.input.value, false, format);
      }
    }
    this.ui.element.dispatchEvent(new CustomEvent(Datepicker.events.close));
    // additionally emit this event on input for validation handling
    this.ui.trigger.dispatchEvent(new CustomEvent(Datepicker.events.close));
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default Datepicker;
