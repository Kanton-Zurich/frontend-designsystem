/*!
 * TaxCalc
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import {
  TaxCalcDefaultOptions,
  TaxCalcModuleOptions //eslint-disable-line
} from './tax_calc.options';

class TaxCalc extends Module {
  public options: TaxCalcModuleOptions;

  public ui: {
    element: Element,
    formBase: HTMLElement,
    formItems: HTMLElement[],
    taxEntityInputs: HTMLInputElement[],
    taxTypeInputs: HTMLInputElement[],
    nextBtn: HTMLButtonElement,
  };

  private currentFormSection: number;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };

    super($element, defaultData, TaxCalcDefaultOptions, data, options);

    this.initUi();
    this.initEventListeners();

    this.initCalculator();
  }

  /**
   * Check for URL params
   */
  initCalculator() {
    const paramVal = this.getURLParam(this.options.paramKeyCalculator);
    let initialized = false;
    if (paramVal) {
      const calculatorId = paramVal[0];
      this.log('Init for specific calculator id.', calculatorId);
      this.ui.taxTypeInputs.forEach((inputCon) => {
        const actInput = inputCon.getElementsByTagName('input')[0];
        if (actInput.value === calculatorId) {
          const split = inputCon.getAttribute('data-tax_calc').split('-');
          if (split && split.length > 1) {
            const taxEntity = split[1];
            this.ui.taxEntityInputs.forEach((el) => {
              const inputEl = el.getElementsByTagName('input')[0];
              inputEl.checked = (taxEntity === inputEl.value);
            });
            this.enableCalculatorOptionsForEntity(taxEntity);
            this.activateFormSection(1);
            initialized = true;
          }
          actInput.checked = true;
          setTimeout(() => {
            this.onActiveSectionChange();
          }, 0);
        }
      });
    }

    if (!initialized) {
      this.log('Init empty calculator.');
      this.toNextFormSection();
    }
  }

  private toNextFormSection() {
    if (this.currentFormSection !== undefined) {
      const prevBlock = this.ui.formItems[this.currentFormSection];
      prevBlock.classList.remove(this.options.stateClasses.formItem.fixed);
      prevBlock.querySelector<HTMLButtonElement>('.mdl-accordion__button').click();
    }

    const nextSectIdx = (this.currentFormSection === undefined)
      ? 0 : this.currentFormSection + 1;

    this.activateFormSection(nextSectIdx);
  }

  private activateFormSection(sectionIdx: number) {
    this.ui.formItems.forEach((formSectionItem, i) => {
      const toggleBtn = formSectionItem.querySelector<HTMLButtonElement>('.mdl-accordion__button');
      toggleBtn.setAttribute('type', 'button'); // Do this for each to prevent unintended form submit.

      if (i < sectionIdx) {
        const sectioInputs = formSectionItem.querySelectorAll<HTMLInputElement>('input');
        const sectionVals: string[] = [];
        sectioInputs.forEach((inEl) => {
          if (inEl.type === 'radio' && inEl.checked) {
            const labelEl = formSectionItem.querySelector<HTMLLabelElement>(`label[for=${inEl.id}]`);
            sectionVals.push(labelEl.childNodes[0].nodeValue);
          }
        });
        const subHead = formSectionItem.querySelector<HTMLElement>('.mdl-accordion__subhead');
        if (subHead) {
          subHead.innerText = sectionVals.join(', ');
        }
        formSectionItem.classList.add(this.options.stateClasses.formItem.enabled);
      } else if (i === sectionIdx) {
        this.ui.nextBtn.classList.remove(this.options.stateClasses.nextBtn.show);
        formSectionItem.classList.add(this.options.stateClasses.formItem.enabled);
        setTimeout(() => {
          toggleBtn.click();
          formSectionItem.classList.add(this.options.stateClasses.formItem.fixed);

          this.watchFormSection(formSectionItem);
        }, 0);
        this.currentFormSection = sectionIdx;
      }
    });
  }

  private watchFormSection(sectionBlock: HTMLElement) {
    // TODO unwatch others
    // this.ui.formItems.

    const sectionInputs = sectionBlock.querySelectorAll<HTMLInputElement>('input');
    sectionInputs.forEach((inEl) => {
      inEl.addEventListener('change', this.onActiveSectionChange.bind(this));
    });
  }

  private onActiveSectionChange() {
    const nextBtnClasses = this.ui.nextBtn.classList;
    if (!nextBtnClasses.contains(this.options.stateClasses.nextBtn.show)) {
      nextBtnClasses.add(this.options.stateClasses.nextBtn.show);
    }
  }

  private checkOpenPanelHeights(): void {
    const openPanelContents = document.querySelectorAll<HTMLDivElement>('[aria-hidden="false"] [data-accordion="panel-content"]');
    this.log('Found OpenPanels: ', openPanelContents);

    openPanelContents.forEach((panelContent) => {
      const panelContentChildren = Array.prototype.slice.call(panelContent.children);
      let completeHeight = 0;

      panelContentChildren.forEach((child) => {
        if (typeof child.offsetHeight !== 'undefined') {
          const styles = window.getComputedStyle(child);
          const margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
          completeHeight += Math.ceil(child.offsetHeight + margin);
        }
      });

      panelContent.parentElement.style.maxHeight = `${completeHeight}px`;
    });
  }

  static get events() {
    return {
      // eventname: `eventname.${ TaxCalc.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate
      .on('click', this.options.domSelectors.nextBtn, () => {
        this.log('Next Section clicked.');
        this.ui.formItems.forEach((sectionCon) => {
          if (sectionCon.classList.contains(this.options.stateClasses.formItem.enabled)) {
            const section = sectionCon.querySelector('section');
            if (section) {
              this.log('Dispatch validate for section. ', section);
              this.ui.formBase.dispatchEvent(new CustomEvent('validateSection', {
                detail: {
                  section,
                },
              }));
            }
          }
        });

        setTimeout(() => {
          this.checkOpenPanelHeights();
          if (!this.ui.formBase.hasAttribute('form-has-errors')) {
            this.toNextFormSection();
          }
        }, 0);
      })
      .on('change', this.options.domSelectors.taxEntityInputs, (ev) => {
        const taxEntity: 'individual' | 'incorp' = ev.target.value;
        this.log('Changed value for Entity: ', taxEntity);
        this.enableCalculatorOptionsForEntity(taxEntity);
        if (this.formHasErrors()) {
          this.ui.nextBtn.classList.remove(this.options.stateClasses.nextBtn.show);
        }
      })
      .on('change', this.options.domSelectors.taxTypeInputs, (ev) => {
        const calculatorId = ev.target.value;
        this.log('CalculatorId: ', calculatorId);
        this.setCalculatorInURL(calculatorId);


        // window.location.href = `${this.getBaselUrl()}?calculatorId=${calculatorId}`;
        // TODO: Request Form from API
        // TODO: Prpeare folloup sections.
      });
  }

  private enableCalculatorOptionsForEntity(taxEntity: string) {
    if (taxEntity) {
      this.ui.taxTypeInputs.forEach((el) => {
        const taxTypeAttr = el.getAttribute('data-tax_calc');
        const split = taxTypeAttr.split('-');
        if (split[1] === taxEntity) {
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
        el.querySelector<HTMLInputElement>('input').checked = false;
      });
      this.checkOpenPanelHeights();
    }
  }

  /**
   * Method sets the parameter for the calculator id in URL without pageload.
   * Other parameters will be preserved.
   *
   * @param calculatorId
   */
  private setCalculatorInURL(calculatorId: string): void {
    const paramKey = this.options.paramKeyCalculator;
    const currentSearch = window.location.search.replace('?', '');
    let newSearchStr = '';
    if (currentSearch) {
      if (currentSearch.indexOf(`${paramKey}=`) > -1) {
        newSearchStr = currentSearch
          .replace(new RegExp(`(${paramKey}=).*?(&|$)`), `$1${calculatorId}$2`);
      } else {
        newSearchStr = `${currentSearch}&${paramKey}=${calculatorId}`;
      }
    } else {
      newSearchStr = `${paramKey}=${calculatorId}`;
    }
    window.history.replaceState(null, null, `?${newSearchStr}`);
  }

  private formHasErrors() {
    return !!this.ui.formBase.getAttribute('form-has-errors');
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default TaxCalc;
