import Impetus from 'impetus';
import jump from 'jump.js';
import WindowEventListener from '../../assets/js/helpers/events';
/*!
 * Anchornav
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class Anchornav extends Module {
  public placeholder: HTMLElement;
  public pageAnchors: Array<object>;
  public originalNavPosition: number;
  public activeStateScrollTolerance: number;
  public jumpToTolerance: number;
  public navigationIsFixed: boolean;
  public impetusInstance: object;
  public mousePositionOnDown: number;
  public swipeTolerance: number;
  public showButtonTolerance: number;
  public navPositionHorizontal: number;
  public navScrollSpaceHorizontal: number;
  public invisibleScrollIndex: number;
  public documentHeight: number;
  public containsExceedingTriggerPoints: boolean;

  public buttonBreakpoint: number;
  public showCtrlButtons: boolean;

  public options: {
    domSelectors: {
      scrollArea: string,
      activeNavItem: string,
      navItems: string,
      scrollAreaWrapper: string,
      ctrlRight: string,
      ctrlLeft: string,
      content: string,
    },
    stateClasses: {
      activeNavItem: string,
      shadowRight: string,
      shadowLeft: string,
    },
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        scrollArea: '.mdl-anchornav__list',
        scrollAreaWrapper: '.mdl-anchornav__list-wrapper',
        activeNavItem: '.mdl-anchornav__list .atm-anchorlink--active',
        navItems: '.mdl-anchornav__list .atm-anchorlink',
        ctrlRight: '.mdl-anchornav__ctrl--right button',
        ctrlLeft: '.mdl-anchornav__ctrl--left button',
        content: '.mdl-anchornav__content',
      },
      stateClasses: {
        activeNavItem: 'atm-anchorlink--active',
        stickyMode: 'mdl-anchornav--sticky',
        shadowRight: 'mdl-anchornav__list-wrapper--shadow-right',
        shadowLeft: 'mdl-anchornav__list-wrapper--shadow-left',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.buttonBreakpoint = 840;
    this.activeStateScrollTolerance = 60;
    this.jumpToTolerance = 20;
    this.swipeTolerance = 2;
    this.showButtonTolerance = 10;
    this.navPositionHorizontal = 0;
    this.navScrollSpaceHorizontal = 0;
    this.invisibleScrollIndex = 0;
    this.containsExceedingTriggerPoints = false;

    this.initUi();
    this.initEventListeners();
    // Custom methodes
    this.setDocumentHeight();
    this.storeNavigationPosition();
    this.calculatePageAnchorDistances();
    this.onPageScroll();
    this.setupControlButtons();
    this.initializeImpetus();
    this.onPageDebounceScrolled();
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
      .on('mouseup', (<any> this.options).domSelectors.navItems, this.moveToAnchor.bind(this))
      .on('click', (<any> this.options).domSelectors.navItems, this.onMouseClick.bind(this))
      .on('click', (<any> this.options).domSelectors.ctrlRight, this.onControlBtnClick.bind(this, 'right'))
      .on('click', (<any> this.options).domSelectors.ctrlLeft, this.onControlBtnClick.bind(this, 'left'));

    (<any>WindowEventListener).addDebouncedResizeListener(this.onResize.bind(this));
    (<any>WindowEventListener).addDebouncedScrollListener(this.onPageDebounceScrolled.bind(this));
    (<any>WindowEventListener).addEventListener('scroll', this.onPageScroll.bind(this)); // Necessary for jump.js plugin
  }

  /**
   * Store the inital positon of the navigation if they is not fixed
   * otherwise take the postion from the placeholder div
   */
  storeNavigationPosition() {
    let navElement;
    if (window.getComputedStyle(this.ui.element, null).position !== 'fixed') {
      navElement = this.ui.element;
    } else {
      navElement = this.placeholder;
    }
    this.originalNavPosition = this.getDistanzeToPageTopFor(navElement);
  }

  /**
   * Creates the pageAnchors array
   *
   * pageAnchor-item = {
   *  navItem: navitem-reference (atm-anchorlink) <HTMLElement>
   *  pageHookDistanceToTop: scroll pixel distance to page top <number>
   * }
   */
  calculatePageAnchorDistances() {
    console.log('--- calculatePageAnchorDistances ---');
    this.pageAnchors = [];
    const maxScrollY = this.getDocumentHeight() - window.innerHeight;
    console.log('max scroll Y: ', maxScrollY);
    let pageExceedFactor;
    let foundFirstEceedItem = false;
    this.containsExceedingTriggerPoints = false;

    for (let i = 0; i < (<any> this.ui).navItems.length; i += 1) {
      const currentItem = (<any> this.ui).navItems[i];
      if (currentItem.dataset.href[0] === '#') {
        let anchorHrefName = currentItem.dataset.href;
        anchorHrefName = anchorHrefName.slice(1, anchorHrefName.length);
        const tempAnchor = document.querySelector(`#${anchorHrefName}`);


        if (tempAnchor !== null) { // prevent missspelled anchor names

          if (this.getDistanzeToPageTopFor(tempAnchor) > maxScrollY && !foundFirstEceedItem) {
            /*console.log('Trigger position exceeds page-length at index: ', (<any> this.ui).navItems.length - (i));*/
            foundFirstEceedItem = true
            pageExceedFactor = (<any> this.ui).navItems.length - (i);
            this.containsExceedingTriggerPoints = true;
          }
          let tempDistance = this.getDistanzeToPageTopFor(tempAnchor);
          /*console.log('PAGE EXCEED normal dist: ', tempDistance);*/
          /*if (foundFirstEceedItem) {
            console.log('NEW SCROLL POINT TRIGGER: ', maxScrollY - (this.activeStateScrollTolerance + pageExceedFactor * 20));
            tempDistance = maxScrollY - (pageExceedFactor * 20);
            pageExceedFactor -= 1;
          }*/

          /*console.log('PAGE EXCEED new dist: ', tempDistance);
          console.log('this.getDistanzeToPageTopFor(tempAnchor): ', this.getDistanzeToPageTopFor(tempAnchor));*/
          this.pageAnchors.push({
            navItem: currentItem,
            pageHookDistanceToTop: tempDistance,
            containsExceedingTriggerPoints: this.containsExceedingTriggerPoints
          });
        }
      }
    }
  }

  /**
   * Initial button check if window is over 840 and there is some scrollable space
   */
  setupControlButtons() {
    this.navScrollSpaceHorizontal = this.getSwipeBorder();
    if ((this.navScrollSpaceHorizontal > 1 || this.navScrollSpaceHorizontal < -1)) {
      if (window.innerWidth >= this.buttonBreakpoint) {
        this.handleControlButtons();
      }
    } else {
      this.showControlButton('none');
    }
  }

  handleShadow() {
    const rightClass = this.options.stateClasses.shadowRight;
    const leftClass = this.options.stateClasses.shadowLeft;
    const scrollWrapper = (<any> this.ui).scrollAreaWrapper;

    if (this.navPositionHorizontal <= 0
      && this.navPositionHorizontal >= -(this.showButtonTolerance)) {
      scrollWrapper.classList.add(rightClass);
      scrollWrapper.classList.remove(leftClass);
    } else if (this.navPositionHorizontal >= this.navScrollSpaceHorizontal
      && this.navPositionHorizontal <= (this.navScrollSpaceHorizontal + this.showButtonTolerance)) {
      scrollWrapper.classList.remove(rightClass);
      scrollWrapper.classList.add(leftClass);
    } else {
      scrollWrapper.classList.add(rightClass);
      scrollWrapper.classList.add(leftClass);
    }
  }

  /**
   * Toggle the buttons corresponding to scrollable space position(left/right/both)
   */
  handleControlButtons() {
    if (this.navPositionHorizontal >= 0 && this.navPositionHorizontal < this.showButtonTolerance) {
      this.showControlButton('right');
    } else if (this.navPositionHorizontal <= this.navScrollSpaceHorizontal
      && this.navPositionHorizontal < (this.navScrollSpaceHorizontal + this.showButtonTolerance)) {
      this.showControlButton('left');
    } else {
      this.showControlButton('both');
    }
  }

  getNavItemsHorizontalPositions(item) {
    const parentLeft = (<any> this.ui).scrollArea.getBoundingClientRect().left;
    return item.getBoundingClientRect().left - parentLeft;
  }

  /**
   * Mousedown-Callback on navigation anchors.
   * Store initial click position to differentiate click and swipe in mouseup event
   * @param event
   */
  onMouseDown(event) {
    this.mousePositionOnDown = event.screenX;
  }

  /**
   * Click-Callback on navigation anchors.
   * Only nessesary to prevent standart behavior
   */
  onMouseClick() {
    return false;
  }

  /**
   * OnClick callback on navigation anchors.
   * Check if its a swipe or a real click and launches the jump.js plugin
   * to move to the corresponing named anchor on the page
   *
   * @param event
   */
  moveToAnchor(event) {
    // Stop event if the delta is to big
    const mouseEventDelta = event.screenX - this.mousePositionOnDown;
    let isClickEvent = false;
    if (mouseEventDelta < this.swipeTolerance && mouseEventDelta > -(this.swipeTolerance)) {
      isClickEvent = true;
    } else {
      return false;
    }
    console.log('moveToAnchor CLICK');
    const scrollPosition = document.documentElement.getBoundingClientRect().top;

    const {target} = event;
    console.log(target);
    // Parse away the #-symbol from the string
    const targetName = target.dataset.href.slice(1, target.dataset.href.length);
    // Check that the anchor is referring to the own page and if the string contains letters
    /*
    for (let i = 0; i < this.pageAnchors.length; i += 1) {
      // Got the clicked item
      if (target === (<any> this).pageAnchors[i].navItem) {
        if (target.dataset.href[0] === '#' && targetName.length !== 0 && isClickEvent) {
          if ((<any> this).pageAnchors[i].containsExceedingTriggerPoints) {
            console.log("this.getDocumentHeight(): ", this.getDocumentHeight());
            let tmpScrollToPoint;
            let spaceFromBottom
            if (Math.abs(document.documentElement.getBoundingClientRect().top ) > (<any> this).pageAnchors[i].pageHookDistanceToTop) {
              console.log('CLICK IF' );
              console.log("* moveToAnchor-scrollPosition: ", scrollPosition);
              spaceFromBottom = -((<any> this.ui).navItems.length - (i)* 20); //  this.getDocumentHeight() - (window.innerHeight  + ((<any> this.ui).navItems.length - (i)* 20));
              tmpScrollToPoint = spaceFromBottom;
            } else {
              console.log('CLICK ELSE');
              spaceFromBottom = (<any> this).pageAnchors[i].pageHookDistanceToTop;
            }
            console.log('Jump to: ', spaceFromBottom);
            jump(spaceFromBottom);
          } else {

            jump(`#${targetName}`, {
              offset: -(this.ui.element.getBoundingClientRect().height + this.jumpToTolerance),
            });
          }
          this.toggleActiveNavigationItemClass(target)
        }
      }
    }
    */
    console.log('moveToAnchor CLICK END');
    if (target.dataset.href[0] === '#' && targetName.length !== 0 && isClickEvent) {
      jump(`#${targetName}`, {
        offset: -(this.ui.element.getBoundingClientRect().height + this.jumpToTolerance),
      });
    }
    return true;
  }

  getDocumentHeight() {
    return this.documentHeight;
  }

  setDocumentHeight() {
    let body = document.body;
    let html = document.documentElement;

    this.documentHeight = Math.max(body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight);
  }

  /**
   * Initialize the impetus instance
   */
  initializeImpetus() {
    this.impetusInstance = new Impetus({
      source: (<any> this.ui).scrollArea,
      boundX: [this.getSwipeBorder(), 0],
      bounce: false,
      update: this.impetusUpdate.bind(this),
    });
  }

  /**
   * Get the posible translation offset of the scrollable content
   *
   * @return {number}
   */
  getSwipeBorder() {
    // IE11 do not work correctly with getBoundingClientRect
    const scrollAreaWidth = (<any> this.ui).scrollArea.scrollWidth;

    const ParentOffsetWidth = (<any> this.ui).scrollArea.parentNode.getBoundingClientRect().width;
    const scrollableWidth = (ParentOffsetWidth - scrollAreaWidth);

    if (scrollableWidth > 1 || scrollableWidth < -1) {
      this.showCtrlButtons = true;
    } else {
      this.showCtrlButtons = false;
    }

    return scrollableWidth;
  }

  /**
   * Update callback from impetus plugin
   *
   * @param x
   */
  impetusUpdate(x) {
    let dir;
    if (x < this.navPositionHorizontal) {
      dir = 'right';
    } else {
      dir = 'left';
    }

    this.navPositionHorizontal = x;
    this.updateInvisibleIndexOnSwipe(dir);
    this.handleShadow();

    (<any> this.ui).scrollArea.style.left = `${x}px`;
    if (window.innerWidth >= this.buttonBreakpoint
      && (this.navScrollSpaceHorizontal > this.showButtonTolerance
        || this.navScrollSpaceHorizontal < -(this.showButtonTolerance))) {
      this.handleControlButtons();
    }
  }

  /**
   * Toggle the nav buttons styles
   *
   * @param {string} state
   */
  showControlButton(state: string) {
    const buttonParentRight = (<any> this.ui).ctrlRight.parentNode;
    const buttonParentLeft = (<any> this.ui).ctrlLeft.parentNode;
    if (state === 'right') {
      buttonParentRight.style.display = 'block';
      buttonParentLeft.style.display = 'none';
    } else if (state === 'left') {
      buttonParentRight.style.display = 'none';
      buttonParentLeft.style.display = 'block';
    } else if (state === 'both') {
      buttonParentRight.style.display = 'block';
      buttonParentLeft.style.display = 'block';
    } else {
      buttonParentRight.style.display = 'none';
      buttonParentLeft.style.display = 'none';
    }
  }

  /**
   * Remove the active class from the last active element
   * an apply it to the given target parameter
   *
   * @param target
   */
  toggleActiveNavigationItemClass(target) {
    (<any> this.ui).activeNavItem.classList.remove(this.options.stateClasses.activeNavItem);
    target.classList.add(this.options.stateClasses.activeNavItem);
    (<any> this.ui).activeNavItem = target;
  }

  /**
   * Calculate to distance from the given element to the page top
   *
   * @param element
   * @return {number}
   */
  getDistanzeToPageTopFor(element): number {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return rect.top + scrollTop;
  }

  /**
   * Handle clicks on the navigation control buttons to calculate the next valid scroll area offset
   * and in-/decrement the invisible index
   *
   * @param data ("left"/"rigth")
   */
  onControlBtnClick(data) {
    const maxIndex = (<any> this.ui).navItems.length - 1;
    if (data === 'right') {
      if (this.invisibleScrollIndex >= maxIndex) {
        this.invisibleScrollIndex = maxIndex;
      } else {
        this.invisibleScrollIndex = this.invisibleScrollIndex + 1;
      }
    } else if (data === 'left') {
      if (this.invisibleScrollIndex <= 0) {
        this.invisibleScrollIndex = (<any> this.ui).navItems.length - 1;
      } else {
        this.invisibleScrollIndex = this.invisibleScrollIndex - 1;
      }
    }
    const anchor = (<any> this.ui).navItems[this.invisibleScrollIndex];
    const position = this.getNavItemsHorizontalPositions(anchor);
    this.emulateSwipeTo(-(position - this.showButtonTolerance));
  }

  /**
   * Updates the invisible index based on the swipe direction
   * and the current horizontal position of the scrollable content
   *
   * @param {string} direction
   */
  updateInvisibleIndexOnSwipe(direction: string) {
    let lastMatchedIndex;
    if (direction === 'right') {
      for (let i = 0; i < (<any> this.ui).navItems.length; i += 1) {
        const position = -(this.getNavItemsHorizontalPositions((<any> this.ui).navItems[i]));
        if (this.navPositionHorizontal >= position
          && this.navPositionHorizontal <= (position + this.showButtonTolerance)) {
          lastMatchedIndex = i;
        }
      }
    } else {
      for (let i = (<any> this.ui).navItems.length - 1; i >= 0; i -= 1) {
        const position = -(this.getNavItemsHorizontalPositions((<any> this.ui).navItems[i]));
        if (this.navPositionHorizontal >= position
          && this.navPositionHorizontal <= (position + this.showButtonTolerance)) {
          lastMatchedIndex = i;
        }
      }
    }

    if (lastMatchedIndex !== undefined) {
      this.invisibleScrollIndex = lastMatchedIndex;
    }
  }

  /**
   * Validate the given position and pass it to the impetus update function
   * @param position
   */
  emulateSwipeTo(position) {
    const boarderRight = this.getSwipeBorder();
    let x = position;
    if (x >= 0) {
      x = 0;
    } else if (x <= boarderRight) {
      x = boarderRight;
    }
    this.impetusUpdate(x);
  }

  /**
   * On resize callback. Calls all function that set relevant attributes
   */
  onResize() {
    this.storeNavigationPosition();
    this.setDocumentHeight();
    this.calculatePageAnchorDistances();
    this.onPageScroll();
    this.setupControlButtons();
    (<any> this.impetusInstance).setBoundX([this.getSwipeBorder(), 0]);
  }

  /**
   * Plain scroll callback. Responsible for the pin-/unpining the anchornav
   */
  onPageScroll() {
    const currentScrollPosition = document.documentElement.getBoundingClientRect().top;
    const pinPos = -(this.originalNavPosition);

    // Handle sticky nav
    if (currentScrollPosition <= pinPos && !this.navigationIsFixed) {
      this.createPlaceholder();
      this.pinNavigation();
    } else if (currentScrollPosition >= pinPos && this.navigationIsFixed) {
      this.unpinNavigation();
    }
  }

  /**
   * Debounced scroll callback. Responsible for toggling the anchornav item active class
   * and do beside the autoscroll if its possible
   */
  onPageDebounceScrolled() {
    let anchor;
    const scrollPosition = document.documentElement.getBoundingClientRect().top;
    console.log(scrollPosition);
    // Handle active item class on scrolling
    if (this.pageAnchors.length > 0) {
      const navHeight = this.ui.element.getBoundingClientRect().height;

      for (let i = 0; i < this.pageAnchors.length; i += 1) {
        const currentItem = this.pageAnchors[i];

        let negativeTopDistance;
        let positiveTopDistance;

        // *TRY* Handle too less space to scroll to the trigger coordinate
       /* if (!(<any> currentItem).containsExceedingTriggerPoints) {
          negativeTopDistance = -((<any> currentItem).pageHookDistanceToTop
            - -(navHeight)) - this.activeStateScrollTolerance;

          positiveTopDistance = -((<any> currentItem).pageHookDistanceToTop
            + -(navHeight)) + this.activeStateScrollTolerance;
        } else {
          negativeTopDistance = -((<any> currentItem).pageHookDistanceToTop
            - -(navHeight)) - this.activeStateScrollTolerance;
          positiveTopDistance = negativeTopDistance  + 10;
        }*/

        negativeTopDistance = -((<any> currentItem).pageHookDistanceToTop
          - -(navHeight)) - this.activeStateScrollTolerance;

        positiveTopDistance = -((<any> currentItem).pageHookDistanceToTop
          + -(navHeight)) + this.activeStateScrollTolerance;

        // Handle y-coordinate trigger point for toggling the active class on scroll
        if (scrollPosition <= negativeTopDistance
          || scrollPosition <= positiveTopDistance) {
          // Inbetween
          anchor = (<any> currentItem).navItem;
        }else if (scrollPosition <= 0
          && scrollPosition > -(<any> this.pageAnchors)[0].pageHookDistanceToTop) {
          // TOP
          anchor = (<any> this.pageAnchors)[0].navItem;
        }
      }
    }

    const anchorLeft = this.getNavItemsHorizontalPositions(anchor);
    this.toggleActiveNavigationItemClass(anchor);
    this.emulateSwipeTo(-(anchorLeft - this.showButtonTolerance));
  }

  /**
   * Create the placeholder div if its not define
   * else it just positionated the div relative in the docmuent flow
   */
  createPlaceholder() {
    if (this.placeholder === undefined) {
      this.placeholder = document.createElement('div');
      this.setPlaceholderHeight();
      this.ui.element.parentNode.insertBefore(this.placeholder, this.ui.element);
    } else {
      this.placeholder.style.position = 'relative';
    }
  }

  /**
   * Calculate the nav height for the placeholder div
   */
  setPlaceholderHeight() {
    const smallMargin = 40;
    const bigMargin = 56;
    const toleranceDivider = 4;
    let marginBottom;

    if (window.innerWidth > this.buttonBreakpoint) {
      marginBottom = bigMargin;
    } else {
      marginBottom = smallMargin;
    }
    this.placeholder.style.height = `${(this.ui.element.getBoundingClientRect().height + marginBottom / toleranceDivider)}px`;
  }

  /**
   * Add all fixed-styles to the anchornav
   */
  pinNavigation() {
    this.ui.element.style.position = 'fixed';
    this.ui.element.style.top = '0';
    this.ui.element.style.left = '0';
    this.ui.element.style.transform = 'none';
    this.ui.element.style.marginLeft = '0';

    this.navigationIsFixed = true;
  }

  /**
   * Removed all fixed-styles on the anchornav
   */
  unpinNavigation() {
    this.ui.element.style.removeProperty('position');
    this.ui.element.style.removeProperty('top');
    this.ui.element.style.removeProperty('left');
    this.ui.element.style.removeProperty('transform');
    this.ui.element.style.removeProperty('margin-left');

    this.placeholder.style.position = 'absolute';
    this.navigationIsFixed = false;
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
