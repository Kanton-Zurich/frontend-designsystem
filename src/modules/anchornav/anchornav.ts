import Impetus from 'impetus';
import jump from 'jump.js';
import WindowEventListener from '../../assets/js/helpers/events';
/*!
 * Anchornav
 *
 * schatten fragment
 * button shhow/hide issue
 * to less space at the bottom issue
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class Anchornav extends Module {
  public placeholder: HTMLElement;
  public mediumBreakpoint: number;
  public navigationPositionY: number;
  public navigationIsFixed: boolean;
  public navigationHeight: number;
  public scrollReferences: Array<object>;
  public impetusInstance: object;

  public scrollDirection: string;
  public lastYScrollPositon: number;
  public scrollPositonX: number;
  public scrollWidthX: number;
  public mousePositonDown: number;
  public jumpPossible: boolean;

  public options: {
    domSelectors: {
      scrollAreaWrapper: string,
      scrollContent: string,
      navItems: string,
      navItemActive: string,
      btnRight: string,
      btnLeft: string,
    },
    stateClasses: {
      stickyMode: string,
      activeItemClass: string,
      shadowRight: string,
      shadowLeft: string,
      showButton: string,
    },
    tolerances: {
      jumpToMargin: number,
      showButton: number,
      swipe: number,
    }
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        scrollMask: '.mdl-anchornav__list-wrapper',
        scrollContent: '.mdl-anchornav__list',
        navItems: '.mdl-anchornav__list .atm-anchorlink',
        navItemActive: '.mdl-anchornav__list .atm-anchorlink--active',
        btnRight: '.mdl-anchornav__ctrl--right button',
        btnLeft: '.mdl-anchornav__ctrl--left button',
      },
      stateClasses: {
        stickyMode: 'mdl-anchornav--sticky',
        activeItemClass: 'atm-anchorlink--active',
        shadowRight: 'mdl-anchornav__list-wrapper--shadow-right',
        shadowLeft: 'mdl-anchornav__list-wrapper--shadow-left',
        showButton: 'visible',
      },
      tolerances: {
        jumpToMargin: 5,
        showButton: 10,
        swipe: 10,
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.navigationIsFixed = false;
    this.mediumBreakpoint = 840;
    this.lastYScrollPositon = this.getDocumnetScrollPosition();
    this.jumpPossible = true;

    this.initUi();
    this.cacheNavigationPosition();
    this.cacheAnchorReferences();
    this.updateVerticalScrollInfo();
    this.updateNavigationState();

    if (this.scrollReferences.length > 0) {
      this.initEventListeners();
      this.updateActiveAnchorState();
      this.initializeImpetus();
    }
  }

  static get events() {
    return {
      // eventname: `eventname.${ Anchornav.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate
      .on('mousedown', (<any> this.options).domSelectors.navItems, this.onMouseDown.bind(this))
      .on('mouseup', (<any> this.options).domSelectors.navItems, this.onMouseUp.bind(this))
      .on('click', (<any> this.options).domSelectors.navItems, this.onMouseClick.bind(this))
      .on('scroll', (<any> this.options).domSelectors.scrollContent, this.onHorizontalScroll.bind(this))
      .on('click', (<any> this.options).domSelectors.btnRight, this.onControlBtnClick.bind(this, 'right'))
      .on('click', (<any> this.options).domSelectors.btnLeft, this.onControlBtnClick.bind(this, 'left'));

    (<any>WindowEventListener).addDebouncedResizeListener(this.onResize.bind(this));
    (<any>WindowEventListener).addDebouncedScrollListener(this.onPageDebounceScrolled.bind(this));
    // Necessary for jump.js plugin and triggered before the debounced callback
    (<any>WindowEventListener).addEventListener('scroll', this.onVerticalScroll.bind(this));
  }

  onResize() {
    this.cacheNavigationPosition();
    this.cacheAnchorReferences();
    this.scrollPositonX = (<any> this.ui).scrollContent.scrollLeft;
    this.updateShadows();
    this.updateVerticalScrollInfo();
    (<any> this.impetusInstance).setBoundX([-this.getScrollWidth(), 0]);

    if(window.innerWidth < this.mediumBreakpoint) {
      (<any> this.impetusInstance).pause();
    } else {
      (<any> this.impetusInstance).resume();
    }
  }

  onPageDebounceScrolled() {
    /*this.updateActiveAnchorState();*/
  }

  /**
   * Plain scroll callback. Responsible for the pin-/unpining the anchornav
   */
  onVerticalScroll() {
    this.updateVerticalScrollInfo();
    this.updateNavigationState();
    this.updateActiveAnchorState();
  }

  onHorizontalScroll() {
    this.scrollPositonX = (<any> this.ui).scrollContent.scrollLeft;
    this.updateShadows();
  }

  /**
   * Cache the original Y positon of the anchornav
   */
  cacheNavigationPosition() {
    let navElement;
    if (this.navigationIsFixed) {
      navElement = this.placeholder;
    } else {
      // navElement = (<any> this.ui).scrollContent;
      navElement = (<any> this.ui).scrollMask;
    }
    this.navigationHeight = this.ui.element.getBoundingClientRect().height;
    this.navigationPositionY = this.getPageYPositionFor(navElement);
  }

  /**
   * Creates an object array containing the trigger Y coordinates
   * with the corresponding anchorNav-item
   */
  cacheAnchorReferences() {
    this.scrollReferences = [];
    for (let i = 0; i < (<any> this.ui).navItems.length; i += 1) {
      const element = document.querySelector((<any> this.ui).navItems[i].dataset.href);

      if (element !== null) {
        this.scrollReferences.push({
          correspondingAnchor: (<any> this.ui).navItems[i],
          triggerElement: element,
        });
      }
    }

    if (this.scrollReferences.length > 0) {
      // Needs to be calculated seperate in case of exceeding posible scroll distance
      this.calculateTriggerPositions();
    }
  }

  calculateTriggerPositions() {
    const scrollMax = document.body.offsetHeight - window.innerHeight;
    let foundExceed = false;
    let exceedCounter = 0;
    let exceedIndex = 0;
    let lastFittingTriggerPosition = 0;
    let evenDistances = 0;

    for (let i = 0; i < this.scrollReferences.length; i += 1) {
      const currentItem = this.scrollReferences[i];
      const currentTriggerPosition = this.getPageYPositionFor((<any> currentItem).triggerElement);
      (<any> currentItem).triggerYPosition = currentTriggerPosition - (this.navigationHeight);
      if (currentTriggerPosition > scrollMax && !foundExceed) {
        exceedCounter = this.scrollReferences.length - i;
        exceedIndex = i;
        foundExceed = true;
        lastFittingTriggerPosition = (<any> this.scrollReferences)[exceedIndex - 1].triggerYPosition;
        evenDistances = (scrollMax - lastFittingTriggerPosition) / exceedCounter;
      }
    }

    for (let i = exceedIndex; i < this.scrollReferences.length; i += 1) {
      const currentItem = this.scrollReferences[i];
      (<any> currentItem).triggerYPosition = Math.round(lastFittingTriggerPosition + evenDistances);
      lastFittingTriggerPosition += evenDistances;
    }
  }

  updateVerticalScrollInfo() {
    const currentScrollPosition = this.getDocumnetScrollPosition();

    if (currentScrollPosition > this.lastYScrollPositon) {
      this.scrollDirection = 'down';
    } else {
      this.scrollDirection = 'up';
    }
    this.lastYScrollPositon = currentScrollPosition;
  }

  updateNavigationState() {
    const currentScrollPosition = this.getDocumnetScrollPosition();
    const scrollSpace = this.getScrollWidth();

    const pinPos = this.navigationPositionY;

    if (this.placeholder === undefined) {
      this.createPlaceholder();
    }

    // Handle sticky nav
    if (currentScrollPosition >= pinPos && !this.navigationIsFixed) {
      this.pinNavigation();
      this.navigationIsFixed = true;
    } else if (currentScrollPosition <= pinPos && this.navigationIsFixed) {
      this.unpinNavigation();
      this.navigationIsFixed = false;
    }
    if (scrollSpace > 1) {
      this.scrollPositonX = (<any> this.ui).scrollContent.scrollLeft;
      this.updateShadows();
    }
  }

  updateActiveAnchorState() {
    const currentScrollPosition = this.getDocumnetScrollPosition();

    if (this.scrollDirection === 'down') {
      for (let i = 0; i < this.scrollReferences.length; i += 1) {
        const currentItem = this.scrollReferences[i];
        const triggerY = (<any> currentItem).triggerYPosition;

        let nextItemUpperMargin;
        let nextIndex = i + 1;

        if (nextIndex < this.scrollReferences.length) {
          nextItemUpperMargin = (<any> this.scrollReferences[nextIndex]).triggerYPosition;
        } else {
          nextItemUpperMargin = triggerY;
          nextIndex = 1;
        }

        if (currentScrollPosition >= triggerY && currentScrollPosition <= nextItemUpperMargin) {
          this.toggleActiveNavigationItemClass((<any> currentItem).correspondingAnchor);
        }
      }
    } else if (this.scrollDirection === 'up') {
      for (let i = this.scrollReferences.length - 1; i >= 0; i -= 1) {
        const currentItem = this.scrollReferences[i];
        const triggerY = (<any> currentItem).triggerYPosition;


        let nextItemUpperMargin;
        let previousIndex = i - 1;
        if (previousIndex >= 0) {
          nextItemUpperMargin = (<any> this.scrollReferences[previousIndex]).triggerYPosition;
        } else {
          nextItemUpperMargin = triggerY;
          previousIndex = i;
        }

        if (currentScrollPosition <= triggerY && currentScrollPosition >= nextItemUpperMargin) {
          this.toggleActiveNavigationItemClass((<any> this.scrollReferences[previousIndex]).correspondingAnchor);
        }
        if (currentScrollPosition < (<any> this.scrollReferences[1]).triggerYPosition) {
          this.toggleActiveNavigationItemClass((<any> this.scrollReferences[0]).correspondingAnchor);
        }

        // This case needs to be catched beauce of reinitialization
        const maxIndex = this.scrollReferences.length - 1;
        if (currentScrollPosition === (<any> this.scrollReferences[maxIndex]).triggerYPosition) {
          this.toggleActiveNavigationItemClass((<any> this.scrollReferences[maxIndex]).correspondingAnchor);
        }

      }
    }
  }

  updateShadows() {
    const scrollSpace = this.getScrollWidth();
    const rightClass = this.options.stateClasses.shadowRight;
    const leftClass = this.options.stateClasses.shadowLeft;
    const showBtnClass = this.options.stateClasses.showButton;
    const leftButton = (<any> this.ui).btnLeft;
    const rightButton = (<any> this.ui).btnRight;
    const scrollParent = (<any> this.ui).scrollMask;
    const tolerance = this.options.tolerances.showButton;
    const scrollX = Math.abs(this.scrollPositonX);

    if (scrollX >= 0 && scrollX <= tolerance) {
      scrollParent.classList.add(rightClass);
      rightButton.classList.add(showBtnClass);
      scrollParent.classList.remove(leftClass);
      leftButton.classList.remove(showBtnClass);
    } else if (scrollX < scrollSpace
      && scrollX >= (scrollSpace - tolerance)) {
      scrollParent.classList.remove(rightClass);
      rightButton.classList.remove(showBtnClass);
      scrollParent.classList.add(leftClass);
      leftButton.classList.add(showBtnClass);
    } else if (scrollX > tolerance
      && scrollX < (scrollSpace - tolerance)) {
      scrollParent.classList.add(rightClass);
      rightButton.classList.add(showBtnClass);
      scrollParent.classList.add(leftClass);
      leftButton.classList.add(showBtnClass);
    }

    if (scrollSpace <= 1) {
      scrollParent.classList.remove(rightClass);
      rightButton.classList.remove(showBtnClass);
      scrollParent.classList.remove(leftClass);
      leftButton.classList.remove(showBtnClass);
    }
  }

  /**
   * Initialize the impetus instance
   */
  initializeImpetus() {
    this.impetusInstance = new Impetus({
      source: (<any> this.ui).scrollContent,
      boundX: [-(this.getScrollWidth()), 0],
      bounce: false,
      multiplier: 2,
      friction: 0,
      update: this.impetusUpdate.bind(this),
    });

    if(window.innerWidth < this.mediumBreakpoint) {
      (<any> this.impetusInstance).pause();
    } else {
      (<any> this.impetusInstance).resume();
    }
  }

  /**
   * Get the posible translation offset of the scrollable content
   *
   * @return {number}
   */
  getScrollWidth():number {
    // IE11 do not work correctly with getBoundingClientRect
    const scrollAreaWidth = (<any> this.ui).scrollContent.scrollWidth;

    const ParentOffsetWidth = (<any> this.ui).scrollMask.getBoundingClientRect().width;
    const scrollableWidth = (ParentOffsetWidth - scrollAreaWidth);

    this.scrollWidthX = Math.abs(scrollableWidth);
    return Math.abs(scrollableWidth);
  }

  /**
   * Update callback from impetus plugin
   *
   * @param x
   */
  impetusUpdate(x) {
    (<any> this.ui).scrollContent.scrollLeft = Math.abs(x);
  }

  /**
   * Remove the active class from the last active element
   * an apply it to the given target parameter
   *
   * @param target
   */
  toggleActiveNavigationItemClass(target) {
    (<any> this.ui).navItemActive.classList.remove(this.options.stateClasses.activeItemClass);
    target.classList.add(this.options.stateClasses.activeItemClass);
    (<any> this.ui).navItemActive = target;
  }

  /**
   * Get the current positive scroll position of the document
   *
   * @return {number}
   */
  getDocumnetScrollPosition():number {
    return Math.abs(document.documentElement.getBoundingClientRect().top);
  }

  /**
   * Create and insert the placeholder div with the same height as the whole anchorNav
   */
  createPlaceholder() {
    this.placeholder = document.createElement('div');

    // Style definition from figma layout
    const smallMargin = 40;
    const bigMargin = 56;
    let marginBottom;

    if (window.innerWidth > this.mediumBreakpoint) {
      marginBottom = bigMargin;
    } else {
      marginBottom = smallMargin;
    }
    this.placeholder.style.height = `${(this.ui.element.getBoundingClientRect().height + marginBottom)}px`;
    this.placeholder.style.display = 'none';

    this.ui.element.parentNode.insertBefore(this.placeholder, this.ui.element);
  }

  /**
   * Add stickyMode class to the anchornav and show placeholder
   */
  pinNavigation() {
    this.ui.element.classList.add(this.options.stateClasses.stickyMode);
    this.placeholder.style.display = 'block';
  }

  /**
   * Removed stickyMode class from anchornav and hide placeholder
   */
  unpinNavigation() {
    this.ui.element.classList.remove(this.options.stateClasses.stickyMode);
    this.placeholder.style.display = 'none';
  }

  /**
   * Get the page top distance for the given element
   *
   * @param element
   * @return {number}
   */
  getPageYPositionFor(element): number {
    const elementTop = element.getBoundingClientRect().top;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return elementTop + scrollTop;
  }

  /**
   * Mousedown-Callback on navigation anchors.
   * Store initial click position to differentiate click and swipe in mouseup event
   * @param event
   */
  onMouseDown(event) {
    this.mousePositonDown = event.screenX;
  }

  /**
   * Click-Callback on navigation anchors.
   * Only nessesary to prevent standart behavior
   */
  onMouseClick() {
    return false;
  }

  /**
   * On Mouse up callback
   * Checks the mouse down/up delta to decide if its a swipe or a click.
   *
   * @param event
   */
  onMouseUp(event) {
    const { target } = event;
    let tmpPos;
    // Stop event if the delta is to big
    const mouseEventDelta = event.screenX - this.mousePositonDown;
    let isClickEvent = false;
    let swipeTolerance = this.options.tolerances.swipe;

    if (mouseEventDelta < swipeTolerance && mouseEventDelta > -(swipeTolerance)) {
      isClickEvent = true;
    } else {
      return false;
    }

    // Get the trigger coordinates for a standart click jump
    for (let i = 0; i < this.scrollReferences.length; i += 1) {
      if ((<any> this.scrollReferences)[i].correspondingAnchor === target) {
        tmpPos = (<any> this.scrollReferences)[i].triggerYPosition - this.lastYScrollPositon;
        if (i !== this.scrollReferences.length) {
          tmpPos += this.options.tolerances.jumpToMargin;
        }
      }
    }
    if (this.jumpPossible) {
      this.toggleJumpFlag();
      this.moveToAnchor(tmpPos);
    }
  }

  onControlBtnClick(data) {
    for (let i = 0; i < 10; i += 1) {
      if (data === 'right') {
        (<any> this.ui).scrollContent.scrollLeft += 10;
        this.animatedButtonScroll((<any> this.ui).scrollContent, ((<any> this.ui).scrollContent.scrollLeft + 100), data, 100);
      } else {
        this.animatedButtonScroll((<any> this.ui).scrollContent, ((<any> this.ui).scrollContent.scrollLeft - 100), data, 100);
      }
    }
  }

  animatedButtonScroll(element, to, dir, duration) {
    if (duration <= 0) return;

    setTimeout(function() {
      if (dir === 'right') {
        element.scrollLeft += 100;
      } else {
        element.scrollLeft -= 100;
      }

      this.animatedButtonScroll(element, to, dir, duration -20);
    }.bind(this), 1);
  }

  /**
   * Launches the jump.js plugin to move to the given position on the page
   *
   * @param position<number>
   */
  moveToAnchor(position) {
    jump((position), {
      callback: this.toggleJumpFlag.bind(this),
    });
  }

  toggleJumpFlag() {
    this.jumpPossible = !this.jumpPossible;
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default Anchornav;
