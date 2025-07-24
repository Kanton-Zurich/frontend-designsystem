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
    element: any;
    activeAnchor: any;
    closeButton: any;
  };

  public options: {
    domSelectors: {
      anchors: string;
      activeAnchor: string;
    };
    stateClasses: {
      active: string;
    };
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        anchors: '.atm-anchorlink',
        activeAnchor: '.atm-anchorlink--active',
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
      hide: `eventname.${LangSwitch.name}.hide`,
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate.on('click', this.options.domSelectors.anchors, (event) => {
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
  }
}

export default LangSwitch;
