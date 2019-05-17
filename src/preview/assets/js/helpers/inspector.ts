/**
 * Module inspector, outlines Estatico modules
 *
 * Start inspection with ctrl+m (same to switch off module inspection)
 */
import Helper from '../../../../assets/js/helpers/helper';

class Inspector extends Helper {
  public logger: Function;

  public state: any = {
    visible: false,
  };

  public DOM: any = {
    dataAttribute: 'estaticoDev',
    class: {
      moduleDecorator: 'estatico-dev-overlay',
      variantDecorator: 'estatico-dev-overlay--variant',
    },
  };

  constructor() {
    super();
    this.logger = this.log(Inspector.name);


    this.logger(`Initialized ${Inspector.name}`);
    document.addEventListener('DOMContentLoaded',
      () => {
        [].forEach.call(document.querySelectorAll('[class^=\'color_trigger\']'), (node) => {
          node.addEventListener('change', () => {
            const elem = document.getElementById('module_main');
            elem.className = elem.className.replace(/cv-\w+/, node.value);
          });
        });
      });
  }

  /**
   * Run
   */
  public run() {
    if (document.documentElement.classList) {
      // Set the mode we're in (1 = show modules, 0 = hide modules)
      if (!this.state.visible) {
        this.showModules();
      } else {
        this.hideModules();
      }
    } else {
      this.logger('Element.classList not supported in this browser');
    }
  }

  /**
   * Add class to all modules
   */
  public showModules() {
    [].forEach.call(document.querySelectorAll('[class]'), (node) => {
      let log = '';
      let module = '';
      const variations = [];
      const modulePrefix = 'm-';

      node.classList.forEach((className) => {
        if (className.substring(0, modulePrefix.length) === modulePrefix) {
          module = className.substring(modulePrefix.length).replace(/_/g, ' ');
        }

        if (className.match(/(.*?)--/)) {
          variations.push(className.replace(/(.*?)--/g, ''));
        }
      });

      if (module !== '') {
        log = module;
      }

      if (variations.length > 0) {
        log += `: ${variations.join(', ')}`;
      }

      if (log !== '') {
        this.logger([node, log]);

        node.classList.add(this.DOM.class.moduleDecorator);

        if (variations.length > 0) {
          node.classList.add(this.DOM.class.variantDecorator);
        }

        node.dataset[this.DOM.dataAttribute] = log; // eslint-disable-line no-param-reassign
      }
    });

    this.state.visible = 1;
  }

  /**
   * Remove class from modules
   */
  public hideModules() {
    [].forEach.call(document.querySelectorAll('[class]'), (node) => {
      node.classList.remove(this.DOM.class.moduleDecorator);
      node.classList.remove(this.DOM.class.variantDecorator);
    });

    this.state.visible = 0;
  }
}

export default Inspector;
