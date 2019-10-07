/*!
 * FormInfo
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import namespace from '../../assets/js/helpers/namespace';

class Tooltip extends Module {
  isOpen: boolean;
  public ui: {
    element: HTMLDivElement,
    infoButton: HTMLButtonElement,
    tooltip: HTMLDivElement,
    closeButton: HTMLButtonElement,
  };

  public options: {
    domSelectors: {
      infoButton: string,
      tooltip: string,
      closeButton: string,
    },
    stateClasses: any,
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        infoButton: '.mdl-tooltip__trigger',
        tooltip: '.mdl-tooltip__bubble',
        closeButton: '.mdl-tooltip__bubble button',
      },
      stateClasses: {
        // activated: 'is-activated'
      },
    };

    super($element, defaultData, defaultOptions, data, options);
    this.isOpen = false;

    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      // eventname: `eventname.${ FormInfo.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate
      .on('click', this.options.domSelectors.infoButton, () => {
        this.toggleTooltip();
      }).on('click', this.options.domSelectors.closeButton, () => {
        this.hideTooltip();
        this.isOpen = false;
      });
  }

  toggleTooltip() {
    if (this.isOpen) {
      this.hideTooltip();
    } else {
      this.showTooltip();
    }
    this.isOpen = !this.isOpen;
  }

  hideTooltip() {
    this.ui.element.classList.remove('open');
    this.ui.tooltip.setAttribute('aria-hidden', 'true');
  }

  showTooltip() {
    this.ui.element.classList.add('open');
    this.ui.tooltip.setAttribute('aria-hidden', 'false');
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default Tooltip;
