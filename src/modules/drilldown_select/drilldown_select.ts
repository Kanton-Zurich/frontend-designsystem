/*!
 * DrilldownSelect
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import Select from '../select/select';

class DrilldownSelect extends Module {
  public ui: {
    element: any,
    selects: any,
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        selects: '.mdl-select',
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

    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    // Listen to primary select change
    this.ui.selects[0].addEventListener(Select.events.valueChanged, (event) => {
      if (event.detail !== '') {
        this.setSecondarySelectFilter(event.detail);
      } else {
        this.ui.selects[1]
          .dispatchEvent(new CustomEvent(Select.events.disable, { detail: { disabled: true } }));
      }
      this.ui.selects[1]
        .dispatchEvent(new CustomEvent(Select.events.clear));
    });
  }

  /**
   * Update the secondary select and reset
   * @param value
   */
  setSecondarySelectFilter(value) {
    this.ui.selects[1]
      .dispatchEvent(new CustomEvent(Select.events.disable, { detail: { disabled: false } }));
    this.ui.selects[1]
      .dispatchEvent(new CustomEvent(Select.events.setFilter, { detail: { filterValue: value } }));
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default DrilldownSelect;
