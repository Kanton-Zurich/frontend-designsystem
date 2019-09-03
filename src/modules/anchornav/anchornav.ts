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
import Header from '../header/header';

class Anchornav extends Module {
  public placeholder: HTMLElement;
  public mediumBreakpoint: number;
  public navigationPositionY: number;
  public headerHeight: number;
  public navigationIsFixed: boolean;
  public elementMissing: boolean;
  public navigationHeight: number;
  public scrollReferences: Array<any>;
  public impetusInstance: any;

  public scrollDirection: string;
  public lastYScrollPositon: number;
  public scrollPositonX: number;
  public scrollWidthX: number;
  public mousePositonDown: number;
  public jumpPossible: boolean;
  public isClickEvent: boolean;

  public ui: {
    element: any,
    scrollMask: any,
    scrollContent: any,
    navItems: any,
    navItemActive: any,
    btnRight: any,
    btnLeft: any,
  };

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
      scrollDistance: number,
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
        scrollDistance: 100,
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.navigationIsFixed = false;
    this.elementMissing = false;
    this.headerHeight = 0;
    this.mediumBreakpoint = 840;
    this.lastYScrollPositon = this.getDocumnetScrollPosition();
    this.jumpPossible = true;
    this.isClickEvent = false;

    this.initUi();
    this.cacheNavigationPosition();

    const hasMoreThanOneItem = this.ui.navItems.length !== undefined;

    if (hasMoreThanOneItem) {
      this.cacheAnchorReferences();
      this.updateVerticalScrollInfo();
      this.updateNavigationState();
    }

