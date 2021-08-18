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
        const variantsInput = [].slice.call(document.querySelectorAll('input[name="variants"]'));
        variantsInput.forEach((input) => {
          input.addEventListener('change', (event) => {
            Inspector.triggerVariantChangeOnElement(<any>event.target);
          });
        });

        [].forEach.call(document.querySelectorAll('[class^=\'color_trigger\']'), (node) => {
          node.addEventListener('change', () => {
            Inspector.triggerColorChangeOnElement(node);
          });
        });

        [].forEach.call(document.querySelectorAll('.sg_code__button'), (node) => {
          node.addEventListener('click', () => {
            node.nextElementSibling.classList.toggle('sg_code--show');
          });
        });

        const moduleFilters = [].slice.call(document.querySelectorAll('.sg_filter-frame input'));
        moduleFilters.forEach((input) => {
          input.addEventListener('change', (event) => {
            Inspector.triggerFilterChangeOnElement(<any>event.target);
          });
          if (input.type === 'text') {
            input.addEventListener('keyup', (event) => {
              Inspector.triggerFilterChangeOnElement(<any>event.target);
            });
          }
        });
        if (variantsInput.length > 0) {
          Inspector.triggerVariantChangeOnElement(variantsInput[0]);
        }
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

  public static triggerColorChangeOnElement(node) {
    const elem = document.getElementById('module_main');
    elem.className = elem.className.replace(/cv-\w+/, node.value);
  }

  public static triggerVariantChangeOnElement(node) {
    const selectorIndex = node.getAttribute('id')
      .replace('variants', '');
    [].slice.call(document.querySelectorAll('.labels label')).forEach((label) => {
      label.classList.add('atm-button--secondary');
    });
    document.querySelector(`#tabLabel${selectorIndex}`).classList.remove('atm-button--secondary');
    const panel = document.querySelector(`#panel${selectorIndex}`);
    const disabledColorVariationsElement = document
      .getElementById(`disabledColorVariations${selectorIndex}`);
    // update color exceptions
    if (disabledColorVariationsElement) {
      const disabledColors = JSON
        .parse(decodeURIComponent(disabledColorVariationsElement
          .getAttribute('value')));
      const defaultColor = document
        .getElementById(`defaultColorVariation${selectorIndex}`).getAttribute('value');
      [].slice.call(document.querySelectorAll('input[name="colorVariations"]')).forEach((cvInput: HTMLInputElement) => {
        cvInput.disabled = disabledColors.indexOf(cvInput.getAttribute('value')) >= 0;
        if (cvInput.getAttribute('value') === defaultColor) {
          cvInput.checked = true;
          Inspector.triggerColorChangeOnElement(cvInput);
        } else {
          cvInput.checked = false;
        }
      });
    }
    // Sending event to all children who have to be redrawn
    (<any>window).estatico.helpers.sendRedrawEvent(panel);
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('eventname.global.vertical_resize'));
    }, 100);
  }

  public static triggerFilterChangeOnElement(node) {
    const allModules = [].slice.call(document.querySelectorAll('li[data-label-index]'));
    if (node.value === 'nofilter' || node.value === '') {
      allModules.forEach((li) => {
        li.style.display = 'block';
      });
      return;
    }
    allModules.forEach((li) => {
      li.style.display = 'none';
    });

    const selector = node.type === 'text' ? 'li[data-label-index]' : `li[data-label-index="${node.value}"]`;
    const selectedModules = [].slice.call(document.querySelectorAll(selector));
    selectedModules.forEach((li) => {
      // eslint-disable-next-line no-magic-numbers
      if (node.type === 'text' && node.value.length >= 2) {
        const title = li.querySelector('.atm-content_teaser__title').innerHTML;
        const regex = new RegExp(`${node.value}\\w*`);
        if (!title.match(regex)) return;
      }
      li.style.display = 'block';
    });
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
