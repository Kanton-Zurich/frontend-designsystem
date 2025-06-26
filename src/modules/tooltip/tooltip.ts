import WindowEventListener from '../../assets/js/helpers/events';
/*!
 * FormInfo
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class Tooltip extends Module {
  isOpen: boolean;
  heightCached: boolean;
  lastStateClass: string;
  tooltipMaxWidth: number;

  public ui: {
    element: HTMLDivElement;
    infoButton: HTMLButtonElement;
    tooltip: HTMLDivElement;
    infoContainer: HTMLDivElement;
    wrapper: HTMLDivElement;
    closeButton: HTMLButtonElement;
  };

  public options: {
    domSelectors: {
      infoButton: string;
      tooltip: string;
      infoContainer: string;
      wrapper: string;
      closeButton: string;
    };
    stateClasses: {
      tooltipBaseClass: string;
      arrowBottom: string;
      arrowLeft: string;
      arrowTop: string;
      arrowRight: string;
    };
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        infoButton: '.mdl-tooltip__trigger',
        tooltip: '.mdl-tooltip__bubble',
        infoContainer: '.mdl-tooltip__text',
        wrapper: '.mdl-tooltip__wrapper',
        closeButton: '.mdl-tooltip__bubble button',
      },
      stateClasses: {
        tooltipBaseClass: 'mdl-tooltip__bubble',
        arrowBottom: 'mdl-tooltip__bubble--arrow-bottom',
        arrowLeft: 'mdl-tooltip__bubble--arrow-left',
        arrowTop: 'mdl-tooltip__bubble--arrow-top',
        arrowRight: 'mdl-tooltip__bubble--arrow-right',
      },
    };

    super($element, defaultData, defaultOptions, data, options);
    this.isOpen = false;
    this.heightCached = false;
    this.tooltipMaxWidth = 260;
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
      .on('click', this.options.domSelectors.infoButton, (event) => {
        event.stopPropagation();
        this.log('Toggle click');
        this.toggleTooltip();
      })
      .on('click', this.options.domSelectors.closeButton, () => {
        this.closeTooltip();
      })
      .on('click', this.options.domSelectors.tooltip, (event) => {
        event.stopPropagation();
      })
      .on('keyup', this.options.domSelectors.tooltip, (event) => {
        if (event.key === 'Escape') {
          this.closeTooltip();
        }
      });

    (<any>WindowEventListener).addDebouncedResizeListener(() => {
      if (this.isOpen) {
        this.placeTooltip();
      }
    });
    (<any>WindowEventListener).addEventListener('scroll', () => {
      if (this.isOpen) {
        this.placeTooltip();
      }
    });
    document.addEventListener('click', () => {
      if (this.isOpen) {
        this.hideTooltip();
        this.isOpen = false;
      }
    });
    setTimeout(() => {
      if (this.ui.tooltip) {
        this.ui.tooltip.style.display = 'none';
        this.ui.tooltip.querySelectorAll('a').forEach((anchor) => {
          anchor.setAttribute('tabindex', '-1');
        });
      }
    }, 100);
  }

  /**
   * Close the tooltip
   */
  closeTooltip() {
    this.hideTooltip();
    this.isOpen = false;
    this.ui.closeButton.blur();
  }

  /**
   * Toggle the tooltip popup/modal and caches
   * the height of the tooltip on the first time when its opening
   */
  toggleTooltip() {
    // Cache height only on first time opening
    if (!this.heightCached) {
      this.ui.tooltip.style.display = 'none';
      this.ui.tooltip.style.opacity = '1';
      this.ui.tooltip.style.zIndex = '1000';
      this.heightCached = true;
    }

    if (this.isOpen) {
      this.hideTooltip();
    } else {
      this.showTooltip();
    }
    this.isOpen = !this.isOpen;
  }

  /**
   * Hide the tooltip and updates the aria state
   */
  hideTooltip() {
    this.ui.element.classList.remove('open');
    this.ui.tooltip.querySelectorAll('a').forEach((anchor) => {
      anchor.setAttribute('tabindex', '-1');
    });
    this.ui.tooltip.setAttribute('aria-hidden', 'true');
    if (this.ui.closeButton) {
      this.ui.closeButton.setAttribute('tabindex', '-1');
    }
    this.ui.tooltip.style.display = 'none';
  }

  /**
   * Shows the tooltip and update the aria state
   */
  showTooltip() {
    this.placeTooltip();
    this.setOptimalPosition();
    this.ui.element.classList.add('open');
    this.ui.tooltip.setAttribute('aria-hidden', 'false');
    this.ui.tooltip.querySelectorAll('a').forEach((anchor) => {
      anchor.setAttribute('tabindex', '0');
    });
    if (this.ui.closeButton) {
      this.ui.closeButton.setAttribute('tabindex', '0');
    }
  }

  /**
   * Groups methods for placeing the tooltip
   */
  placeTooltip() {
    this.setOptimalPosition();
  }

  /**
   * Deside which position should be optimal for the tooltip
   */
  setOptimalPosition() {
    const borderOffset = 20;
    const arrowOffset = 11;

    if (this.lastStateClass !== undefined) {
      this.ui.tooltip.classList.remove(this.lastStateClass);
    }

    const toolTipRect = this.ui.tooltip.getBoundingClientRect();
    const bulletRect = this.ui.wrapper.getBoundingClientRect();

    const topMargin = bulletRect.top - toolTipRect.height - borderOffset;
    const bottomMargin =
      window.outerHeight -
      (bulletRect.top + toolTipRect.height + bulletRect.height + arrowOffset) -
      borderOffset;

    const leftMargin = bulletRect.left - toolTipRect.width / 2 - borderOffset; // eslint-disable-line
    const rightMargin = window.outerWidth - bulletRect.left - toolTipRect.width / 2 - borderOffset; // eslint-disable-line

    const quadrant =
      toolTipRect.top < window.outerHeight / 2 && toolTipRect.left < window.innerWidth / 2 // eslint-disable-line
        ? 'topLeft'
        : toolTipRect.top < window.outerHeight / 2 && toolTipRect.left >= window.innerWidth / 2 // eslint-disable-line
        ? 'topRight'
        : toolTipRect.top >= window.outerHeight / 2 && toolTipRect.left < window.innerWidth / 2 // eslint-disable-line
        ? 'bottomLeft'
        : 'bottomRight';

    switch (
      quadrant // eslint-disable-line
    ) {
      case 'topLeft':
        if (leftMargin < 0) {
          this.lastStateClass = this.options.stateClasses.arrowLeft;
        } else {
          this.lastStateClass = this.options.stateClasses.arrowTop;
          if (bottomMargin < 0) {
            this.lastStateClass = this.options.stateClasses.arrowLeft;
          }
        }
        break;
      case 'topRight':
        if (rightMargin < 0) {
          this.lastStateClass = this.options.stateClasses.arrowRight;
        } else {
          this.lastStateClass = this.options.stateClasses.arrowTop;
          if (bottomMargin < 0) {
            this.lastStateClass = this.options.stateClasses.arrowRight;
          }
        }
        break;
      case 'bottomLeft':
        if (leftMargin < 0) {
          this.lastStateClass = this.options.stateClasses.arrowLeft;
        } else {
          this.lastStateClass = this.options.stateClasses.arrowBottom;
          if (topMargin < 0) {
            this.lastStateClass = this.options.stateClasses.arrowLeft;
          }
        }
        break;
      case 'bottomRight':
        if (rightMargin < 0) {
          this.lastStateClass = this.options.stateClasses.arrowRight;
        } else {
          this.lastStateClass = this.options.stateClasses.arrowBottom;
          if (topMargin < 0) {
            this.lastStateClass = this.options.stateClasses.arrowRight;
          }
        }
        break;
    }

    this.ui.tooltip.classList.add(this.lastStateClass);
    this.ui.tooltip.style.display = 'block';
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
