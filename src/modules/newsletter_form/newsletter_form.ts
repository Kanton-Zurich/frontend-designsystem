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
    formInputs: any,
    formInputWrappers: any,
    form: HTMLFormElement,
    submitButton: HTMLButtonElement,
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        formInputs: '.atm-form_input input',
        formInputWrappers: '.atm-form_input',
        form: 'form',
        submitButton: '.atm-button',
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
    this.ui.submitButton.addEventListener('click', () => {
      if (this.ui.formInputs.length) {
        this.ui.formInputs.forEach((formInput) => {
          formInput.dispatchEvent(new CustomEvent('validateDeferred', { detail: { field: formInput } }));
        });
      } else {
        this.ui.formInputs.dispatchEvent(new CustomEvent('validateDeferred', { detail: { field: this.ui.formInputs } }));
      }
    });
    this.ui.form.addEventListener('submit', (event: any) => {
      if (this.ui.formInputWrappers.length) {
        this.ui.formInputWrappers.forEach((formInputWrapper) => {
          if (formInputWrapper.classList.contains('invalid')) {
            event.preventDefault();
          }
        });
      } else if (this.ui.formInputWrappers.classList.contains('invalid')) {
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
