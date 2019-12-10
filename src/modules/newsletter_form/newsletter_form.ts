/*!
 * NewsletterForm
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class NewsletterForm extends Module {
  public ui: {
    element: any,
    formInput: HTMLInputElement,
    formInputWrapper: HTMLDivElement,
    form: HTMLFormElement,
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        formInput: '.atm-form_input input',
        formInputWrapper: '.atm-form_input',
        form: '.mdl-newsletter_form__form',
      },
      stateClasses: {
        // activated: 'is-activated'
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      // eventname: `eventname.${ NewsletterForm.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    // Event listeners
    this.ui.form.addEventListener('submit', (event: any) => {
      this.ui.formInput.dispatchEvent(new CustomEvent('validateDeferred', { detail: { field: this.ui.formInput } }));
      if (this.ui.formInputWrapper.classList.contains('invalid')) {
        event.preventDefault();
      }
    });
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default NewsletterForm;
