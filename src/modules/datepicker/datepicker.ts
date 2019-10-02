import flatpickr from 'flatpickr';
import { German } from 'flatpickr/dist/l10n/de';
import { French } from 'flatpickr/dist/l10n/fr';
import { Italian } from 'flatpickr/dist/l10n/it';
import { english } from 'flatpickr/dist/l10n/default';

import { merge } from 'lodash';
/*!
 * Datepicker
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class Datepicker extends Module {
  public isOpen: boolean;
  public pickerMode: string;
  public usedConfig: any;
  public flatpickr: any;
  public dayLabels: Array<any>;

  public globalConfig: {
    nextArrow: string,
    prevArrow: string,
    onChange: any,
    onClose: any,
  };

  public customConfigs: {
    time: {
      enableTime: boolean,
      noCalendar: boolean,
      time_24hr: boolean, // eslint-disable-line
      dateFormat: string,
      position: string,
    },
    date: {
      dateFormat: string,
      position: string,
    },
    dateRange: {
      mode: string,
      separator: string,
      disableMobile: boolean,
      static: boolean,
    },
    dataTime: {
      dateFormat: string,
      position: string,
      noCalendar: boolean,
      disableMobile: boolean,
      static: boolean,
    }
  };

  public ui: {
    element: any,
    trigger: any,
    container: any,
  };

  public options: {
    domSelectors: {
      trigger: string,
      container: string,
    },
    stateClasses: {},
    dataSelectors: {
      pickerMode: string,
    }
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        trigger: '.atm-form_input input',
        container: '.mdl-datepicker__container',
      },
      stateClasses: {
        // activated: 'is-activated'
      },
      dataSelectors: {
        pickerMode: 'datetimeformat',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();

    this.isOpen = false;

    this.customConfigs = {
      time: {
        enableTime: true,
        noCalendar: true,
        time_24hr: true,
        dateFormat: 'H:i',
        position: 'below',
      },
      date: {
        dateFormat: 'd.m.Y',
        position: 'below',
      },
      dateRange: {
        mode: 'range',
        separator: ' - ',
        disableMobile: true,
        static: true,
      },
      dataTime: {
        dateFormat: 'd.m.Y H:i',
        position: 'below',
        noCalendar: false,
        disableMobile: true,
        static: true,
      },
    };


    this.pickerMode = this.ui.element.dataset[this.options.dataSelectors.pickerMode];
    this.globalConfig = {
      nextArrow: '<svg class="icon">\n'
      + '<use xlink:href="#angle_right"></use>\n'
      + '</svg>',
      prevArrow: '<svg class="icon">\n'
      + '<use xlink:href="#angle_left"></use>\n'
      + '</svg>',
      onChange: this.onValueChange.bind(this),
      onClose: this.onClose.bind(this),
    };

    // this.dayLabels = this.ui.element.dataset.daylabels.split(' ');
    this.constructConfig();
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
      .on(Datepicker.events.injectDate, this.onInjectDate.bind(this))
      .on(Datepicker.events.clear, this.onClear.bind(this));
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
      this.usedConfig = merge(
        {},
        this.customConfigs.date,
        this.customConfigs.dateRange,
      );
    } else if (this.pickerMode === 'date-time') {
      this.usedConfig = merge(
        {},
        this.customConfigs.time,
        this.customConfigs.dataTime,
      );
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
    // Replace default range seperator
    if (this.pickerMode === 'date-range') {
      this.flatpickr.l10n.rangeSeparator = ' - ';
    }
  }

  /**
   * Inject date from external
   * @param event
   */
  onInjectDate(event) {
    const { format, date } = event.detail;
    this.flatpickr.setDate(date, true, format);
  }

  /**
   * On change callback. Adds the dirty class to the container element
   */
  onValueChange() {
    if (!this.ui.element.classList.contains('dirty')) {
      this.ui.element.classList.add('dirty');
    }
  }

  /**
   * On close callback from faltpickr. Removes the open class on the main element.
   */
  onClose() {
    this.ui.element.classList.remove('open');
    this.emitDateSet();
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
    }
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
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default Datepicker;
