/*!
 * LangSwitch
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class LangSwitch extends Module {
  public placeholder: HTMLElement;

  public ui: {
    element: any,
    activeAnchor: any,
    closeButton: any,
  };

  public options: {
    domSelectors: {
      anchors: string,
      activeAnchor: string,
      closeButton: string,
    },
    stateClasses: {
      active: string,
    },
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        anchors: '.atm-anchorlink',
        activeAnchor: '.atm-anchorlink--active',
        closeButton: '.mdl-lang-switch__close',
      },
      stateClasses: {
        active: 'atm-anchorlink--active',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      // eventname: `eventname.${ LangSwitch.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate
      .on('click', this.options.domSelectors.closeButton, () => {
        this.ui.element.style.display = 'none';
      }).on('click', this.options.domSelectors.anchors, (event) => {
        if (event.target !== this.ui.activeAnchor) {
          this.ui.activeAnchor.classList.remove(this.options.stateClasses.active);
          event.target.classList.add(this.options.stateClasses.active);
          this.ui.activeAnchor = event.target;
        }
      });
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default LangSwitch;
