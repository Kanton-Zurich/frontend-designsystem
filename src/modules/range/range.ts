import noUiSlider from 'nouislider';
import wNumb from 'wnumb';
import { merge } from 'lodash';
/*!
 * Slider
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class Range extends Module {
  public minValue: number;
  public maxValue: number;
  public rangeSteps: number;
  public handleOne: number;
  public handleTwo: number;
  public tooltipDecimals: number;
  public tickmarkDensity: number;

  public tooltipSuffix: string;
  public tooltipThousand: string;
  public tickmarkMode: string;

  public hasTickmarks: boolean;
  public usedConfig: any;

  public handles: Array<any>;
  public handlePositions: Array<number>;
  public tickmarkValues: Array<number>;
  public rangeConnects: Array<boolean>;
  public tooltips: Array<any>;

  public tooltip: {
    decimals: number,
    thousand: string,
    suffix: string,
  };

  public ui: {
    element: any,
    slider: any,
    input: any,
  };

  public options: {
    domSelectors: {
      slider: string,
      input: string,
    },
    stateClasses: {
      tickmarks: string,
      tickmarksLabels: string,
    },
    dataSelectos: {
      rangeMin: string,
      rangeMax: string,
      rangeHandleOne: string,
      rangeHandleTwo: string,
      rangeSteps: string,
      rangeTooltipDecimals: string,
      rangeTooltipSuffix: string,
      rangeTooltipThousand: string,
      rangeTickmarkMode: string,
      rangeTickmarkValues: string,
      rangeTickmarkDensity: string,
    },
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        slider: '.mdl-range__slider',
        input: '.mdl-range__input',
      },
      stateClasses: {
        tickmarks: 'mdl-range--tickmarks',
        tickmarksLabels: 'mdl-range--only-labels',
      },
      dataSelectos: {
        rangeMin: 'minvalue',
        rangeMax: 'maxvalue',
        rangeHandleOne: 'handleoneposition',
        rangeHandleTwo: 'handletwoposition',
        rangeSteps: 'rangesteps',
        rangeTooltipDecimals: 'tooltipdecimals',
        rangeTooltipSuffix: 'tooltipsuffix',
        rangeTooltipThousand: 'tooltipthousand',
        rangeTickmarkMode: 'tickmarkmode',
        rangeTickmarkValues: 'tickmarkvalues',
        rangeTickmarkDensity: 'tickmarkdensity',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.hasTickmarks = this.ui.element.classList.contains(this.options.stateClasses.tickmarks)
      || this.ui.element.classList.contains(this.options.stateClasses.tickmarksLabels);

    this.handles = [];

    this.initUi();
    this.initEventListeners();
    this.cacheDataAttributes();
  }

  /**
   * Cache all data attribute values
   */
  cacheDataAttributes() {
    const { rangeMin } = this.options.dataSelectos;
    this.minValue = parseInt(this.ui.slider.dataset[rangeMin], 10) || 0;

    const fallbackMax = 1000;
    const { rangeMax } = this.options.dataSelectos;
    this.maxValue = parseInt(this.ui.slider.dataset[rangeMax], 10) || fallbackMax;

    const { rangeSteps } = this.options.dataSelectos;
    this.rangeSteps = parseInt(this.ui.slider.dataset[rangeSteps], 10) || 1;

    const { rangeHandleOne } = this.options.dataSelectos;
    this.handleOne = parseInt(this.ui.slider.dataset[rangeHandleOne], 10) || 0;

    const { rangeHandleTwo } = this.options.dataSelectos;
    this.handleTwo = parseInt(this.ui.slider.dataset[rangeHandleTwo], 10);

    // Tooltip
    const { rangeTooltipDecimals } = this.options.dataSelectos;
    this.tooltipDecimals = parseInt(this.ui.slider.dataset[rangeTooltipDecimals], 10) || 0;

    const { rangeTooltipSuffix } = this.options.dataSelectos;
    this.tooltipSuffix = this.ui.slider.dataset[rangeTooltipSuffix];

    const { rangeTooltipThousand } = this.options.dataSelectos;
    this.tooltipThousand = this.ui.slider.dataset[rangeTooltipThousand];

    // Pips / Tickmarks
    if (this.hasTickmarks) {
      const { rangeTickmarkMode } = this.options.dataSelectos;
      this.tickmarkMode = this.ui.slider.dataset[rangeTickmarkMode];

      const { rangeTickmarkValues } = this.options.dataSelectos;
      const tickmarkValuesString = this.ui.slider.dataset[rangeTickmarkValues];
      this.tickmarkValues = tickmarkValuesString.split(' ').map(this.parsStringNumbers.bind(this));

      const { rangeTickmarkDensity } = this.options.dataSelectos;
      this.tickmarkDensity = this.ui.slider.dataset[rangeTickmarkDensity];
    }

    this.setupConfig();
  }

  /**
   * Array-Map-Callback
   * @param {string} stringNumber
   * @return {number}
   */
  parsStringNumbers(stringNumber: string): number {
    return parseInt(stringNumber, 10);
  }

  /**
   * Construct the config for the noUiSlider plugin
   */
  setupConfig() {
    this.handlePositions = [];
    this.handlePositions.push(this.handleOne);

    if (isNaN(this.handleTwo)) { // eslint-disable-line
      this.rangeConnects = [true, false];
    } else {
      // Two handles
      this.handlePositions.push(this.handleTwo);
      this.rangeConnects = [false, true, false];
    }

    this.tooltip = {
      decimals: this.tooltipDecimals,
      thousand: this.tooltipThousand,
      suffix: this.tooltipSuffix,
    };

    this.tooltips = [];
    this.handlePositions.forEach(() => {
      this.tooltips.push(wNumb(this.tooltip));
    });

    const config = {
      start: this.handlePositions,
      connect: this.rangeConnects,
      tooltips: this.tooltips,
      step: this.rangeSteps,
      range: {
        min: this.minValue,
        max: this.maxValue,
      },
      ariaFormat: wNumb(this.tooltip),
    };

    if (this.hasTickmarks) {
      merge(config, {
        pips: {
          mode: this.tickmarkMode,
          values: this.tickmarkValues,
          density: this.tickmarkDensity,
          format: wNumb(this.tooltip),
        },
      });
    }

    this.usedConfig = config;

    this.initSliderPlugin();
  }

  /**
   * Launches the noUiSlider plugin and add the set listener
   * to synchronize the values with the hidden input
   */
  initSliderPlugin() {
    noUiSlider.create(this.ui.slider, this.usedConfig);

    const firstHandle = this.ui.slider.querySelector('.noUi-handle-lower');
    const secondHandle = this.ui.slider.querySelector('.noUi-handle-upper');

    if (firstHandle) {
      this.handles.push(firstHandle);
    }

    if (secondHandle) {
      this.handles.push(secondHandle);
    }

    this.ui.slider.noUiSlider.on('set', (values, handle) => {
      // Update the flyingFocus
      (<any>window).estatico.flyingFocus.doFocusOnTarget(this.handles[handle]);
      // Set hidden input value
      this.ui.input.value = this.ui.slider.noUiSlider.get();
    });
  }

  static get events() {
    return {
      // eventname: `eventname.${ Slider.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    // Event listeners
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default Range;
