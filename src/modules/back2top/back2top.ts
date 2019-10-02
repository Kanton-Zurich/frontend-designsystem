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

const CUSTOM_SMOOTH_SCROLL_CONFIG = {
  stepDuration: 10,
  refinement: 8,
};

class Back2top extends Module {
  public options: Back2TopModuleOptions;

  public ui: {
    element: HTMLElement,
  };

  public data: {
    unlockCond: {
      neccessary: boolean,
      sufficient: boolean,
    }
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      unlockCond: {
        neccessary: false,
        sufficient: false,
      },
    };

    super($element, defaultData, Back2TopDefaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
    this.initWatchers();
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
      if (this.scrolBehaviourEnabled()) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        this.smoothScrollTop();
        // do smooth scroll by Hand
      }
    });

    this.initScrollEventListener();
  }

  private scrolBehaviourEnabled(): boolean {
    return 'scrollBehavior' in document.documentElement.style;
  }

  private smoothScrollTop(options = CUSTOM_SMOOTH_SCROLL_CONFIG): void {
    const initialScrollY = window.scrollY;

    let stepScrollY = initialScrollY;

    const scrollSteps = [...new Array(options.refinement)].map((x, idx) => idx * idx);
    const int = setInterval(() => {
      const d = initialScrollY - stepScrollY;
      scrollSteps.every((stepWidth, i) => {
        const bound = stepWidth * options.stepDuration;
        if (stepScrollY < bound || d < bound || i === scrollSteps.length - 1) {
          stepScrollY -= stepWidth;
          return false;
        }
        return true;
      });
      this.log('ScrollToY:', stepScrollY);
      window.scroll(0, stepScrollY);
      if (stepScrollY <= 0) {
        clearInterval(int);
      }
    }, options.stepDuration);
  }

  private initScrollEventListener() {
    let previousScrollY = 0;
    let scrollUpStart: number = -1;
    WindowEventListener.addEventListener('scroll', () => {
      const { scrollY } = window;
      this.data.unlockCond.neccessary = scrollY > this.options.neccessaryScrollY;

      if (previousScrollY > scrollY) {
        // scrolling up
        if (scrollUpStart > 0) {
          const d = scrollUpStart - scrollY;
          this.data.unlockCond.sufficient = d > this.options.sufficientScrollUp;
        } else {
          scrollUpStart = scrollY;
        }
      } else {
        // scrolling down
        scrollUpStart = -1;
        this.data.unlockCond.sufficient = false;
      }

      previousScrollY = window.scrollY;
    });
  }

  /**
   * Initializing the watchers
   */
  initWatchers() {
    this.watch(this.data.unlockCond, 'neccessary', this.onLockStateChange.bind(this));
    this.watch(this.data.unlockCond, 'sufficient', this.onLockStateChange.bind(this));
  }

  private onLockStateChange(propName, oldVal, newVal) {
    this.log('LockCondition change: ', propName, oldVal, newVal);

    if (this.data.unlockCond.neccessary && this.data.unlockCond.sufficient) {
      this.ui.element.classList.remove(this.options.stateClasses.scrolledOn);
      this.ui.element.classList.add(this.options.stateClasses.unlocked);
    } else if (this.data.unlockCond.neccessary) {
      if (propName === 'sufficient' && !newVal) {
        this.ui.element.classList.add(this.options.stateClasses.scrolledOn);
        setTimeout(() => {
          this.ui.element.classList.remove(this.options.stateClasses.unlocked);
        }, 1000);
      }
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