    if (!this.elementMissing && hasMoreThanOneItem) {
      this.initEventListeners();
      this.updateActiveAnchorState();
      this.initializeImpetus();
      this.syncHorizontalPositon();
    }
  }

  static get events() {
    return {
      isSticky: 'isSticky.anchornav',
      isNotSticky: 'isNotSticky.anchornav',
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate
      .on('mousedown', this.options.domSelectors.navItems, this.onMouseDown.bind(this))
      .on('mouseup', this.options.domSelectors.navItems, this.onMouseUp.bind(this))
      .on('click', this.options.domSelectors.navItems, this.onMouseClick.bind(this))
      .on('scroll', this.options.domSelectors.scrollContent, this.onHorizontalScroll.bind(this))
      .on('click', this.options.domSelectors.btnRight, this.onControlBtnClick.bind(this, 'right'))
      .on('click', this.options.domSelectors.btnLeft, this.onControlBtnClick.bind(this, 'left'));

    (<any>WindowEventListener).addDebouncedResizeListener(this.onResize.bind(this));
    (<any>WindowEventListener).addDebouncedScrollListener(this.onPageDebounceScrolled.bind(this));
    // Necessary for jump.js plugin.
    // Is triggered before the debounced callback.
    (<any>WindowEventListener).addEventListener('scroll', this.onVerticalScroll.bind(this));

    window.addEventListener(Header.events.showHeader, (event) => {
      if (this.navigationIsFixed) {
        this.addHeaderToPlaceHolderHeight((<any>event).detail);
      }
    });

    window.addEventListener(Header.events.hideHeader, this.calcHeight.bind(this));
  }

  /**
   * Page resize callback, responsible for updating all relevant data/positions.
   */
  onResize() {
    this.cacheNavigationPosition();
    this.cacheAnchorReferences();
    this.scrollPositonX = this.ui.scrollContent.scrollLeft;
    this.updateShadows();
    this.updateVerticalScrollInfo();
    this.impetusInstance.setBoundX([-this.getScrollWidth(), 0]);

    if (window.innerWidth < this.mediumBreakpoint) {
      this.impetusInstance.pause();
    } else {
      this.impetusInstance.resume();
    }
  }

  onPageDebounceScrolled() {
    /* this.updateActiveAnchorState(); */
  }

  /**
   * On page scroll. Responsible for the pin-/unpining the anchornav
   */
  onVerticalScroll() {
    this.updateVerticalScrollInfo();
    this.updateNavigationState();
    this.updateActiveAnchorState();
    // If there is scrollspace sync scroll positon
    if (this.getScrollWidth() > 1 && !this.isClickEvent) {
      this.syncHorizontalPositon();
    }
  }

  /**
   * On swipe/scroll on navigation. Updates shadows and buttons
   */
  onHorizontalScroll() {
    this.scrollPositonX = this.ui.scrollContent.scrollLeft;
    this.updateShadows();
  }

  /**
   * Scroll to the active navigation item
   */
  syncHorizontalPositon() {
    const tolerance = this.options.tolerances.swipe;
    let triggerPosition;
    for (let i = 0; i < this.scrollReferences.length; i += 1) {
      const currentItem = this.scrollReferences[i].correspondingAnchor;
      if (currentItem.classList.contains(this.options.stateClasses.activeItemClass)) {
        triggerPosition = this.scrollReferences[i].triggerXPosition - tolerance;
        this.ui.scrollContent.scrollLeft = triggerPosition;
      }
    }
  }

  /**
   * Cache the original Y positon of the anchornav
   */
  cacheNavigationPosition() {
    let navElement;
    if (this.navigationIsFixed) {
      navElement = this.placeholder;
    } else {
      navElement = this.ui.scrollMask;
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

    for (let i = 0; i < this.ui.navItems.length; i += 1) {
      const selectorString = `[id="${this.ui.navItems[i].dataset.href}"]`;
      const element = document.querySelector(selectorString);
      if (element === null) {
        this.elementMissing = true;
      }
      element.setAttribute('tabindex', '-1');
      const itemLeft = Math.abs(this.ui.navItems[i].getBoundingClientRect().left);
      const hTriggerPos = itemLeft - this.ui.scrollContent.getBoundingClientRect().left;
      if (element !== null) {
        this.scrollReferences.push({
          correspondingAnchor: this.ui.navItems[i],
          triggerElement: element,
          triggerXPosition: hTriggerPos,
        });
      }
    }

    if (!this.elementMissing) {
      // Needs to be calculated seperate in case of exceeding posible scroll distance
      this.calculateTriggerPositions();
    }
  }

  /**
   * Calculate the trigger Y-coordinate and catch the case
   * if the position exceeds the scrollable space
   */
  calculateTriggerPositions() {
    const scrollMax = document.body.offsetHeight - window.innerHeight - this.navigationHeight;
    let foundExceed = false;
    let exceedCounter = 0;
    let exceedIndex = 0;
    let lastFittingTriggerPosition = 0;
    let evenDistances = 0;

    for (let i = 0; i < this.scrollReferences.length; i += 1) {
      const currentItem = this.scrollReferences[i];
      const currentTriggerPosition = this.getPageYPositionFor(currentItem.triggerElement);
      this.scrollReferences[i].triggerYPosition = currentTriggerPosition - this.navigationHeight;

      if ((currentTriggerPosition + window.innerHeight) > scrollMax && !foundExceed) {
        // Get the count for the exceeding anchors but include the last fitting anchor
        // to spread even the space after his last Y position
        exceedCounter = this.scrollReferences.length - i + 1;
        exceedIndex = i - 1;
        foundExceed = true;

        lastFittingTriggerPosition = this.scrollReferences[exceedIndex].triggerYPosition;
        evenDistances = (scrollMax - lastFittingTriggerPosition) / exceedCounter;
      }
    }

    // Handling exceed
    if (foundExceed) {
      // First item exceed already the scrolling possibility,
      // so spread evenly from zero downwards
      if (exceedIndex === 0) {
        evenDistances = scrollMax / exceedCounter;
        lastFittingTriggerPosition = 0;
      }

      // Later or last item exceed scrolling possibility,
      // so spread evenly from the bottom with even distances
      for (let i = (this.scrollReferences.length - 1); i >= exceedIndex; i -= 1) {
        if (i === this.scrollReferences.length - 1) {
          lastFittingTriggerPosition = scrollMax;
          this.scrollReferences[i].triggerYPosition = lastFittingTriggerPosition;
        } else {
          lastFittingTriggerPosition -= evenDistances;
          this.scrollReferences[i].triggerYPosition = lastFittingTriggerPosition;
        }
      }
    }
  }

  /**
   * Sets the scroll direction
   */
  updateVerticalScrollInfo() {
    const currentScrollPosition = this.getDocumnetScrollPosition();
    if (currentScrollPosition > this.lastYScrollPositon) {
      this.scrollDirection = 'down';
    } else {
      this.scrollDirection = 'up';
    }
    this.lastYScrollPositon = currentScrollPosition;
  }

  /**
   * Handles pin/unpin of the navigation
   */
  updateNavigationState() {
    // + this.headerHeight
    const currentScrollPosition = this.getDocumnetScrollPosition() + this.headerHeight;
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

  /**
   * Handles the active state of the anchornav items base on the scroll Y position
   */
  updateActiveAnchorState() {
    const scrollMax = document.body.offsetHeight - window.innerHeight;
    const currentScrollPosition = this.getDocumnetScrollPosition();
    let navItem;

    if (this.scrollDirection === 'down') {
      for (let i = 0; i < this.scrollReferences.length; i += 1) {
        const currentItem = this.scrollReferences[i];
        const triggerY = (<any> currentItem).triggerYPosition;

        let nextItemLowerPos;
        const nextIndex = i + 1;

        if (nextIndex < this.scrollReferences.length) {
          nextItemLowerPos = this.scrollReferences[nextIndex].triggerYPosition;
        } else {
          nextItemLowerPos = scrollMax;
        }

        // Normal downwards toggling
        if (currentScrollPosition >= triggerY && currentScrollPosition <= nextItemLowerPos) {
          navItem = (<any> currentItem).correspondingAnchor;
        }
      }
    } else if (this.scrollDirection === 'up') {
      for (let i = this.scrollReferences.length - 1; i >= 0; i -= 1) {
        const currentItem = this.scrollReferences[i];
        const triggerY = (<any> currentItem).triggerYPosition;


        let nextItemUpperMargin;
        let previousIndex = i - 1;

        if (previousIndex > 0) {
          nextItemUpperMargin = this.scrollReferences[previousIndex].triggerYPosition;
        } else {
          nextItemUpperMargin = triggerY - this.headerHeight;
          previousIndex = i;
        }
        // Normal upwards toggling
        if (currentScrollPosition <= triggerY
          && currentScrollPosition >= nextItemUpperMargin) {
          navItem = this.scrollReferences[previousIndex].correspondingAnchor;
        }
      }
    }

    // Capture the case if fast scrolling to the very top
    if (currentScrollPosition < (<any> this.scrollReferences[1]).triggerYPosition) {
      navItem = this.scrollReferences[0].correspondingAnchor;
    }
    // This case needs to be catched because of reinitialization
    const maxIndex = this.scrollReferences.length - 1;
    if (currentScrollPosition >= this.scrollReferences[maxIndex].triggerYPosition) {
      navItem = this.scrollReferences[maxIndex].correspondingAnchor;
    }
    this.toggleActiveNavigationItemClass(navItem);
  }

  /**
   * Updates shadow and button class states corresponding to the scrollX positon
   */
  updateShadows() {
    const scrollSpace = this.getScrollWidth();
    const rightClass = this.options.stateClasses.shadowRight;
    const leftClass = this.options.stateClasses.shadowLeft;
    const showBtnClass = this.options.stateClasses.showButton;
    const leftButton = this.ui.btnLeft;
    const rightButton = this.ui.btnRight;
    const scrollParent = this.ui.scrollMask;
    const tolerance = this.options.tolerances.showButton;
    const scrollX = Math.abs(this.scrollPositonX);

    // Can be refactored by using one top level container class
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
      source: this.ui.scrollContent,
      boundX: [-(this.getScrollWidth()), 0],
      bounce: false,
      multiplier: 2,
      friction: 0,
      update: this.impetusUpdate.bind(this),
    });

    if (window.innerWidth < this.mediumBreakpoint) {
      // If init in mobile/table pause impetus
      this.impetusInstance.pause();
    } else {
      this.impetusInstance.resume();
    }
  }

  /**
   * Get the posible translation offset of the scrollable content
   *
   * @return {number}
   */
  getScrollWidth():number {
    // IE11 do not work correctly with getBoundingClientRect
    const scrollAreaWidth = this.ui.scrollContent.scrollWidth;

    const ParentOffsetWidth = this.ui.scrollMask.getBoundingClientRect().width;
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
    this.ui.scrollContent.scrollLeft = Math.abs(x);
  }

  /**
   * Remove the active class from the last active element
   * an apply it to the given target parameter
   *
   * @param target
   */
  toggleActiveNavigationItemClass(target) {
    this.ui.navItemActive.removeAttribute('aria-selected');
    this.ui.navItemActive.classList.remove(this.options.stateClasses.activeItemClass);
    target.classList.add(this.options.stateClasses.activeItemClass);
    this.ui.navItemActive = target;
    this.ui.navItemActive.setAttribute('aria-selected', 'true');
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

    this.calcHeight();

    this.ui.element.parentNode.insertBefore(this.placeholder, this.ui.element);
  }

  calcHeight() {
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
  }

  addHeaderToPlaceHolderHeight(headerHeight) {
    const currentHeight = this.placeholder.getBoundingClientRect().height;

    this.placeholder.style.height = `${currentHeight + headerHeight}px`;
  }

  /**
   * Add stickyMode class to the anchornav and show placeholder
   */
  pinNavigation() {
    this.ui.element.classList.add(this.options.stateClasses.stickyMode);
    this.placeholder.style.display = 'block';

    window.dispatchEvent(new CustomEvent(Anchornav.events.isSticky));
  }

  /**
   * Removed stickyMode class from anchornav and hide placeholder
   */
  unpinNavigation() {
    this.ui.element.classList.remove(this.options.stateClasses.stickyMode);
    this.placeholder.style.display = 'none';

    window.dispatchEvent(new CustomEvent(Anchornav.events.isNotSticky));
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


    const headerElement = document.querySelector('.mdl-header');
    if (headerElement !== null) {
      this.headerHeight = headerElement.getBoundingClientRect().height;
    }
    return elementTop + scrollTop + this.headerHeight;
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

    // Stop event if the delta is to big
    const mouseEventDelta = event.screenX - this.mousePositonDown;
    const swipeTolerance = this.options.tolerances.swipe;

    if (mouseEventDelta < swipeTolerance && mouseEventDelta > -(swipeTolerance)) {
      this.isClickEvent = true;
    } else {
      return false;
    }

    let jumpToPosition;
    // Get the trigger coordinates for a standart click jump
    for (let i = 0; i < this.scrollReferences.length; i += 1) {
      if ((<any> this.scrollReferences)[i].correspondingAnchor === target) {
        jumpToPosition = this.scrollReferences[i].triggerYPosition - this.lastYScrollPositon;
        if (i !== this.scrollReferences.length) {
          jumpToPosition += this.options.tolerances.jumpToMargin;
        }
      }
    }

    if (this.jumpPossible && this.isClickEvent) {
      this.jumpPossible = false;
      this.moveToAnchor(jumpToPosition);
    }
    return true;
  }

  /**
   * Handle control button click events
   * @param data<string> ("left" / "right")
   */
  onControlBtnClick(data) {
    if (data === 'right') {
      (<any> this.ui).scrollContent.scrollLeft += 10;
      this.animatedButtonScroll(this.ui.scrollContent,
        (this.ui.scrollContent.scrollLeft + 100),
        data, 100);
    } else {
      this.animatedButtonScroll(this.ui.scrollContent,
        (this.ui.scrollContent.scrollLeft - 100),
        data, 100);
    }
  }

  /**
   * Recursive animation loop for softer button scrolling
   *
   * @param element
   * @param to
   * @param dir
   * @param duration
   */
  animatedButtonScroll(element, to, dir, duration) {
    if (duration <= 0) return;
    setTimeout(this.animationTimeout.bind(this, element, to, dir, duration), 1);
  }

  animationTimeout(element, to, dir, duration) {
    const durationReduce = 20;

    if (dir === 'right') {
      element.scrollLeft += this.options.tolerances.scrollDistance;
    } else {
      element.scrollLeft -= this.options.tolerances.scrollDistance;
    }

    this.animatedButtonScroll(element, to, dir, duration - durationReduce);
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

  /**
   * Toggles the jump.js plugin flag
   */
  toggleJumpFlag() {
    this.scrollReferences.forEach((item, index) => {
      if (item.correspondingAnchor === this.ui.navItemActive) {
        item.triggerElement.focus();
      }
    });
    this.jumpPossible = !this.jumpPossible;
    this.isClickEvent = false;
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
