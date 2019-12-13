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
    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      change: 'Pagination.change',
      setCanonicalUrls: 'Pagination.setCanonicalUrls',
      setPageCount: 'Pagination.setPageCount',
      setPage: 'Pagination.setPage',
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
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
      this.setPageButtonStyles(event.detail);
    });

    this.eventDelegate.on(Pagination.events.setPage, (event) => {
      this.ui.input.value = event.detail;
      this.setPageButtonStyles(event.detail);
    });
    this.setPageButtonStyles(1);
  }

  onInputChange(property, oldValue, newValue, watchable) {
    if (document.activeElement !== watchable) {
      const maxPages = parseInt(this.ui.element.getAttribute('data-pagecount'), 10);
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
      this.emitChange(oldValue, newValue);
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
   * Update function for button styles
   * @param page
   * @param maxPages
   */
  setPageButtonStyles(page) {
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
