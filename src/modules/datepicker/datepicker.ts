import flatpickr from 'flatpickr';
import { merge } from 'lodash';
/*!
 * Datepicker
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class Datepicker extends Module {
  public pickerMode: string;
  public usedConfig: any;
  public flatpickr: any;

  public globalConfig: {
    nextArrow: string,
    prevArrow: string,
    disableMobile: boolean,
    onChange: any,
    onClose: any,
    onOpen: any,
  }

  public customConfigs: {
    time: {
      enableTime: boolean,
      noCalendar: boolean,
      time_24hr: boolean,//stylelint-disable-line
      dateFormat: string,
      position: string,
    },
    date: {
      dateFormat: string,
      position: string,
    },
    dateRange: {
      mode: string,
      minDate: string,
      separator: string,
    },
    dataTime: {
      dateFormat: string,
      position: string,
      noCalendar: boolean,
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

    this.customConfigs = {
      time: {
        enableTime: true,
        noCalendar: true,
        time_24hr: true,//stylelint-disable-line
        dateFormat: 'H:i',
        position: 'below',
      },
      date: {
        dateFormat: 'd.m.Y',
        position: 'below',
      },
      dateRange: {
        mode: 'range',
        minDate: 'today',
        separator: ' - ',
      },
      dataTime: {
        dateFormat: 'd.m.Y H:i',
        position: 'below',
        noCalendar: false,
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
      disableMobile: true,
      onChange: () => {
        if (!this.ui.trigger.classList.contains('dirty')) {
          this.ui.trigger.classList.add('dirty');
        }
      },
      onOpen: () => {
        this.ui.element.classList.add('open');
      },
      onClose: () => {
        this.ui.element.classList.remove('open');
      },
    };

    this.constructConfig();
    this.initFlatpickr();
  }

  static get events() {
    return {
      // eventname: `eventname.${ Datepicker.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
  }

  /**
  * Merge the configs correspondingly to the pickerMode data attribute
  */
  constructConfig() {
    if (this.pickerMode === 'time') {
      this.usedConfig = merge(
        {},
        this.customConfigs.time,
        this.globalConfig,
      );
    } else if (this.pickerMode === 'date') {
      this.usedConfig = merge(
        {},
        this.customConfigs.date,
        this.globalConfig,
      );
    } else if (this.pickerMode === 'date-range') {
      this.usedConfig = merge(
        {},
        this.customConfigs.date,
        this.customConfigs.dateRange,
        this.globalConfig,
      );
    } else if (this.pickerMode === 'date-time') {
      this.usedConfig = merge(
        {},
        this.customConfigs.time,
        this.customConfigs.dataTime,
        this.globalConfig,
      );
    }
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

    // Force month select options to be right aligned
    if (this.pickerMode === 'date-range' || this.pickerMode === 'date-time' || this.pickerMode === 'date') {
      const flatpickrSelect = this.flatpickr.calendarContainer.querySelector('.flatpickr-monthDropdown-months');
      flatpickrSelect.setAttribute('dir', 'rtl');
    }
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
