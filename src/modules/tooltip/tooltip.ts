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
  tooltipHeight: number;
  spaceTop: number;
  spaceLeft: number;
  spaceRight: number;
  spaceBottom: number;

  public ui: {
    element: HTMLDivElement,
    infoButton: HTMLButtonElement,
    tooltip: HTMLDivElement,
    infoContainer: HTMLDivElement,
    wrapper: HTMLDivElement,
    closeButton: HTMLButtonElement,
  };

  public options: {
    domSelectors: {
      infoButton: string,
      tooltip: string,
      infoContainer: string,
      wrapper: string,
      closeButton: string,
    },
    stateClasses: {
      tooltipBaseClass: string,
      arrowBottom: string,
      arrowLeft: string,
      arrowTop: string,
      arrowRight: string,
    },
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

    // this.updateSpaces();
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
        this.toggleTooltip();
      }).on('click', this.options.domSelectors.closeButton, () => {
        this.hideTooltip();
        this.isOpen = false;
        this.ui.closeButton.blur();
      })
      .on('click', this.options.domSelectors.tooltip, (event) => {
        event.stopPropagation();
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
  }

  /**
   * Toggle the tooltip popup/modal and caches
   * the height of the tooltip on the first time when its opening
   */
  toggleTooltip() {
    // Cache height only on first time opening
    if (!this.heightCached) {
      this.tooltipHeight = this.ui.tooltip.getBoundingClientRect().height;
      this.ui.tooltip.style.display = 'none';
      this.ui.tooltip.style.opacity = '1';
      this.ui.tooltip.style.zIndex = '1';
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
    this.ui.tooltip.setAttribute('aria-hidden', 'true');
    this.ui.tooltip.style.display = 'none';
  }

  /**
   * Shows the tooltip and update the aria state
   */
  showTooltip() {
    this.placeTooltip();
    this.ui.element.classList.add('open');
    this.ui.tooltip.setAttribute('aria-hidden', 'false');
  }

  /**
   * Groups methods for placeing the tooltip
   */
  placeTooltip() {
    this.updateSpaces();
    this.setOptimalPosition();
  }

  /**
   * Calaculate the posibible spaces around the trigger area
   */
  updateSpaces() {
    const windowHeight = window.innerHeight;
    const docRect = document.body.getBoundingClientRect();
    const infoRect = this.ui.wrapper.getBoundingClientRect();
    const rightCorner = infoRect.left + infoRect.width;

    this.spaceTop = infoRect.top;
    this.spaceLeft = infoRect.left;
    this.spaceRight = docRect.width - rightCorner;
    this.spaceBottom = windowHeight - (infoRect.top + infoRect.height);
  }

  /**
   * Deside which position should be optimal for the tooltip
   */
  setOptimalPosition() {
    const half = 2;
    const heightOffset = 20;

    if (this.lastStateClass !== undefined) {
      this.ui.tooltip.classList.remove(this.lastStateClass);
    }

    // Position priority: Top -> Right -> Left -> Bottom
    if (this.spaceTop > this.tooltipHeight + heightOffset
      &&this.spaceLeft > (this.tooltipMaxWidth / half)
      && this.spaceRight > (this.tooltipMaxWidth / half)) {
      // Position above
      this.lastStateClass = this.options.stateClasses.arrowBottom;
    } else if (this.spaceRight > this.tooltipMaxWidth
      && this.spaceTop > (this.tooltipHeight / half)) {
      // Position right
      this.lastStateClass = this.options.stateClasses.arrowLeft;
    } else if (this.spaceLeft > this.tooltipMaxWidth
      && this.spaceTop > (this.tooltipHeight / half)) {
      // Position left
      this.lastStateClass = this.options.stateClasses.arrowRight;
    } else if (this.spaceBottom > this.tooltipHeight  + heightOffset
      &&this.spaceLeft > (this.tooltipMaxWidth / half)
      && this.spaceRight > (this.tooltipMaxWidth / half)) {
      // Position below
      this.lastStateClass = this.options.stateClasses.arrowTop;
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
