/*!
 * TaxCalc
 *
 * @author
 * @copyright
 */
import { template } from 'lodash';
import Module from '../../assets/js/helpers/module';
import {
  TaxCalcDefaultOptions,
  TaxCalcModuleOptions //eslint-disable-line
} from './tax_calc.options';

interface CalculatorFormItemData {
  title: string;
  rows: {
    fields: any[];
  }[];
}

interface ApiFieldDefinition {
  type: string;
  mandatory: boolean;
  label: string;
  options?: {
    selected: boolean;
    value: string;
    code: string;
  }[];
  maxSize: number;
}

class TaxCalc extends Module {
  public options: TaxCalcModuleOptions;

  public ui: {
    element: Element,
    formBase: HTMLElement,
    formItems: HTMLElement[],
    taxEntityInputs: HTMLInputElement[],
    taxTypeInputs: HTMLInputElement[],
    btnContainer: HTMLElement,
    nextBtn: HTMLButtonElement,
    calculateBtn: HTMLButtonElement,
    formItemTemplate: HTMLScriptElement,
    fieldTemplates: HTMLElement[],
  };

  private readonly apiBase: string;
  private currentFormSection: number;
  private lastSectionIdx: number;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };

    super($element, defaultData, TaxCalcDefaultOptions, data, options);

    this.initUi();
    this.initEventListeners();

    this.apiBase = this.ui.element.getAttribute(this.options.attributeNames.apiBase);
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
          const split = inputCon.getAttribute(this.options.attributeNames.module).split('-');
          if (split && split.length > 1) {
            const taxEntity = split[1];
            this.ui.taxEntityInputs.forEach((el) => {
              const inputEl = el.getElementsByTagName('input')[0];
              inputEl.checked = (taxEntity === inputEl.value);
            });
            this.enableCalculatorOptionsForEntity(taxEntity);
            this.activateFormSection(1);

            this.prepareCalculatorForm(calculatorId).then(
              () => {
                this.toNextFormSection();
              },
              (reason) => {
                this.log('Failed to prepare form', reason);
                this.activateFormSection(0);
              },
            );
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
      const prevBlock = this.getFormSectionItems().item(this.currentFormSection);
      prevBlock.classList.remove(this.options.stateClasses.formItem.fixed);
      prevBlock.querySelector<HTMLButtonElement>('.mdl-accordion__button').click();
    }

    const nextSectIdx = (this.currentFormSection === undefined)
      ? 0 : this.currentFormSection + 1;
    this.log('NextSectionIdx: ', nextSectIdx);

    this.activateFormSection(nextSectIdx);
  }

  private getFormSectionItems(): NodeListOf<HTMLDivElement> {
    return document.querySelectorAll<HTMLDivElement>(this.options.domSelectors.formItems);
  }

  private activateFormSection(sectionIdx: number) {
    this.getFormSectionItems().forEach((formSectionItem, i) => {
      const toggleBtn = formSectionItem.querySelector<HTMLButtonElement>('.mdl-accordion__button');
      toggleBtn.setAttribute('type', 'button'); // Do this for each to prevent unintended form submit.

      if (i < sectionIdx) {
        const sectioInputs = formSectionItem.querySelectorAll<HTMLInputElement>('input');
        const sectionVals: string[] = [];
        sectioInputs.forEach((inEl) => {
          if (inEl.type === 'radio' && inEl.checked) {
            const labelEl = formSectionItem.querySelector<HTMLLabelElement>(`label[for=${inEl.id}]`);
            sectionVals.push(labelEl.childNodes[0].nodeValue);
          } else if (inEl.type === 'number') {
            const numVal = inEl.valueAsNumber;
            let numValStr = '0';
            if (!Number.isNaN(numVal)) {
              numValStr = numVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '’');
            }
            const valStr = `${inEl.placeholder}: ${numValStr}`;
            sectionVals.push(valStr);
          }
        });
        const subHead = formSectionItem.querySelector<HTMLElement>('.mdl-accordion__subhead');
        if (subHead) {
          subHead.innerText = sectionVals.join(', ');
        }
        formSectionItem.classList.add(this.options.stateClasses.formItem.enabled);
      } else if (i === sectionIdx) {
        this.ui.btnContainer.classList.remove(this.options.stateClasses.showsNextBtn);
        formSectionItem.classList.add(this.options.stateClasses.formItem.enabled);
        setTimeout(() => {
          toggleBtn.click();
          formSectionItem.classList.add(this.options.stateClasses.formItem.fixed);

          this.watchFormSection(formSectionItem);
        }, 0);

        if (sectionIdx === this.lastSectionIdx) {
          this.ui.calculateBtn.style.display = 'block';
          this.ui.nextBtn.style.display = 'none';
        } else {
          this.ui.calculateBtn.style.display = 'none';
          this.ui.nextBtn.style.display = 'block';
        }
        this.currentFormSection = sectionIdx;
      } else {
        formSectionItem.remove();
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
    const conClasses = this.ui.btnContainer.classList;
    if (!conClasses.contains(this.options.stateClasses.showsNextBtn)) {
      conClasses.add(this.options.stateClasses.showsNextBtn);
    }
  }

  private checkOpenPanelHeights(): void {
    const openPanelContents = document.querySelectorAll<HTMLDivElement>('[aria-hidden="false"] [data-accordion="panel-content"]');
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
      .on('click', `${this.options.domSelectors.btnContainer} button, a`, () => {
        this.log('Next Section clicked.');
        this.validateSections()
          .then(() => {
            if (this.currentFormSection === this.lastSectionIdx) {
              this.doSubmitForm();
            } else {
              this.toNextFormSection();
            }
          }).catch((reason) => {
            this.log('Form validation failed!', reason);
          });
      })
      .on('change', this.options.domSelectors.taxEntityInputs, (ev) => {
        const taxEntity: string = ev.target.value;
        this.enableCalculatorOptionsForEntity(taxEntity);
        if (this.formHasErrors()) {
          this.ui.nextBtn.classList.remove(this.options.stateClasses.showsNextBtn);
        }
        if (this.currentFormSection > 1) {
          this.activateFormSection(1);
        }
      })
      .on('change', this.options.domSelectors.taxTypeInputs, (ev) => {
        const calculatorId = ev.target.value;
        this.log('CalculatorId: ', calculatorId);
        this.setCalculatorInURL(calculatorId);
        this.prepareCalculatorForm(calculatorId);
      });
  }

  /**
   * Triggers from section validation and return a promise, which will rejected if validation fails.
   */
  private async validateSections() {
    document.querySelectorAll<HTMLElement>(this.options.domSelectors.formItems)
      .forEach((sectionCon, index) => {
        if (sectionCon.classList.contains(this.options.stateClasses.formItem.enabled)) {
          const section = sectionCon.querySelector('section');
          if (section) {
            this.log('Dispatch validate for section. ', section, index, this.currentFormSection);
            this.ui.formBase.dispatchEvent(new CustomEvent('validateSection', {
              detail: {
                sections: [section],
              },
            }));
          }
        }
      });

    return new Promise((resolve, reject) => setTimeout(() => {
      this.checkOpenPanelHeights();
      if (!this.ui.formBase.hasAttribute('form-has-errors')) {
        resolve();
      } else {
        reject();
      }
    }, 0));
  }

  private async prepareCalculatorForm(calculatorId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.options.availableCalculator.indexOf(calculatorId) > -1) {
        const path = calculatorId.toUpperCase();
        const url = `${this.apiBase}${path}`;

        this.fetchJsonData(url).then(
          (resp) => {
            const formItems = this.extractCalculatorFormData(resp);
            this.appendCalculatorSpecificFormItems(formItems);
            resolve();
          },
          (fetchFailReason) => {
            this.log('FormConfig fetch failed: ', fetchFailReason);
            reject(fetchFailReason);
          },
        );
      } else {
        reject(new Error('Unknown CalculatorId.'));
      }
    });
  }

  private extractCalculatorFormData(apiResp: any): CalculatorFormItemData[] {
    const formItemData: CalculatorFormItemData[] = [];
    const calcIdFromResp = apiResp.taxCalculatorId;

    if (calcIdFromResp === 'LEGAL_SIMPLE' || calcIdFromResp === 'LEGAL_ITERATIVE') {
      const rows = [
        {
          fields: [
            this.getFieldPartialByDefinition(apiResp, 'municipality'),
            this.getFieldPartialByDefinition(apiResp, 'taxYear'),
          ],
        },
        {
          fields: [
            this.getFieldPartialByDefinition(apiResp, 'earnings'),
            this.getFieldPartialByDefinition(apiResp, 'capital'),
          ],
        },
      ];
      formItemData.push({
        title: 'Ihre Angaben',
        rows,
      });
    } else if (calcIdFromResp === 'BENEFIT_PAYMENTS_FEDERAL') {
      const rows = [
        {
          fields: [
            this.getFieldPartialByDefinition(apiResp, 'taxYear'),
            this.getFieldPartialByDefinition(apiResp, 'taxScale'),
          ],
        },
        {
          fields: [
            this.getFieldPartialByDefinition(apiResp, 'benefitPayments'),
          ],
        },
      ];
      formItemData.push({
        title: 'Ihre Angaben',
        rows,
      });
    } else if (calcIdFromResp === 'INHERITANCE') {
      const rows = [
        {
          fields: [
            this.getFieldPartialByDefinition(apiResp, 'inheritanceAmount'),
          ],
        },
        {
          fields: [
            this.getFieldPartialByDefinition(apiResp, 'taxFreeAmount'),
            this.getFieldPartialByDefinition(apiResp, 'kinshipDegree'),
          ],
        },
      ];
      formItemData.push({
        title: 'Ihre Angaben',
        rows,
      });
    }
    return formItemData;
  }

  private getFieldPartialByDefinition(apiResp: any, fieldName: string): string {
    const apiFieldDef: ApiFieldDefinition = apiResp[fieldName];
    if (apiFieldDef && apiFieldDef.type) {
      this.log(this.ui.fieldTemplates);
      let tmplHtml;
      this.ui.fieldTemplates.forEach((templateNode) => {
        const tempFieldType = templateNode.getAttribute('data-tax_calc-template');
        if (tempFieldType === apiFieldDef.type.toLowerCase()) {
          tmplHtml = templateNode.innerHTML;
        }
      });
      if (tmplHtml) {
        const propsDataFromDef = this.getPropsDataFromDef(apiFieldDef, fieldName);
        return template(tmplHtml)(propsDataFromDef);
      }
    }
    return '';
  }

  private doSubmitForm() {
    this.log('Submit!!');
    this.toNextFormSection();
  }

  private getPropsDataFromDef(defByApi: ApiFieldDefinition, fieldId: string): any {
    const propData: any = {
      label: defByApi.label,
      fieldId,
      mandatory: defByApi.mandatory,
    };
    if (defByApi.type === 'List') {
      propData.selectOptions = defByApi.options.filter(
        opt => !(opt.code === 'PLEASE_SELECT' || opt.code === '0'), // Filters required hints like 'Bitte wählen', since this should be done by FE
      ).map(opt => ({
        value: opt.code,
        label: opt.value,
      }));
    } else if (defByApi.type === 'Number') {
      propData.max = defByApi.maxSize;
    }
    return propData;
  }

  private appendCalculatorSpecificFormItems(formItemsData: CalculatorFormItemData[]): void {
    const itemsParentNode = this.ui.formItems[0].parentNode;
    // Clear if already has form.
    itemsParentNode.querySelectorAll(this.options.domSelectors.formItems)
      .forEach((formSection, index) => {
        if (index > 1) {
          this.log('Remove for section: ', formSection);
          formSection.remove();
        }
      });
    this.currentFormSection = 1;

    formItemsData.forEach((itemData) => {
      const newItem = document.createElement('div');
      newItem.className = 'mdl-accordion__item mdl-tax_calc__form-block_item';
      newItem.setAttribute('data-accordion', 'item');
      newItem.innerHTML = template(this.ui.formItemTemplate.innerHTML)(itemData);
      itemsParentNode.appendChild(newItem);
      (<any>window).estatico.helpers.app.registerModulesInElement(newItem);
      (<any>window).estatico.helpers.app.initModulesInElement(newItem);
    });
    this.ui.calculateBtn.style.display = 'none';
    this.ui.nextBtn.style.display = 'block';
    this.lastSectionIdx = formItemsData.length + 1;
  }

  private enableCalculatorOptionsForEntity(taxEntity: string) {
    if (this.options.availableEntities.indexOf(taxEntity) > -1) {
      this.ui.taxTypeInputs.forEach((el) => {
        const taxTypeAttr = el.getAttribute(this.options.attributeNames.module);
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
