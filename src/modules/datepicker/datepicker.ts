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
    onReady: any,
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
      appendTo: any,
      disableMobile: boolean,
      static: boolean,
      inline: boolean,
      wrap: boolean,
    },
    dataTime: {
      dateFormat: string,
      position: string,
      appendTo: any,
      noCalendar: boolean,
      disableMobile: boolean,
      static: boolean,
      inline: boolean,
      wrap: boolean,
    }
  };

  public ui: {
    element: any,
    trigger: any,
    container: any,
    mobileDebug: any,
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
        mobileDebug: '#debug',
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
        disableMobile: true,
        static: false,
        inline: true,
        wrap: false,
        appendTo: this.ui.container,
      },
      dataTime: {
        dateFormat: 'd.m.Y H:i',
        position: 'below',
        noCalendar: false,
        disableMobile: true,
        static: false,
        inline: false,
        wrap: false,
        appendTo: this.ui.container,
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
      onReady: this.onReady.bind(this),
      onChange: this.onValueChange.bind(this),
      onOpen: this.onPickerOpen.bind(this),
      onClose: this.onPickerClose.bind(this),
    };

    this.constructConfig();
    this.initFlatpickr();
    console.log('AFTER INIT');
    this.flatpickr.close();
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
    this.eventDelegate
      .on('click', this.options.domSelectors.trigger, this.onTriggerClick.bind(this));
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
    console.log('INIT - ',this.pickerMode);
    this.flatpickr = flatpickr(this.ui.trigger, this.usedConfig);


    // Replace default range seperator
    if (this.pickerMode === 'date-range') {
      this.flatpickr.l10n.rangeSeparator = ' - ';
    }

    if (this.pickerMode === 'date-range' || this.pickerMode === 'date-time') {
      this.flatpickr.calendarContainer.classList.add('noBorderShadow');

      // Force month select options to be right aligned
      /*
      const flatpickrSelect = this.flatpickr.calendarContainer.querySelector('.flatpickr-monthDropdown-months');
      flatpickrSelect.setAttribute('dir', 'rtl');
      */
    }
  }

  onValueChange() {
    console.log('onValueChange');
    if (!this.ui.trigger.classList.contains('dirty')) {
      this.ui.element.querySelector('input.flatpickr-mobile').classList.add('dirty');
      this.ui.trigger.classList.add('dirty');
    }
  }

  onPickerOpen() {
    console.log('OPEN');
    this.ui.element.classList.add('open');
    const style = document.createAttribute('style')
    this.flatpickr.calendarContainer.removeAttributeNode('style');
  }

  onPickerClose() {
    console.log('CLOSE');
    this.ui.element.classList.remove('open');
  }

  onReady() {
    console.log('READY');
    console.log('--flat--');
    console.log(this.flatpickr);
    console.log(this.ui.container.querySelector('.flatpickr-calendar '));
  }

  onTriggerClick() {
    console.log('click');
    console.log(this.flatpickr);
    this.flatpickr.toggle; // toggle()
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
