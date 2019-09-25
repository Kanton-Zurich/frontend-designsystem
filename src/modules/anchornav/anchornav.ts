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
  public activeIndex: number;
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
  public isKeyEvent: boolean;

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
        showButton: 10,
        swipe: 10,
        scrollDistance: 100,
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.navigationIsFixed = false;
    this.elementMissing = false;
    this.headerHeight = 0;
    this.activeIndex = 0;
    this.mediumBreakpoint = 840;
    this.lastYScrollPositon = this.getDocumnetScrollPosition();
    this.jumpPossible = true;
    this.isClickEvent = false;
    this.isKeyEvent = false;

    this.initUi();
    this.cacheNavigationPosition();

    const hasMoreThanOneItem = this.ui.navItems.length > 1;
    if (hasMoreThanOneItem) {
      this.cacheAnchorReferences();
      this.updateVerticalScrollInfo();
      this.updateNavigationState();
      if (this.scrollReferences.length > 0) {
        const currentScrollPosition = this.getDocumnetScrollPosition();
        let navItem;

        for (let i = 0; i < this.scrollReferences.length; i += 1) {
          const currentItem = this.scrollReferences[i];
          const triggerY = currentItem.triggerYPosition;

          if (this.scrollDirection === 'down') {
            if (currentScrollPosition >= triggerY) {
              navItem = (<any> currentItem).correspondingAnchor;
            }
          } else if (this.scrollDirection === 'up') {
            if (currentScrollPosition <= triggerY) {
              navItem = (<any> currentItem).correspondingAnchor;
              i = this.scrollReferences.length; // Stop for loop
            }
          }
        }
        if (this.ui.navItemActive !== navItem && navItem !== undefined) {
          this.toggleActiveNavigationItemClass(navItem);
        }
      }
      this.initializeImpetus();
      this.syncHorizontalPositon();
    }

    this.initEventListeners();
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
      .on('keypress', this.options.domSelectors.navItems, this.onKeypress.bind(this))
      .on('scroll', this.options.domSelectors.scrollContent, this.onHorizontalScroll.bind(this))
      .on('click', this.options.domSelectors.btnRight, this.onControlBtnClick.bind(this, 'right'))
      .on('click', this.options.domSelectors.btnLeft, this.onControlBtnClick.bind(this, 'left'));

    (<any>WindowEventListener).addDebouncedResizeListener(this.onResize.bind(this));
    // Necessary for jump.js plugin.
    // Is triggered before the debounced callback.
    (<any>WindowEventListener).addEventListener('scroll', this.onPageScroll.bind(this));

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
    this.updateActiveAnchorState();

    this.impetusInstance.setBoundX([-this.getScrollWidth(), 0]);

    if (window.innerWidth < this.mediumBreakpoint) {
      this.impetusInstance.pause();
    } else {
      this.impetusInstance.resume();
    }
  }

  /**
   * On page scroll. Responsible for the pin-/unpining the anchornav
   */
  onPageScroll() {
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
    this.navigationPositionY = this.getPageYPositionFor(navElement) - this.headerHeight;
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
        this.ui.navItems[i].style.display = 'none';
      }
      const itemLeft = Math.abs(this.ui.navItems[i].getBoundingClientRect().left);
      const hTriggerPos = itemLeft - this.ui.scrollContent.getBoundingClientRect().left;
      if (element !== null) {
        element.setAttribute('tabindex', '-1');
        this.scrollReferences.push({
          correspondingAnchor: this.ui.navItems[i],
          triggerElement: element,
          triggerXPosition: hTriggerPos,
        });
      }
    }

    this.calculateTriggerPositions();
  }

  /**
   * Calculate the trigger Y-coordinate and catch the case
   * if the position exceeds the scrollable space
   */
  calculateTriggerPositions() {
    const scrollMax = document.body.offsetHeight - window.innerHeight + this.headerHeight;
    let foundExceed = false;
    let exceedCounter = 0;
    let exceedIndex = 0;
    let lastFittingTriggerPosition = 0;
    let evenDistances = 0;

    for (let i = 0; i < this.scrollReferences.length; i += 1) {
      const currentItem = this.scrollReferences[i];
      let currentTriggerPosition = this.getPageYPositionFor(currentItem.triggerElement);
      currentTriggerPosition -= this.navigationHeight;
      this.scrollReferences[i].triggerYPosition = currentTriggerPosition;

      if ((currentTriggerPosition + window.innerHeight) > scrollMax && !foundExceed) {
        // Get the count for the exceeding anchors but include the last fitting anchor
        // to spread even the space after his last Y position
        exceedCounter = this.scrollReferences.length - i;
        exceedIndex = i;
        foundExceed = true;
        const overflow = (currentTriggerPosition + window.innerHeight) - scrollMax;
        lastFittingTriggerPosition = this.scrollReferences[i].triggerYPosition - overflow;
        evenDistances = Math.round((scrollMax - lastFittingTriggerPosition) / exceedCounter);
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
      const maxIndex = this.scrollReferences.length - 1;
      for (let i = maxIndex; i >= exceedIndex; i -= 1) {
        if (i === maxIndex) {
          lastFittingTriggerPosition = scrollMax;
        } else {
          lastFittingTriggerPosition -= evenDistances;
        }
        this.scrollReferences[i].triggerYPosition = lastFittingTriggerPosition;
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

  /**
   * Handles the active state of the anchornav items base on the scroll Y position
   */
  updateActiveAnchorState() {
    const currentScrollPosition = this.getDocumnetScrollPosition();
    let navItem;

    for (let i = 0; i < this.scrollReferences.length; i += 1) {
      const currentItem = this.scrollReferences[i];
      const triggerY = currentItem.triggerYPosition;

      if (this.scrollDirection === 'down') {
        if (currentScrollPosition >= triggerY && i > this.activeIndex) {
          navItem = (<any> currentItem).correspondingAnchor;
        }
      } else if (this.scrollDirection === 'up') {
        if (currentScrollPosition <= triggerY && i < this.activeIndex) {
          navItem = (<any> currentItem).correspondingAnchor;
          i = this.scrollReferences.length - 1; // Stop the loop on the first match
        }
      }
    }
    if (this.ui.navItemActive !== navItem && navItem !== undefined) {
      this.toggleActiveNavigationItemClass(navItem);
    }
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

    this.scrollReferences.forEach((item, index) => {
      if (item.correspondingAnchor === target) {
        this.activeIndex = index;
      }
    });
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
   *
   * @param event
   */
  onKeypress(event) {
    this.isKeyEvent = true;
    const { target } = event;

    this.moveToAnchor(target);
  }

  /**
   *
   * @param element
   * @return {number}
   */
  getYDistanceTo(element: any): number {
    let distance = 0;
    // Get the trigger coordinates for a standart click jump
    for (let i = 0; i < this.scrollReferences.length; i += 1) {
      if ((<any> this.scrollReferences)[i].correspondingAnchor === element) {
        distance = Math.round(this.scrollReferences[i].triggerYPosition
          - this.lastYScrollPositon);

        if (distance < 0) {
          // Jump upwards
          this.scrollDirection = 'up';
          distance -= (this.headerHeight);
        } else {
          // Jump downwards
          this.scrollDirection = 'down';
          distance += (this.headerHeight);
        }
      }
    }
    return distance;
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
      this.moveToAnchor(target);
    }
  }

  /**
   * Handle control button click events
   * @param data<string> ("left" / "right")
   */
  onControlBtnClick(data) {
    this.scrollHorizontal(this.ui.scrollContent, data, 10, 100, 10);
  }

  scrollHorizontal(element,direction,step ,distance, speed){
    let scrollAmount = 0;

    let scrollIntervalID = setInterval(() => {
      if(direction == 'left'){
        element.scrollLeft -= step;
      } else {
        element.scrollLeft += step;
      }
      scrollAmount += step;

      if(scrollAmount >= distance){
        clearInterval(scrollIntervalID);
      }
    }, speed);
  }

  /**
   * Launches the jump.js plugin to move to the given position on the page
   *
   * @param target<any>
   */
  moveToAnchor(target) {
    const jumpToPosition = this.getYDistanceTo(target);

    if (this.jumpPossible) {
      this.jumpPossible = false;
      jump((jumpToPosition), {
        callback: this.toggleJumpFlag.bind(this),
      });
    }
  }

  /**
   * Toggles the jump.js plugin flag
   */
  toggleJumpFlag() {
    this.scrollReferences.forEach((item) => {
      if (item.correspondingAnchor === this.ui.navItemActive
        && this.isKeyEvent) {
        item.triggerElement.focus();
        this.isKeyEvent = false;
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
