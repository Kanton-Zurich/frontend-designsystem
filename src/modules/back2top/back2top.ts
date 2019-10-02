/*!
 * Back2top
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import WindowEventListener from '../../assets/js/helpers/events';
import { Back2TopDefaultOptions, Back2TopModuleOptions } from './back2top.options';

class Back2top extends Module {
  private neccessaryCond: boolean;
  private sufficientCond: boolean;

  public options: Back2TopModuleOptions;

  public ui: {
    element: HTMLElement,
  };
  
  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = Back2TopDefaultOptions;

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();

    this.neccessaryCond = false;
    this.sufficientCond = false;
  }

  static get events() {
    return {
      // eventname: `eventname.${ Back2top.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    // Event listeners
    WindowEventListener.addEventListener('scroll', (ev: Event) => {
      this.log('ScrollEvent?', ev);

      this.log('Offset', window.scrollY);
      if (window.scrollY > )

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

export default Back2top;
