/*!
 * FormInput
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class FormInput extends Module {
  private tagName: string;
  private buttonType: string;
  private pattern: string;
  private hasPattern: boolean;
  private svg: HTMLElement;

  public defaultOptions: {
    domSelectors: {
      input: string,
      button: string,
      svg: string,
    },
    stateClasses: {
      passwordShowIcon: string,
      passwordHideIcon: string,
      pristine: string,
      dirty: string,
      valid: string,
      invalid: string,
    },
  };
  public ui: {
    element: any,
    button: any,
    input: any,
    svg: any,
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        input: '.mdl-form_input__input',
        button: 'button',
        svg: 'svg use',
      },
      stateClasses: {
        passwordShowIcon: '#show',
        passwordHideIcon: '#hide',
        pristine: 'pristine',
        dirty: 'dirty',
        valid: 'valid',
        invalid: 'invalid',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.hasPattern = false;

    this.initUi();
    this.initEventListeners();

    this.tagName = this.ui.input.tagName;

    if (this.ui.input.dataset.pattern !== undefined) {
      this.hasPattern = true;
      this.pattern = this.ui.input.getAttribute('pattern');
    }

    this.ui.input.classList.add(this.options.stateClasses.pristine);

    if (this.ui.button !== undefined) {
      this.buttonType = this.ui.button.dataset.buttontype;
      this.addButtonEventListeners();
    }
  }

  static get events() {
    return {
      // eventname: `eventname.${ FormInput.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate
      .on('keyup', this.options.domSelectors.input, this.onKeyUp.bind(this))
      .on('blur', this.options.domSelectors.input, this.onInputBlur.bind(this));
  }

  /**
   * Add eventlistener when input contains button functionality
   */
  addButtonEventListeners() {
    this.eventDelegate
      .on('click', this.options.domSelectors.button, this.onButtonClick.bind(this));
  }

  /**
   * Handle blur event callback on input
   */
  onInputBlur() {
    if (this.ui.input.value.length === 0) {
      this.ui.input.classList.add(this.options.stateClasses.pristine);
      this.ui.input.classList.remove(this.options.stateClasses.dirty);
      this.ui.input.classList.remove(this.options.stateClasses.valid);
      this.ui.input.classList.remove(this.options.stateClasses.invalid);
    }
  }

  /**
   * Handle keyup event callback on input
   */
  onKeyUp() {
    if (this.ui.input.value.length > 0) {
      this.ui.input.classList.remove(this.options.stateClasses.pristine);
      this.ui.input.classList.add(this.options.stateClasses.dirty);
    }

    if (this.ui.input.value.length === 0) {
      this.ui.input.classList.add(this.options.stateClasses.pristine);
      this.ui.input.classList.remove(this.options.stateClasses.dirty);
      this.ui.input.classList.remove(this.options.stateClasses.valid);
      this.ui.input.classList.remove(this.options.stateClasses.invalid);
    } else if (this.hasPattern) {
      this.ui.input.classList.remove(this.options.stateClasses.pristine);
      this.validatePattern();
    } else if (this.tagName === 'TEXTAREA') {
      // VALIDATE e.g. MIN/MAX LENGTH
    }
  }

  /**
   * Validate input value against the pattern attribute
   */
  validatePattern() {
    // Usefull regex example:
    // http://azanebrain.github.io/presentations/foundation5/foundation-docs/components/abide.html#optional-javascript-configuration
    const regex = RegExp(this.pattern);

    if (regex.test((<any> this.ui).input.value)) {
      this.ui.input.classList.add(this.options.stateClasses.valid);
      this.ui.input.classList.remove(this.options.stateClasses.invalid);
    } else {
      this.ui.input.classList.add(this.options.stateClasses.invalid);
      this.ui.input.classList.remove(this.options.stateClasses.valid);
    }
  }

  /**
   * Click callback on input additional function buttons
   */
  onButtonClick() {
    if (this.buttonType === 'text') {
      this.clearText();
      this.onInputBlur();
    } else if (this.buttonType === 'password') {
      this.toggleInputType();
    }
  }

  /**
   * Toggle input type and button icon correspondingly between text and password
   */
  toggleInputType() {
    const showClass = this.options.stateClasses.passwordShowIcon;
    const hideClass = this.options.stateClasses.passwordHideIcon;

    if (this.ui.input.type === 'password') {
      this.ui.input.type = 'text';
      this.ui.svg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', showClass);
    } else {
      this.ui.input.type = 'password';
      this.ui.svg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', hideClass);
    }
  }

  /**
   * Clear the content of the input
   */
  clearText() {
    this.ui.input.value = '';
    this.ui.input.focus();
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default FormInput;
