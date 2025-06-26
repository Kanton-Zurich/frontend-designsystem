import Module from '../../assets/js/helpers/module';

/*!
 * Skiplinks
 *
 * @author
 * @copyright
 */
class Skiplinks extends Module {
  private scrollOffset = 180; // eslint-disable-line
  private transitionTime = 100; // eslint-disable-line

  constructor($element: any, data: Object, options: Object) {
    const defaultOptions = {
      domSelectors: {
        links: '[data-skiplinks="link"]',
      },
      stateClasses: {},
    };

    super($element, {}, defaultOptions, data, options);

    this.removeInvalidAnchorLinks();
    this.initEventListeners();
  }

  scrollToTargetAdjusted(el: HTMLElement) {
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - this.scrollOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });

    setTimeout(() => {
      el.focus();
      this.updateFlyingFocus();
    }, this.transitionTime);
  }

  followSkipLink(e: MouseEvent) {
    const href = (e.target as HTMLAnchorElement).getAttribute('href');
    if (href[0] === '#') {
      e.preventDefault();
      e.stopPropagation();
      const targetElement = document.getElementById(href.slice(1));
      this.scrollToTargetAdjusted(targetElement);
    }
  }

  /**
   * Remove invalid anchor links
   */
  removeInvalidAnchorLinks() {
    document
      .querySelectorAll(this.options.domSelectors.links)
      .forEach((link: HTMLAnchorElement) => {
        const href = link.getAttribute('href');
        if (href[0] === '#') {
          if (!document.getElementById(href.slice(1))) {
            link.parentElement.remove();
          }
        }
      });
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate.on('click', this.options.domSelectors.links, this.followSkipLink.bind(this));
  }

  updateFlyingFocus() {
    (<any>window).estatico.flyingFocus.doFocusOnTarget(document.activeElement);
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default Skiplinks;
