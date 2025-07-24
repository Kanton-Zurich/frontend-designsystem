/*!
 * CookieControls
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class CookieControls extends Module {
  private daysToExpire: number;

  public ui: {
    element: HTMLDivElement;
    items: HTMLInputElement[];
  };

  public options: {
    domSelectors: {
      items: string;
    };
    stateClasses: {};
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        items: '.atm-checkbox input',
      },
      stateClasses: {},
    };

    super($element, defaultData, defaultOptions, data, options);
    const radix = 10;
    this.daysToExpire = parseInt(this.ui.element.dataset.expirydays, radix);
    this.ui.items.forEach((item) => {
      const match = document.cookie.match(new RegExp(`(^| )${item.id}=([^;]+)`));
      if (match) {
        if (match[2] === 'true') {
          this.log(`${item.id} cookie is accepted.`);
          item.checked = true;
        } else if (match[2] === 'false') {
          this.log(`${item.id} cookie is rejected.`);
          item.checked = false;
        }
      } else {
        this.log(`No ${item.id} cookie value found.`);
      }
    });
    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      // eventname: `eventname.${ CookieControls.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate.on('click', this.options.domSelectors.items, (event) => {
      document.cookie = `${event.target.id}=${
        event.target.checked
      }; max-age=${this.getExpireDate()}; path=/`;
    });
  }

  /**
   * Calculate the expire date for the cookie
   *
   * @return {string}
   */
  private getExpireDate(): string {
    const date = new Date();
    const hoursADay = 24;
    const minsPerHour = 60;
    const secsPerMin = 60;
    const milliSecs = 1000;
    date.setTime(
      date.getTime() + this.daysToExpire * hoursADay * minsPerHour * secsPerMin * milliSecs
    );

    return date.toUTCString();
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default CookieControls;
