/*!
 * Anchornav
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import namespace from '../../assets/js/helpers/namespace';
import jump from 'jump.js';
import WindowEventListener from '../../assets/js/helpers/events';

class Anchornav extends Module {
  public elementClone: HTMLElement;
  public pageAnchors: Array<object>;
  public originalPosition: number;


  public buttonBreakpoint: number;
  public showCtrlButtons: boolean;
  public ctrlRightVisbile: boolean;
  public ctrlLeftVisbile: boolean;

  public options: {
    domSelectors: {
      scrollArea: string,
    },
    stateClasses: {
      activeNavItem: string,
    },
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        scrollArea: '.mdl-anchornav__list',
        activeNavItem: '.mdl-anchornav__list .atm-anchorlink--active',
        navItems: '.mdl-anchornav__list .atm-anchorlink',
        ctrlRight: '.mdl-anchornav__ctrl--right button',
        ctrlLeft: '.mdl-anchornav__ctrl--left button',
        content: '.mdl-anchornav__content',
      },
      stateClasses: {
        activeNavItem: 'atm-anchorlink--active',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.buttonBreakpoint = 840;
    this.ctrlRightVisbile = false;
    this.ctrlLeftVisbile = false;

    this.initUi();
    this.initEventListeners();

    this.updateOriginalPosition();
    this.onPageScroll();
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
      .on('click', (<any> this.options).domSelectors.navItems, this.moveToAnchor.bind(this))
      .on('click', (<any> this.options).domSelectors.ctrlRight, this.onControlBtnClick.bind(this))
      .on('click', (<any> this.options).domSelectors.ctrlLeft, this.onControlBtnClick.bind(this))
      .on('scroll', (<any> this.options).domSelectors.scrollArea, this.onNavListScroll.bind(this));

    (<any>WindowEventListener).addDebouncedResizeListener(this.onResize.bind(this));
    (<any>WindowEventListener).addEventListener('scroll', this.onPageScroll.bind(this));
  }

  /**
   * OnClick callback on navigation anchors and launches the jump.js plugin
   * to move to the corresponing named anchor on the page
   *
   * @param event
   */
  moveToAnchor(event) {
    const target = event.target;
    // Parse away the #-symbol from the string
    const targetName = target.hash.slice(1, target.hash.length);

    // Check that the anchor is refering to the own page and contains a name
    if (target.getAttribute('href')[0] === '#' && targetName.length !== 0) {
      jump(`a[name="${targetName}"]`, {
        offset: -(this.ui.element.getBoundingClientRect().height),
      });
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

  getDistanzeToPageTopFor(element) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    return rect.top + scrollTop;
  }

  updateOriginalPosition() {
    console.log('updateOriginalNavigationPosition');
    this.originalPosition = this.getDistanzeToPageTopFor(this.ui.element);
    this.pageAnchors = [];

    (<any> this.ui).navItems.forEach(
      function (currentItem) {
        if (currentItem.getAttribute('href')[0] === '#') {
          console.log();
          let anchorHrefName = currentItem.getAttribute('href');
          anchorHrefName = anchorHrefName.slice(1, anchorHrefName.length);
          const tempAnchor = document.querySelector(`a[name="${anchorHrefName}"]`);

          this.pageAnchors.push({
            navItem: currentItem,
            pageHookDistanceToTop: this.getDistanzeToPageTopFor(tempAnchor)
          })
        }
    }, this);
  }

  onControlBtnClick() {

  }

  onNavListScroll() {

  }

  onResize() {
    this.updateOriginalPosition();
  }

  onPageScroll() {
    const currentScrollPosition = document.documentElement.getBoundingClientRect().top;

    if (currentScrollPosition <= -(this.originalPosition)) {
      /*
      console.log('-----UNPIN-----');
      console.log('currentScrollPosition: ', currentScrollPosition);
      console.log('-(this.originalPosition): ', -(this.originalPosition));
      /* */
      this.clonenNavigation();
      this.pinNavigation();
    } else if (currentScrollPosition >= -(this.originalPosition)
      && this.elementClone !== undefined) {
      /*
      console.log('-----UNPIN-----');
      console.log('currentScrollPosition: ', currentScrollPosition);
      console.log('-(this.originalPosition): ', -(this.originalPosition));
      /* */
      this.unpinNavigation();
      this.elementClone.style.display = 'none';
    }
    if (this.pageAnchors.length > 0) {
      this.pageAnchors.forEach(
        function (currentItem) {
          if (currentScrollPosition <= -((<any>currentItem).pageHookDistanceToTop)) {
            console.log('currentItem');
            console.log((<any>currentItem).navItem);
            this.toggleActiveNavigationItemClass((<any>currentItem).navItem);
          }
        }, this
      );
    }
  }

  clonenNavigation() {
    if (this.elementClone === undefined) {
      this.elementClone = this.ui.element.cloneNode(true);
      this.ui.element.parentNode.insertBefore(this.elementClone, this.ui.element);
    }
  }

  pinNavigation() {
    this.ui.element.style.position = 'fixed';
    this.ui.element.style.top = '0';
    this.ui.element.style.left = '0';
    this.ui.element.style.transform = 'none';
    this.ui.element.style.marginLeft = '0';
  }

  unpinNavigation() {
    this.ui.element.style.removeProperty('position');
    this.ui.element.style.removeProperty('top');
    this.ui.element.style.removeProperty('left');
    this.ui.element.style.removeProperty('transform');
    this.ui.element.style.removeProperty('margin-left');
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
