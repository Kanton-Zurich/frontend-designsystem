// import WindowEventListener from './events';
/**
 * FlyingFocus adds transition to the focus outline when you tab around inputs, buttons, links.
 * Based on https://github.com/NV/flying-focus/
 *
 * @class FlyingFocus
 */
class FlyingFocus {
  private options: {
    duration: number,
    ringId: string,
    visibleClass: string,
    targetClass: string,
  };
  private ringElement: any = null;
  private movingId: any = 0;
  private prevFocused: any = null;
  private currentFocused: any = null;
  private keyDownTime: number = 0;
  private docElement: any = null;
  private body: any = null;
  constructor() {
    this.options = {
      duration: 150, // eslint-disable-line no-magic-numbers
      ringId: 'flying-focus',
      visibleClass: 'flying-focus--visible',
      targetClass: 'flying-focus__target',
    };
  }
  /**
   * Initializing the flying focus and setting up for the first time
   *
   * @memberof FlyingFocus
   */
  public initFlyingFocus() {
    this.docElement = document.documentElement;
    this.body = document.body;
    this.ringElement = document.createElement('div');
    this.ringElement.id = this.options.ringId;
    this.ringElement.style.transitionDuration = `${this.options.duration / 1000}s`; // eslint-disable-line no-magic-numbers
    this.ringElement.style.WebkitTransitionDuration = this.ringElement.style.transitionDuration;
    this.body.appendChild(this.ringElement);
    this.initEventListeners();
  }
  /**
   * Show flying focus
   *
   * @memberof FlyingFocus
   * @param event: Event
   */
  public showFlyingFocus(event) {
    this.ringElement.style.display = 'block';
    if (event.target.id === this.options.ringId) {
      return;
    }
    this.currentFocused = event.target;
    this.doFocusOnTarget(event.target);
  }
  /**
   * Do the focus on the given target
   * @param target
   */
  doFocusOnTarget(target: any) {
    let isFirstFocus: boolean = false;
    if (!this.ringElement) {
      isFirstFocus = true;
      this.initFlyingFocus();
    }

    const ringmargin = document.querySelector('.mdl-carousel--fullscreen') ? 0 : 10; //eslint-disable-line

    if (target) {
      if (target.tagName !== 'BODY') {
        const offset = this.offsetOf(target);
        this.ringElement.style.left = `${offset.left - (ringmargin / 2)}px`; //eslint-disable-line
        this.ringElement.style.top = `${offset.top - (ringmargin / 2)}px`; //eslint-disable-line
        this.ringElement.style.width = `${target.offsetWidth + ringmargin}px`;
        this.ringElement.style.height = `${target.offsetHeight + ringmargin}px`;
        if (isFirstFocus || !this.isJustPressed()) {
          return;
        }
        target.classList.add(this.options.targetClass);
        this.ringElement.classList.add(this.options.visibleClass);
        this.prevFocused = target;
      }
    }
  }
  /**
   * Hide flying focus
   *
   * @memberof FlyingFocus
   */
  public hideFlyingFocus() {
    this.ringElement.style.display = 'none';
    if (!this.movingId) {
      return;
    }
    clearTimeout(this.movingId);
    this.movingId = 0;
    this.ringElement.classList.remove(this.options.visibleClass);
    this.prevFocused.classList.remove(this.options.targetClass);
    this.prevFocused = null;
  }
  /**
   * Get whether element was just pressed
   *
   * @private
   * @memberof FlyingFocus
   * @returns boolean
   */
  private isJustPressed() {
    return Date.now() - this.keyDownTime < 42; // eslint-disable-line no-magic-numbers
  }
  /**
   * Get offset of element
   *
   * @private
   * @memberof FlyingFocus
   * @param elem: any
   * @returns object
   */
  private offsetOf(elem) {
    const rect: any = elem.getBoundingClientRect();
    const clientLeft: number = this.docElement.clientLeft || this.body.clientLeft;
    const clientTop: number = this.docElement.clientTop || this.body.clientTop;
    const scrollLeft: number = window.pageXOffset || this.docElement.scrollLeft || this.body.scrollLeft; // eslint-disable-line max-len
    const scrollTop: number = window.pageYOffset || this.docElement.scrollTop || this.body.scrollTop; // eslint-disable-line max-len
    const left: number = rect.left + scrollLeft - clientLeft;
    const top: number = rect.top + scrollTop - clientTop;
    return {
      top: top || 0,
      left: left || 0,
    };
  }
  /**
   * Initializing the event listeners
   *
   * @private
   * @memberof FlyingFocus
   */
  private initEventListeners() {
    this.docElement.addEventListener('keydown', (event) => {
      const code: number = event.which;
      // Show animation only upon Tab or Arrow keys press.
      if (code === 9 || (code > 36 && code < 41)) { // eslint-disable-line no-magic-numbers
        this.keyDownTime = Date.now();
      }
      if (event.key === 'Esc' || event.key === 'Escape') {
        this.currentFocused.blur();
      }
    }, true);
    this.docElement.addEventListener('focus', (event) => {
      this.showFlyingFocus(event);
    }, true);
    this.docElement.addEventListener('blur', () => {
      this.hideFlyingFocus();
    }, true);
  }
}
export default FlyingFocus;
