import Module from '../../assets/js/helpers/module';
import Modal from '../modal/modal';
import WindowEventListener from '../../assets/js/helpers/events';
import UserMenu from '../user_menu/user_menu';

class Header extends Module {
  public placeholder: HTMLElement;
  public delayHeaderIsFixed: number;
  public flyoutVisible: boolean;
  public pageHeader: HTMLElement;

  private pinPos: number;
  public height: number;
  private headerHeights: {
    tiny: number;
    xsmall: number;
    medium: number;
  };
  private bpXsmall: number;
  private bpMedium: number;

  public options: {
    transitionDelays: {
      default: number;
    };
    domSelectors: {
      openModal: string;
      wasInverted: string;
      close: string;
      dataMenuBurger: string;
      dataMenuBurgerText: string;
      expander: string;
    };
    stateClasses: {
      activeItem: string;
      open: string;
      fixedHeader: string;
      fixed: string;
      navItem: string;
      scrolledPastHeader: string;
      inverted: string;
      navBurgerWithLoggedinUser: string;
      navBurgerTextWithLoggedinUser: string;
    };
  };

  public ui: {
    element: any;
    close: any;
    dataMenuBurger: any;
    dataMenuBurgerText: any;
  };

  public data: {
    activeModal: HTMLElement;
    activeItem: HTMLElement;
    scrollPosition: number;
    headerIsFixed: boolean;
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      activeModal: null,
      activeItem: null,
      scrollPosition: 0,
      headerIsFixed: false,
    };
    const defaultOptions = {
      transitionDelays: {
        default: 280,
      },
      domSelectors: {
        header: 'mdl-header',
        openModal: '[data-header="openModal"]',
        wasInverted: 'data-header-was-inverted',
        close: '[data-modal="close"]',
        dataMenuBurger: '[data-menu-burger]',
        dataMenuBurgerText: '[data-menu-burger-text]',
      },
      stateClasses: {
        activeItem: 'mdl-header__nav-item--active',
        open: 'mdl-header--open',
        fixedHeader: 'fixed-header',
        fixed: 'mdl-header--fixed',
        navItem: 'mdl-header__nav-item',
        scrolledPastHeader: 'mdl-header--scrolled-past-header',
        inverted: 'cv-inverted',
        navBurgerWithLoggedinUser: 'mdl-header__nav-burger-with-user',
        navBurgerTextWithLoggedinUser: 'mdl-header__nav-burger-text--with-user',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.data.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    this.delayHeaderIsFixed = 0;
    this.pageHeader = null;
    this.headerHeights = {
      tiny: 50,
      xsmall: 58,
      medium: 77,
    };
    this.bpXsmall = 400;
    this.bpMedium = 840;
    this.flyoutVisible = false;

    this.onResize();
    this.createPlaceholder();
    this.initUi();
    this.initEventListeners();
    this.initWatchers();
  }

  static get events() {
    return {
      showHeader: 'showHeader.header',
      hideHeader: 'hideHeader.header',
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    // Chrome vertical scroll compensation CZHDEV-2907
    if (window.scrollY < 100) {
      // eslint-disable-line
      scrollTo(0, -1); // eslint-disable-line
    }
    this.eventDelegate.on(
      'click',
      this.options.domSelectors.openModal,
      this.toggleFlyout.bind(this)
    );
    this.eventDelegate.on('click', this.options.domSelectors.dataMenuBurger, () => {
      if (this.ui.element.classList.contains(this.options.stateClasses.open)) {
        this.data.activeModal.dispatchEvent(new CustomEvent(Modal.events.closeModal));
      } else {
        this.ui.element.querySelector(this.options.domSelectors.openModal).click();
      }
    });

    document.addEventListener('layerChange', (event: CustomEvent) => {
      if (event.detail === 1) {
        this.ui.element.classList.add('mdl-header--nav-level-one');
      }
      if (event.detail === 0) {
        this.ui.element.classList.remove('mdl-header--nav-level-one');
      }
    });

    window.addEventListener(Modal.events.closed, this.hideFlyout.bind(this));
    window.addEventListener(UserMenu.events.stateFetched, this.adjustNavburgerPosition.bind(this));

    (<any>WindowEventListener).addDebouncedResizeListener(this.onResize.bind(this));
    (<any>WindowEventListener).addEventListener('scroll', this.handleScroll.bind(this));

    this.pageHeader = document.querySelector('.mdl-page-header');
  }

  initWatchers() {
    this.watch(this.data, 'headerIsFixed', this.toggleFixedHeader.bind(this));
  }

  toggleFlyout(event, delegate) {
    const targetModal = document.querySelector(`#${delegate.getAttribute('aria-controls')}`);
    if (this.data.activeItem === delegate) {
      this.data.activeItem.setAttribute('aria-expanded', 'false');
      this.data.activeModal.dispatchEvent(new CustomEvent(Modal.events.closeModal));
    } else if (this.data.activeItem !== delegate && this.data.activeModal === targetModal) {
      this.data.activeItem.setAttribute('aria-expanded', 'false');
      this.switchPage(delegate);
      this.data.activeModal.dispatchEvent(
        new CustomEvent(Modal.events.setPage, {
          detail: { page: delegate.getAttribute('data-nav-index') },
        })
      );
    } else if (!this.flyoutVisible) {
      this.showFlyout(delegate, delegate.classList.contains(this.options.stateClasses.navItem));
    } else {
      this.data.activeItem.setAttribute('aria-expanded', 'false');
      this.data.activeModal.dispatchEvent(new CustomEvent(Modal.events.closeModal));
      setTimeout(() => {
        this.showFlyout(delegate, delegate.classList.contains(this.options.stateClasses.navItem));
      }, this.options.transitionDelays.default);
    }
  }

  showFlyout(delegate, mainNav = false) {
    this.flyoutVisible = true;
    this.data.activeModal = document.querySelector(`#${delegate.getAttribute('aria-controls')}`);
    this.data.activeItem = delegate;

    this.data.activeModal.dispatchEvent(
      new CustomEvent(Modal.events.openModal, {
        detail: { page: delegate.getAttribute('data-nav-index') },
      })
    );

    if (!this.data.activeItem.hasAttribute('data-search')) {
      this.ui.element.classList.add(this.options.stateClasses.open);
      this.data.activeItem.classList.add(this.options.stateClasses.activeItem);
    }

    this.data.activeItem.setAttribute('aria-expanded', 'true');

    // if pageheader is present correct padding
    const pageHeader = <HTMLDivElement>document.querySelector('.mdl-page-header');
    if (pageHeader && mainNav) {
      const offsetTop =
        this.ui.element.clientHeight + parseInt(window.getComputedStyle(pageHeader).paddingTop, 10);
      pageHeader.style.paddingTop = `${offsetTop}px`;
    }

    (<HTMLElement>document.querySelector(this.options.domSelectors.close)).focus();
  }

  switchPage(delegate) {
    this.unsetClasses();
    this.data.activeItem = delegate;
    this.data.activeModal = document.querySelector(`#${delegate.getAttribute('aria-controls')}`);
    this.data.activeItem.classList.add(this.options.stateClasses.activeItem);
  }

  hideFlyout() {
    this.flyoutVisible = false;
    let anchornavIsSticky = false;
    const aEl = this.data.activeItem;

    if (aEl) {
      setTimeout(() => {
        aEl.focus();
      }, 350); // eslint-disable-line
    }

    if (document.querySelector('.mdl-anchornav')) {
      anchornavIsSticky = document
        .querySelector('.mdl-anchornav')
        .classList.contains('mdl-anchornav--sticky');
    }

    this.unsetClasses();

    this.ui.element.classList.remove(this.options.stateClasses.open);

    this.setHeaderColor(anchornavIsSticky);

    // if pageheader is present correct padding
    const pageHeader = <HTMLDivElement>document.querySelector('.mdl-page-header');
    if (pageHeader) {
      pageHeader.removeAttribute('style');
    }
  }

  adjustNavburgerPosition(event: CustomEvent) {
    const { stateClasses } = this.options;
    if (event.detail.isLoggedIn) {
      this.ui.dataMenuBurger.classList.add(stateClasses.navBurgerWithLoggedinUser);
      this.ui.dataMenuBurgerText.classList.add(stateClasses.navBurgerTextWithLoggedinUser);
    } else {
      this.ui.dataMenuBurger.classList.remove(stateClasses.navBurgerWithLoggedinUser);
      this.ui.dataMenuBurgerText.classList.remove(stateClasses.navBurgerTextWithLoggedinUser);
    }
  }

  unsetClasses() {
    if (this.data.activeModal) {
      this.data.activeItem.classList.remove(this.options.stateClasses.activeItem);

      this.data.activeModal = null;
      this.data.activeItem = null;
    }
  }

  private onResize() {
    if (window.innerWidth >= this.bpMedium) {
      this.height = this.headerHeights.medium;
    } else if (window.innerWidth >= this.bpXsmall) {
      this.height = this.headerHeights.xsmall;
    } else if (this.height !== this.headerHeights.tiny) {
      this.height = this.headerHeights.tiny;
    }

    if (this.placeholder) {
      this.placeholder.style.height = `${this.height}px`;
    }

    if (document.querySelector('.mdl-anchornav')) {
      this.pinPos = document.querySelector('.mdl-anchornav').getBoundingClientRect().top;
    }
  }

  handleScroll() {
    let pageHeaderBounds = null;
    if (this.pageHeader) {
      pageHeaderBounds = this.pageHeader.getBoundingClientRect();
    }

    if (this.flyoutVisible) {
      return;
    }

    if (pageHeaderBounds.top >= this.height) {
      this.placeholder.style.display = 'none';
      this.ui.element.classList.remove(this.options.stateClasses.fixed);
      document.documentElement.classList.remove(this.options.stateClasses.fixedHeader);
    } else {
      this.placeholder.style.display = 'block';
      this.ui.element.classList.add(this.options.stateClasses.fixed);
      document.documentElement.classList.add(this.options.stateClasses.fixedHeader);
    }

    if (pageHeaderBounds) {
      this.setHeaderColor(pageHeaderBounds.bottom < 0);
    }
  }

  private createPlaceholder() {
    this.placeholder = document.createElement('div');
    this.placeholder.style.display = 'none';
    this.placeholder.style.height = `${this.height}px`;
    this.placeholder.classList.add('mdl-header__placeholder');
    if (this.ui.element.classList.contains(this.options.stateClasses.inverted)) {
      this.placeholder.classList.add(this.options.stateClasses.inverted);
    }
    this.ui.element.parentNode.insertBefore(this.placeholder, this.ui.element);
  }

  /**
   * Toggling the fixed header
   *
   * @memberof Header
   */
  toggleFixedHeader() {
    let anchornavIsSticky = false;

    if (document.querySelector('.mdl-anchornav')) {
      anchornavIsSticky = document
        .querySelector('.mdl-anchornav')
        .classList.contains('mdl-anchornav--sticky');
    }

    this.setHeaderColor(anchornavIsSticky);
  }

  setHeaderColor(sticky: boolean) {
    if (sticky) {
      this.ui.element.classList.add(this.options.stateClasses.scrolledPastHeader);
      if (this.ui.element.classList.contains(this.options.stateClasses.inverted)) {
        this.ui.element.setAttribute(this.options.domSelectors.wasInverted, 'true');
        this.ui.element.classList.remove(this.options.stateClasses.inverted);
      }
    } else {
      this.ui.element.classList.remove(this.options.stateClasses.scrolledPastHeader);
      if (this.ui.element.getAttribute(this.options.domSelectors.wasInverted)) {
        this.ui.element.removeAttribute(this.options.domSelectors.wasInverted);
        this.ui.element.classList.add(this.options.stateClasses.inverted);
      }
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

export default Header;
