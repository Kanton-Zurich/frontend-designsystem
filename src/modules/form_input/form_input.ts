/*!
 * FormInput
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import namespace from '../../assets/js/helpers/namespace';

class FormInput extends Module {
  private buttonType: string;
  private svg: HTMLElement;
  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        input: 'input',
        button: 'button',
        svg: 'svg use',
      },
      stateClasses: {
        passwordShowIcon: '#show',
        passwordHideIcon: '#hide',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();

    if ((<any> this.ui).button != undefined) {
      this.buttonType = (<any> this.ui).button.dataset.buttontype;
      this.initEventListeners();
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
      .on('click', this.options.domSelectors.button, this.onButtonClick.bind(this));
  }

  /**
   * Click callback
   */
  onButtonClick() {
    if (this.buttonType === 'text') {
      this.clearText();
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

    if ((<any> this.ui).input.type === 'password') {
      (<any> this.ui).input.type = 'text';
      (<any> this.ui).svg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', showClass);
    } else {
      (<any> this.ui).input.type = 'password';
      (<any> this.ui).svg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', hideClass);
    }
  }

  /**
   * Clear the content of the input
   */
  clearText() {
    (<any> this.ui).input.value = '';
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
