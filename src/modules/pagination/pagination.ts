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
      stateClasses: {},
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      // eventname: `eventname.${ Pagination.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.ui.next.addEventListener('click', () => {
      this.ui.input.value = (parseInt(this.ui.input.value, 10) + 1).toString();
    });
    this.ui.prev.addEventListener('click', () => {
      this.ui.input.value = (parseInt(this.ui.input.value, 10) - 1).toString();
    });
    this.lastValue = parseInt(this.ui.element.getAttribute('data-currentpage'), 10);
    this.watch(this.ui.input, 'value', this.inputChange.bind(this));
    this.ui.input.addEventListener('focusout', (event) => {
      this.updateValue(<HTMLInputElement>event.target);
    });
    this.ui.input.addEventListener('keyup', (event) => {
      if (event.key === 'Enter' || event.key === 'Space') {
        this.updateValue(<HTMLInputElement>event.target);
      }
    });
  }

  updateValue(target) {
    if (target.value.length < 1) {
      target.value = `${this.lastValue}`;
    }
  }

  inputChange(property, oldValue, newValue, watchable) {
    const maxPages = parseInt(this.ui.element.getAttribute('data-pagecount'), 10);
    this.lastValue = oldValue;
    if (isNaN(newValue)) { // eslint-disable-line
      watchable.value = oldValue;
      this.ui.element.setAttribute('data-currentpage', watchable.value);
      return;
    }
    if (newValue > maxPages) {
      watchable.value = maxPages;
      this.ui.element.setAttribute('data-currentpage', watchable.value);
      return;
    }
    if (newValue < 1 && newValue.length > 0) {
      watchable.value = 1;
      this.ui.element.setAttribute('data-currentpage', watchable.value);
      return;
    }
    this.ui.element.setAttribute('data-currentpage', watchable.value);
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
