import debounce from 'lodash/debounce';

import mq from '../../assets/js/helpers/mediaqueries';
import Module from '../../assets/js/helpers/module';

class Anchornav extends Module {
  public ui: {
    element: HTMLDivElement;
    container: HTMLDivElement;
    list: HTMLUListElement;
    details: HTMLDetailsElement;
    navItems: HTMLAnchorElement[];
    fullwidthElement: any;
  };

  public intersectionObservers: Record<string, IntersectionObserver>;
  public intersectingFullwidthElements: Set<number>;

  private debounceDelay: number;
  private anchorNavOffsetTop: number;
  private scrollMarginTop: number;

  public options: {
    domSelectors: {
      wrapper: string;
      container: string;
      details: string;
      list: string;
      navItems: string;
      fullwidthElement: string;
      pageHeader: string;
    };
    stateClasses: {
      stickyAnchornav: string;
      hiddenAnchornav: string;
      activeAnchornavItem: string;
    };
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        wrapper: '.mdl-anchornav__wrapper',
        container: '.mdl-anchornav__container',
        details: '.mdl-anchornav__container details',
        list: '.mdl-anchornav__list',
        navItems: '.mdl-anchornav__list .mdl-anchornav__anchorlink',
        fullwidthElement: '[data-anchornav="fullwidth"]',
        pageHeader: '.mdl-page-header',
      },
      stateClasses: {
        stickyAnchornav: 'mdl-anchornav__container--sticky',
        hiddenAnchornav: 'mdl-anchornav__container--hide',
        activeAnchornavItem: 'mdl-anchornav__anchorlink--active',
      },
    };

    super($element, defaultData, defaultOptions, data, options);
    this.initUi();
    this.debounceDelay = 50;
    this.anchorNavOffsetTop = 152; // value from anchornav.scss .mdl-anchornav__container--sticky
    this.scrollMarginTop = 120;

    this.filterAnchorNavItems();
    this.initEventListeners();
    this.initIntersectionObservers();
  }

  static get events() {
    return {
      isSticky: 'isSticky.anchornav',
      isNotSticky: 'isNotSticky.anchornav',
    };
  }

  get rootMarginBottom(): number {
    const calc = window.innerHeight - this.anchorNavOffsetTop - this.ui.container.offsetHeight;
    return calc > 0 ? calc : 1;
  }

  // CZHDEV-4188 remove items from anchornav with no corresponsing target
  filterAnchorNavItems() {
    this.ui.navItems.forEach((element: HTMLAnchorElement) => {
      const target = document.querySelector(`[id="${element.getAttribute('href').split('#')[1]}"]`);
      if (!target) {
        element.parentElement.remove();
      }
    });
  }

  initEventListeners() {
    // open details element when breakpoint 'large' or wider
    // closes details element when breakpoint smaller than 'large' and anchornav is sticky
    mq.get('large').addEventListener('change', (event) => {
      if (event.matches) {
        this.ui.details.setAttribute('open', '');
        this.setStickyHeaderObserver(true);
      } else if (this.ui.container.classList.contains(this.options.stateClasses.stickyAnchornav)) {
        this.ui.details.removeAttribute('open');
        this.setStickyHeaderObserver(false);
      }
    });

    this.ui.list.addEventListener('click', () => {
      if (!mq.get('large').matches) {
        this.ui.details.removeAttribute('open');
      }
    });

    // debounced resize event listener to reset intersection observer for hiding anchor navigation
    window.addEventListener(
      'resize',
      debounce(this.setHideAnchorOverFullwidthObserver, this.debounceDelay).bind(this)
    );
  }

  initIntersectionObservers() {
    this.intersectionObservers = {};
    this.intersectingFullwidthElements = new Set();

    this.setStickyHeaderObserver(mq.get('large').matches);
    this.setPageHeaderVisibleObserver();
    this.setActiveNavItemsObserver();
    this.setHideAnchorOverFullwidthObserver();
  }

  setAnchornavNotSticky() {
    this.ui.container.classList.remove(this.options.stateClasses.stickyAnchornav);
    this.ui.details.setAttribute('open', '');
  }

  setAnchornavSticky() {
    if (!mq.get('large').matches) {
      this.ui.details.removeAttribute('open');
    }
    this.ui.container.classList.add(this.options.stateClasses.stickyAnchornav);
  }

  /**
   * Set intersection observer to toogle whether header is sticky on desktop
   */
  setStickyHeaderObserver(isLarge: boolean) {
    if (this.intersectionObservers.stickyHeader) {
      this.intersectionObservers.stickyHeader.disconnect();
      delete this.intersectionObservers.stickyHeader;
    }

    const elementToObserve: HTMLElement = isLarge
      ? document.querySelector(this.options.domSelectors.wrapper)
      : this.ui.element;
    const anchorNavIsAtTopOfViewport = (entry: IntersectionObserverEntry) => {
      if (isLarge) {
        return entry.boundingClientRect.top < entry.rootBounds.top;
      }
      return entry.boundingClientRect.bottom < entry.rootBounds.bottom;
    };
    const rootMarginTop = isLarge ? this.scrollMarginTop : this.anchorNavOffsetTop;

    // eslint-disable-next-line max-len
    this.intersectionObservers.stickyHeader = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          if (!entry.isIntersecting && anchorNavIsAtTopOfViewport(entry)) {
            this.setAnchornavSticky();
          } else {
            this.setAnchornavNotSticky();
          }
        });
      },
      {
        root: null,
        rootMargin: `-${rootMarginTop}px 0px 0px 0px`,
        threshold: 1,
      }
    );
    this.intersectionObservers.stickyHeader.observe(elementToObserve);
  }

  /**
   * Set intersection observer for page header visibility
   */
  setPageHeaderVisibleObserver() {
    this.intersectionObservers.pageHeaderVisible = new IntersectionObserver(
      (entries) => {
        entries.forEach((headerElement) => {
          if (headerElement.isIntersecting) {
            this.setAnchornavNotSticky();
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px 0px 0px',
        threshold: 0,
      }
    );
    const pageHeaderElement = document.querySelector(this.options.domSelectors.pageHeader);
    this.intersectionObservers.pageHeaderVisible.observe(pageHeaderElement);
  }

  /**
   * Set intersection observer to mark currently visible section as active in the anchor navigation
   */
  setActiveNavItemsObserver() {
    this.intersectionObservers.activeNavItems = new IntersectionObserver(
      (entries) => {
        entries.forEach((anchornavItem) => {
          if (anchornavItem.isIntersecting) {
            const id = anchornavItem.target.getAttribute('id');
            const { activeAnchornavItem } = this.options.stateClasses;
            const anchorItemElements = this.ui.navItems;
            const activeAnchornavItemElement = document.querySelector(
              `.mdl-anchornav__item a[href="#${id}"]`
            );

            anchorItemElements.forEach((anchorItemElement: HTMLAnchorElement) => {
              anchorItemElement.classList.remove(activeAnchornavItem);
            });
            activeAnchornavItemElement.classList.add(activeAnchornavItem);
          }
        });
      },
      {
        root: null,
        rootMargin: '-72px 0px -70% 0px',
        threshold: 0,
      }
    );

    const anchorIdHashes = [];
    this.ui.navItems.forEach((element: HTMLAnchorElement) => {
      anchorIdHashes.push(element.getAttribute('href'));
    });
    anchorIdHashes.forEach((hash) => {
      const id = hash.split('#')[1];
      const navItem = document.querySelector(`[id="${id}"]`);

      if (navItem) {
        this.intersectionObservers.activeNavItems.observe(navItem);
      }
    });
  }

  /**
   * Set intersection observer to toogle visibility of anchornav according to fullwidth elements
   */
  setHideAnchorOverFullwidthObserver() {
    if (this.intersectionObservers.hideAnchorOverFullwidth) {
      this.intersectionObservers.hideAnchorOverFullwidth.disconnect();
      delete this.intersectionObservers.hideAnchorOverFullwidth;
    }

    this.intersectionObservers.hideAnchorOverFullwidth = new IntersectionObserver(
      (entries) => {
        entries.forEach((fullwidthElement) => {
          const fullwidthId = Number(fullwidthElement.target.getAttribute('data-fullwidth-id'));

          if (fullwidthElement.isIntersecting) {
            this.intersectingFullwidthElements.add(fullwidthId);
          } else {
            this.intersectingFullwidthElements.delete(fullwidthId);
          }
        });

        if (this.intersectingFullwidthElements.size > 0) {
          this.ui.container.classList.add(this.options.stateClasses.hiddenAnchornav);
        } else {
          this.ui.container.classList.remove(this.options.stateClasses.hiddenAnchornav);
        }
      },
      {
        root: null,
        rootMargin: `-${this.anchorNavOffsetTop}px 0px -${this.rootMarginBottom}px 0px`,
        threshold: 0,
      }
    );

    document.querySelectorAll(this.options.domSelectors.fullwidthElement).forEach((item, index) => {
      item.setAttribute('data-fullwidth-id', String(index));
      this.intersectionObservers.hideAnchorOverFullwidth.observe(item);
    });
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    const observers = this.intersectionObservers;

    Object.keys(observers).forEach((observerName) => {
      observers[observerName].disconnect();
    });
    super.destroy();
  }
}

export default Anchornav;
