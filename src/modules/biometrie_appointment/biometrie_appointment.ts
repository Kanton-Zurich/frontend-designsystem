/*!
 * BiometrieAppointment
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class BiometrieAppointment extends Module {
  public options: {
    domSelectors: {
      inputFields: string,
      openCarousel: string,
      carousel: string,
    }
    stateClasses: {
    }
  };


  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        inputFields: '[data-biometrie_appointment="input"]',
      },
      stateClasses: {
        // activated: 'is-activated'
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();


    console.log('Initialised? ', this);
  }

  static get events() {
    return {
      // eventname: `eventname.${ BiometrieAppointment.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    // Event listeners

    this.eventDelegate
      .on('keydown', this.options.domSelectors.inputFields, (event) => {
        this.log('Event KeyDown: ', event);
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

export default BiometrieAppointment;
