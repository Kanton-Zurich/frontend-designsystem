/*!
 * Back2top
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import WindowEventListener from '../../assets/js/helpers/events';
import {
  Back2TopDefaultOptions,
  Back2TopModuleOptions, // eslint-disable-line no-unused-vars
} from './back2top.options';
import LangSwitch from '../lang_switch/lang_switch';

class Back2top extends Module {
  public options: Back2TopModuleOptions;

  public ui: {
    element: HTMLElement,
  };

  public data: {
    unlockCond: {
      necessary: boolean,
      sufficient: boolean,
    }
  };

  private defaultBottomPos: number;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      unlockCond: {
        necessary: false,
        sufficient: false,
      },
    };

    super($element, defaultData, Back2TopDefaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
    this.initWatchers();

    if (this.ui.element.classList.contains(this.options.stateClasses.preserveLangSwitch)) {
      this.ui.element.classList.remove(this.options.stateClasses.preserveLangSwitch);
      this.defaultBottomPos = window.innerHeight - this.ui.element.offsetTop;
      this.ui.element.classList.add(this.options.stateClasses.preserveLangSwitch);
    } else {
      this.defaultBottomPos = window.innerHeight - this.ui.element.offsetTop;
    }
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
    this.eventDelegate.on('click', () => {
      this.ui.element.classList.remove(this.options.stateClasses.unlocked);
      if (this.scrollBehaviourEnabled()) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        this.smoothScrollTop();
      }
    });

    this.initScrollEventListener();
  }

  private scrollBehaviourEnabled(): boolean {
    return 'scrollBehavior' in document.documentElement.style;
  }

  /**
   * Smooth scroll method for browser not supporting scroll behaviour option.
   *
   * @param options Configuration object with property 'stepDuration' = time in ms for each scroll
   * step and a 'refinement' factor, which is an integer > 0 controlling the scroll amount
   * for each step.
   */
  private smoothScrollTop(options = this.options.customSmoothScrollConfig): void {
    const initialScrollY = window.scrollY;

    let stepScrollY = initialScrollY;

    const scrollSteps = [...new Array(options.refinement)].map((x, idx) => idx * idx);
    const int = setInterval(() => {
      const d = initialScrollY - stepScrollY;
      scrollSteps.every((stepSize, i) => {
        const bound = stepSize * options.stepDuration;
        if (stepScrollY < bound || d < bound || i === scrollSteps.length - 1) {
          stepScrollY -= stepSize;
          return false;
        }
        return true;
      });
      window.scroll(0, stepScrollY);
      if (stepScrollY <= 0) {
        clearInterval(int);
      }
    }, options.stepDuration);
  }

  private initScrollEventListener() {
    let previousScrollY = 0;
    let scrollUpStart: number = -1;
    let prevScrollUp: number = -1;

    const footerElement = document.querySelector<HTMLElement>(this.options.footerSelector);

    WindowEventListener.addEventListener('scroll', () => {
      const { scrollY } = window;
      this.data.unlockCond.necessary = scrollY > this.options.necessaryScrollY;

      if (previousScrollY > scrollY) {
        // scrolling up
        if (scrollUpStart > 0) {
          const d = scrollUpStart - scrollY;
          this.data.unlockCond.sufficient = d > this.options.sufficientScrollUp;
          prevScrollUp = scrollY;
        } else {
          scrollUpStart = scrollY;
        }
      } else if (scrollUpStart > 0 && scrollY - prevScrollUp > this.options.stateSlip) {
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
          const screenBottom = scrollY + window.innerHeight;
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

      previousScrollY = scrollY;
    });
  }

  /**
   * Initializing the watchers
   */
  initWatchers() {
    this.watch(this.data.unlockCond, 'necessary', this.onLockStateChange.bind(this));
    this.watch(this.data.unlockCond, 'sufficient', this.onLockStateChange.bind(this));

    // Handle case when langswitch is closed.
    if (this.ui.element.classList.contains(this.options.stateClasses.preserveLangSwitch)) {
      document.addEventListener(LangSwitch.events.hide, () => {
        this.ui.element.classList.remove(this.options.stateClasses.preserveLangSwitch);
      }, { once: true });
    }
  }

  private onLockStateChange(propName, oldVal, newVal) {
    if (this.data.unlockCond.necessary && this.data.unlockCond.sufficient) {
      this.ui.element.classList.remove(this.options.stateClasses.scrolledOn);
      this.ui.element.classList.add(this.options.stateClasses.unlocked);
    } else if (!newVal) {
      this.ui.element.classList.add(this.options.stateClasses.scrolledOn);
      setTimeout(() => { // Remove classes after animations completed.
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

export default Back2top;
