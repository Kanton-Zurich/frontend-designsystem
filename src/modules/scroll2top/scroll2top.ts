/*!
 * Scroll2top
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import WindowEventListener from '../../assets/js/helpers/events';
import {
  Scroll2TopDefaultOptions,
  Scroll2TopModuleOptions, // eslint-disable-line no-unused-vars
} from './scroll2top.options';

class Scroll2top extends Module {
  public options: Scroll2TopModuleOptions;

  public ui: {
    element: HTMLElement;
  };

  public data: {
    unlockCond: {
      necessary: boolean;
      sufficient: boolean;
    };
  };

  private defaultBottomPos: number;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      unlockCond: {
        necessary: false,
        sufficient: false,
      },
    };

    super($element, defaultData, Scroll2TopDefaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
    this.initWatchers();
  }

  static get events() {
    return {
      // eventname: `eventname.${ Scroll2top.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate.on('click', () => {
      this.ui.element.classList.remove(this.options.stateClasses.unlocked);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    this.initScrollEventListener();
  }

  private initScrollEventListener() {
    let previousScrollY = 0;
    let scrollUpStart: number = -1;
    let prevScrollUp: number = -1;

    const footerElement = document.querySelector<HTMLElement>(this.options.footerSelector);

    WindowEventListener.addEventListener('scroll', () => {
      const { pageYOffset } = window;
      this.data.unlockCond.necessary = pageYOffset > this.options.necessaryScrollY;

      if (previousScrollY > pageYOffset) {
        // scrolling up
        if (scrollUpStart > 0) {
          const d = scrollUpStart - pageYOffset;
          this.data.unlockCond.sufficient = d > this.options.sufficientScrollUp;
          prevScrollUp = pageYOffset;
        } else {
          scrollUpStart = pageYOffset;
        }
      } else if (scrollUpStart > 0 && pageYOffset - prevScrollUp > this.options.stateSlip) {
        // scrolling down
        scrollUpStart = -1;
        this.data.unlockCond.sufficient = false;
      }

      if (footerElement) {
        let footerOT = 0;
        let el = footerElement;
        while (el != null && (el.tagName || '').toLowerCase() !== 'html') {
          footerOT += el.offsetTop || 0;
          el = el.parentElement;
        }
        if (footerOT) {
          const screenBottom = pageYOffset + window.innerHeight;

          const pxInView = screenBottom - footerOT;

          if (pxInView > 0) {
            this.ui.element.style.transition = 'inherit';
            this.ui.element.style.bottom = `${this.defaultBottomPos + pxInView}px`;
            setTimeout(() => {
              this.ui.element.style.transition = null;
            }, 0);
          } else {
            this.ui.element.style.bottom = null;
          }
        }
      }

      previousScrollY = pageYOffset;
    });
  }

  /**
   * Initializing the watchers
   */
  initWatchers() {
    this.watch(this.data.unlockCond, 'necessary', this.onLockStateChange.bind(this));
    this.watch(this.data.unlockCond, 'sufficient', this.onLockStateChange.bind(this));
  }

  private onLockStateChange(propName, oldVal, newVal) {
    if (this.data.unlockCond.necessary && this.data.unlockCond.sufficient) {
      this.ui.element.classList.remove(this.options.stateClasses.scrolledOn);
      this.ui.element.classList.add(this.options.stateClasses.unlocked);
    } else if (!newVal) {
      this.ui.element.classList.add(this.options.stateClasses.scrolledOn);
      setTimeout(() => {
        // Remove classes after animations completed.
        this.ui.element.classList.remove(this.options.stateClasses.scrolledOn);
        this.ui.element.classList.remove(this.options.stateClasses.unlocked);
      }, this.options.transitionDelay);
    } else {
      this.ui.element.classList.remove(this.options.stateClasses.unlocked);
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

export default Scroll2top;
