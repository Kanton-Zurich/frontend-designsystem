/*!
 * Tabs
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import Impetus from 'impetus';

class Tabs extends Module {
  public ui: {
    element: HTMLDivElement;
    controls: HTMLDivElement;
    controlButtons: HTMLUListElement;
  };
  private tabs: HTMLElement[];
  private panels: HTMLElement[];
  private keys: any;
  private direction: any;
  private impetus: any;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        controls: '.mdl-tabs__controls',
        controlButtons: '.mdl-tabs__controls .mdl-button_group',
      },
      stateClasses: {
        // activated: 'is-activated'
      },
    };
    super($element, defaultData, defaultOptions, data, options);

    this.keys = {
      left: 37,
      right: 39,
    };
    this.direction = {
      37: -1,
      39: 1,
    };

    this.tabs = [].slice.call($element.querySelectorAll('[role="tab"]'));
    this.panels = [].slice.call($element.querySelectorAll('[role="tabpanel"]'));
    this.initUi();
    this.initEventListeners();
    this.checkURL();
  }

  /**
   * Checks on initialization if the URL contains an tab-id as hash
   * and if so open it via triggering a click on the tab
   */
  checkURL() {
    const urlParameter = window.location.href.split('#')[1];

    this.tabs.forEach((tab) => {
      if (urlParameter === tab.id && tab.getAttribute('aria-selected') === 'false') {
        this.activateTab(tab, false, true);
      }
    });
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    // Bind listeners
    this.tabs.forEach((tab) => {
      tab.addEventListener('click', (event) => {
        this.clickEventListener(event);
      });
      tab.addEventListener('keyup', (event) => {
        this.keyupEventListener(event);
      });
    });
    // swipe
    if (this.ui.controls && this.ui.controlButtons) {
      this.updateSwipeFunction(0);
      this.impetus = new Impetus({
        source: this.ui.controls,
        boundX: [
          -Math.abs(
            this.ui.controlButtons.getBoundingClientRect().width -
              this.ui.controls.getBoundingClientRect().width
          ),
          0,
        ],
        bounce: false,
        multiplier: 1,
        friction: 0,
        update: this.updateSwipeFunction.bind(this),
      });
    }
  }

  private updateSwipeFunction(x) {
    let translateX = x;
    const clientWidth = this.ui.controlButtons.getBoundingClientRect().width;
    const { width } = this.ui.controls.getBoundingClientRect();
    if (width >= clientWidth) {
      translateX = 0;
    }
    this.ui.controlButtons.style.transform = `translate(${translateX}px, 0px)`;

    this.ui.controls.classList.remove(
      'mdl-tabs__controls-scroll-right',
      'mdl-tabs__controls-scroll-left'
    );
    if (clientWidth > width) {
      const scrollValue = Math.abs(translateX) / (clientWidth - width);
      // eslint-disable-next-line
      if (scrollValue > 0.05) {
        this.ui.controls.classList.add('mdl-tabs__controls-scroll-right');
      }
      // eslint-disable-next-line
      if (scrollValue < 0.95) {
        this.ui.controls.classList.add('mdl-tabs__controls-scroll-left');
      }
    }
  }

  private clickEventListener(event) {
    const tab = event.target;
    this.activateTab(tab, false);
  }

  // Handle keyup on tabs
  private keyupEventListener(event) {
    const key = event.keyCode;

    if (key === this.keys.left || key === this.keys.right) {
      this.switchTabOnArrowPress(event);
    }
  }

  private switchTabOnArrowPress(event) {
    const pressed = event.keyCode;

    this.tabs.forEach((tab) => {
      tab.addEventListener('focus', (evt) => {
        this.focusEventHandler(evt);
      });
    });

    if (this.direction[pressed]) {
      const index = +event.target.getAttribute('data-tab-index');
      if (index !== undefined) {
        if (this.tabs[index + this.direction[pressed]]) {
          this.tabs[index + this.direction[pressed]].focus();
        } else if (pressed === this.keys.right || pressed === this.keys.down) {
          this.tabs[0].focus();
        }
      }
    }
  }

  private activateTab(tab, focus, replaceState = false) {
    const setFocus = focus || true;
    // Deactivate all other tabs
    this.deactivateTabs();

    // Remove tabindex attribute
    tab.removeAttribute('tabindex');

    // Set the tab as selected
    tab.setAttribute('aria-selected', 'true');

    tab.classList.remove('atm-button--secondary');

    // URL reflection
    if (tab.id && tab.id.length > 0) {
      if (
        !replaceState &&
        (!history.state || !history.state.tabZH || history.state.tabZH !== tab.id)
      ) {
        // eslint-disable-line
        window.history.replaceState({ tabZH: tab.id }, '', `#${tab.id}`);
      }
    }

    // Get the value of aria-controls (which is an ID)
    const controls = tab.getAttribute('data-tab-index');

    // Remove hidden attribute from tab panel to make it visible
    this.panels[+controls].removeAttribute('hidden');
    this.panels[+controls].classList.add('mdl-tabs__tab--active');

    // Set focus when required
    if (setFocus) {
      tab.focus();
    }
    this.dispatchVerticalResizeEvent(100); // eslint-disable-line
  }

  // Deactivate all tabs and tab panels
  private deactivateTabs() {
    this.tabs.forEach((tab) => {
      tab.classList.add('atm-button--secondary');
      tab.setAttribute('tabindex', '-1');
      tab.setAttribute('aria-selected', 'false');
      tab.removeEventListener('focus', (event) => {
        this.focusEventHandler(event);
      });
    });

    this.panels.forEach((panel) => {
      panel.setAttribute('hidden', 'hidden');
      panel.classList.remove('mdl-tabs__tab--active');
    });
  }

  private focusEventHandler(event) {
    this.checkTabFocus(event.target);
  }

  // Only activate tab on focus if it still has focus after the delay
  private checkTabFocus(target) {
    const focused = document.activeElement;
    if (target === focused) {
      this.activateTab(target, false);
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

export default Tabs;
