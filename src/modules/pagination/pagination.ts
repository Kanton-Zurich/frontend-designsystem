/*!
 * Pagination
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class Pagination extends Module {
  public ui: {
    element: any;
    input: HTMLInputElement,
    prev: HTMLButtonElement,
    next: HTMLButtonElement,
    pageCount: HTMLDivElement,
  };

  private lastValue: number;
  private preventEmit: boolean;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        input: '.mdl-pagination__input > input',
        prev: '.mdl-pagination__button-prev',
        next: '.mdl-pagination__button-next',
        pageCount: '.mdl-pagination__page-count',
      },
      stateClasses: {
        buttonDisabled: 'atm-button--disabled',
      },
    };

    super($element, defaultData, defaultOptions, data, options);
    this.lastValue = 1;
    this.preventEmit = false;
    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      change: 'Pagination.change',
      setCanonicalUrls: 'Pagination.setCanonicalUrls',
      setPageCount: 'Pagination.setPageCount',
      setPage: 'Pagination.setPage',
      interaction: 'Pagination.interaction',
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.ui.next.addEventListener('keydown', this.emitInteract.bind(this));
    this.ui.next.addEventListener('mousedown', this.emitInteract.bind(this));
    this.ui.prev.addEventListener('keydown', this.emitInteract.bind(this));
    this.ui.prev.addEventListener('mousedown', this.emitInteract.bind(this));
    this.ui.next.addEventListener('click', (event) => {
      this.ui.input.value = (parseInt(this.ui.input.value, 10) + 1).toString();
      event.preventDefault();
    });
    this.ui.prev.addEventListener('click', (event) => {
      this.ui.input.value = (parseInt(this.ui.input.value, 10) - 1).toString();
      event.preventDefault();
    });
    this.watch(this.ui.input, 'value', this.onInputChange.bind(this));
    this.ui.input.addEventListener('focusout', (event) => {
      this.onInputInteraction(event);
    });
    this.ui.input.addEventListener('keyup', (event: any) => {
      if (event.key === 'Enter' || event.key === 'Space') {
        this.onInputInteraction(event);
      }
    });
    this.eventDelegate.on(Pagination.events.setCanonicalUrls, (event) => {
      const { prev, next } = event.detail;
      this.ui.prev.setAttribute('href', prev);
      this.ui.next.setAttribute('href', next);
    });

    this.eventDelegate.on(Pagination.events.setPageCount, (event) => {
      this.ui.pageCount.querySelector('span').innerHTML = event.detail;
      this.ui.element.setAttribute('data-pagecount', event.detail);
      this.setPageButtonStyles(this.ui.input.value);
    });

    this.eventDelegate.on(Pagination.events.setPage, (event) => {
      this.preventEmit = true;
      this.ui.input.value = event.detail;
      this.preventEmit = false;
      this.setPageButtonStyles(event.detail);
    });
    this.setPageButtonStyles(1);
  }

  onInputChange(property, oldValue, newValue, watchable) {
    const maxPages = parseInt(this.ui.element.getAttribute('data-pagecount'), 10);
    if (document.activeElement !== watchable) {
      if (isNaN(parseInt(newValue))) { // eslint-disable-line
        return;
      }
      if (newValue > maxPages) {
        watchable.value = maxPages;
        this.setPageButtonStyles(maxPages);
        return;
      }
      if (newValue < 1 && newValue.length > 0) {
        watchable.value = 1;
        this.setPageButtonStyles(1);
        return;
      }
      if (!isNaN(parseInt(oldValue, 10)) && (oldValue < 1 || oldValue > maxPages)) { // eslint-disable-line
        return;
      }
      this.lastValue = newValue;
      if (!this.preventEmit) {
        this.emitChange(oldValue, newValue);
      }
    } else {
      if (newValue > maxPages) {
        watchable.value = maxPages;
        this.setPageButtonStyles(maxPages);
        return;
      }
      if (!isNaN(parseInt(newValue)) && newValue < 1) { // eslint-disable-line
        watchable.value = 1;
        this.setPageButtonStyles(1);
      }
    }
  }

  /**
   * On input interaction
   */
  onInputInteraction(event: any) {
    if(!isNaN(parseInt(event.target.value,10)) && // eslint-disable-line
    this.lastValue !== event.target.value) {
      this.emitChange(this.lastValue, event.target.value);
      this.lastValue = event.target.value;
    }
  }

  /**
   * Emit change event
   * @param oldValue
   * @param newValue
   */
  emitChange(oldValue, newValue) {
    const pageChangeData = {
      detail: {
        before: oldValue,
        after: newValue,
      },
    };
    this.ui.element.dispatchEvent(new CustomEvent(Pagination.events.change, pageChangeData));
    this.setPageButtonStyles(newValue);
  }

  /**
   * Interaction event
   */
  emitInteract() {
    this.ui.element.dispatchEvent(new CustomEvent(Pagination.events.interaction));
  }

  /**
   * Update function for button styles
   * @param page
   * @param maxPages
   */
  setPageButtonStyles(page) {
    this.ui.pageCount.querySelector('em').innerHTML = this.ui.input.value;
    const maxPages = parseInt(this.ui.element.getAttribute('data-pagecount'), 10);
    this.ui.prev.classList.remove(this.options.stateClasses.buttonDisabled);
    this.ui.next.classList.remove(this.options.stateClasses.buttonDisabled);

    if (page <= 1) {
      this.ui.prev.classList.add(this.options.stateClasses.buttonDisabled);
    }

    if (page >= maxPages) {
      this.ui.next.classList.add(this.options.stateClasses.buttonDisabled);
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

export default Pagination;
