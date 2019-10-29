/*!
 * TaxCalc
 *
 * @author
 * @copyright
 */
import { template, cloneDeep } from 'lodash';
import Module from '../../assets/js/helpers/module';
import {
  TaxCalcDefaultOptions,
  TaxCalcModuleOptions //eslint-disable-line
} from './tax_calc.options';
import namespace from '../../assets/js/helpers/namespace';

interface CalculatorFormItemData {
  title: string;
  rows: {
    fields: any[];
  }[];
}

interface ApiFieldDefinition {
  type: string;
  mandatory: boolean;
  reinvokeTrigger: boolean;
  label: string;
  options?: {
    selected: boolean;
    value: string;
    code: string;
  }[];
  maxSize?: number;
  value?: number;
  hint: string;
}

class TaxCalc extends Module {
  public options: TaxCalcModuleOptions;

  public ui: {
    element: Element,
    formBase: HTMLFormElement,
    formItems: HTMLElement[],
    taxEntityInputs: HTMLInputElement[],
    taxTypeInputs: HTMLInputElement[],
    nextBtn: HTMLButtonElement,
    formItemTemplate: HTMLScriptElement,
    fieldTemplates: HTMLElement[],
    formLayoutConfig: HTMLScriptElement,
  };

  private readonly apiBase: string;
  private calculatorUrl: string;

  private currentFormSection: number;
  private lastSectionIdx: number;

  private formConfig: any;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };

    super($element, defaultData, TaxCalcDefaultOptions, data, options);

    this.initUi();
    this.initEventListeners();

    this.apiBase = this.ui.element.getAttribute(this.options.attributeNames.apiBase);
    this.initCalculator();

    try {
      this.formConfig = JSON.parse(this.ui.formLayoutConfig.innerText);
    } catch (e) {
      this.log('Failed to parse donfig JSON: ', this.ui.formLayoutConfig.innerText);
      this.log(e, this.ui.formLayoutConfig.innerText);
    }
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
        this.ui.nextBtn.classList.remove(this.options.stateClasses.nextBtn.showing);
        formSectionItem.classList.add(this.options.stateClasses.formItem.enabled);
        setTimeout(() => {
          toggleBtn.click();
          formSectionItem.classList.add(this.options.stateClasses.formItem.fixed);

          this.watchFormSection(formSectionItem);
        }, 0);

        if (sectionIdx === this.lastSectionIdx) {
          this.ui.nextBtn.classList.add(this.options.stateClasses.nextBtn.calculate);
          this.ui.nextBtn.classList.remove(this.options.stateClasses.nextBtn.next);
        } else {
          this.ui.nextBtn.classList.remove(this.options.stateClasses.nextBtn.calculate);
          this.ui.nextBtn.classList.add(this.options.stateClasses.nextBtn.next);
        }
        this.currentFormSection = sectionIdx;
      } else {
        formSectionItem.classList.remove(this.options.stateClasses.formItem.fixed);
        formSectionItem.classList.remove(this.options.stateClasses.formItem.open);
        formSectionItem.classList.remove(this.options.stateClasses.formItem.enabled);
      }
    });
  }

  private watchFormSection(sectionBlock: HTMLElement) {
    // TODO unwatch others
    // this.ui.formItems.

    const sectionInputs = sectionBlock.querySelectorAll<HTMLInputElement>('input');
    sectionInputs.forEach((inEl) => {
      inEl.addEventListener('change', this.onActiveSectionChange.bind(this));

      if (inEl.getAttribute(this.options.attributeNames.reinvoke)) {
        inEl.addEventListener('change', this.onReinvokeTriggerChange.bind(this));
      }
    });
  }

  private onActiveSectionChange() {
    const conClasses = this.ui.nextBtn.classList;
    if (!conClasses.contains(this.options.stateClasses.nextBtn.showing)) {
      conClasses.add(this.options.stateClasses.nextBtn.showing);
    }
  }

  private async onReinvokeTriggerChange() {
    this.log('Reinvoke triggered!');
    this.postCalculatorFormData(this.calculatorUrl).then((reinvokeResp) => {
      this.log('ReinvokeResponse:', reinvokeResp);
      const formItems = this.buildFormItemsFromResp(reinvokeResp, true);
      this.log('formItems: ', formItems);
      this.setFormItems(formItems, true);
      this.ui.nextBtn.classList.remove(this.options.stateClasses.nextBtn.loading);
      setTimeout(() => {
        this.activateFormSection(this.currentFormSection);
        this.onActiveSectionChange();
      });
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
        this.log('Next clicked.');
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
          this.ui.nextBtn.classList.remove(this.options.stateClasses.nextBtn.showing);
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

  private async prepareCalculatorForm(calculatorId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.options.availableCalculator.indexOf(calculatorId) > -1) {
        const path = calculatorId.toUpperCase();
        this.calculatorUrl = `${this.apiBase}${path}`;

        this.ui.nextBtn.classList.add(this.options.stateClasses.nextBtn.loading);
        this.fetchJsonData(this.calculatorUrl).then(
          (resp) => {
            const formItems = this.buildFormItemsFromResp(resp);
            this.setFormItems(formItems);
            this.ui.nextBtn.classList.remove(this.options.stateClasses.nextBtn.loading);
            resolve();
          },
          (fetchFailReason) => {
            this.log('FormConfig fetch failed: ', fetchFailReason);
            this.ui.nextBtn.classList.remove(this.options.stateClasses.nextBtn.loading);
            reject(fetchFailReason);
          },
        );
      } else {
        this.ui.nextBtn.classList.remove(this.options.stateClasses.nextBtn.loading);
        reject(new Error('Unknown CalculatorId.'));
      }
    });
  }

  private buildFormItemsFromResp(apiResp: any, setValuesFromResp = false)
    : CalculatorFormItemData[] {
    const calcIdFromResp = apiResp.taxCalculatorId;
    const formItems = this.getCalculatorFormLayout(calcIdFromResp);
    this.log('FormItems in Build', formItems);
    formItems.forEach((formItem) => {
      formItem.rows.forEach((row) => {
        row.fields = row.fields
        // fillin field partials
          .map(fieldName => this
            .getFieldPartialByDefinition(apiResp, fieldName, setValuesFromResp));
      });
    });
    return formItems;
  }

  private getFieldPartialByDefinition(apiResp: any, fieldName: string, setValuesFromApiResp = false)
    : string {
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
        const propsDataFromDef = this
          .getPropsDataFromDef(apiFieldDef, fieldName, setValuesFromApiResp);
        return template(tmplHtml)(propsDataFromDef);
      }
    }
    return '';
  }

  private getPropsDataFromDef(defByApi: ApiFieldDefinition, fieldName: string, setFromDef = false) {
    const propData: any = {
      label: defByApi.label,
      fieldName,
      mandatory: defByApi.mandatory,
      reinvokeTrigger: defByApi.reinvokeTrigger,
      hint: defByApi.hint,
    };
    if (defByApi.type === 'List') {
      propData.selectOptions = defByApi.options.filter(
        opt => !(opt.code === 'PLEASE_SELECT' || opt.code === '0'), // Filters required hints like 'Bitte wählen', since this should be done by FE
      ).map(opt => ({
        selected: setFromDef ? opt.selected : false,
        value: opt.code,
        label: opt.value,
      }));
    } else if (defByApi.type === 'Number') {
      propData.max = defByApi.maxSize;
      if (setFromDef && defByApi.value !== undefined && defByApi.value !== null) {
        propData.value = defByApi.value.toString(10);
      } else {
        propData.value = '';
      }
    } else if (defByApi.type === 'Boolean') {
      propData.value = setFromDef ? defByApi.value : false;
    } else if (defByApi.type === 'Date') {
      propData.value = setFromDef ? defByApi.value : '';
    }
    return propData;
  }

  private setFormItems(formItemsData: CalculatorFormItemData[], preserveSection?: boolean): void {
    const itemsParentNode = this.ui.formItems[0].parentNode;
    // Clear if already has form.
    itemsParentNode.querySelectorAll(this.options.domSelectors.formItems)
      .forEach((formSection, index) => {
        if (index > 1) {
          this.log('Remove for section: ', formSection);
          formSection.remove();
        }
      });
    if (!preserveSection) {
      this.currentFormSection = 1;
    }

    formItemsData.forEach((itemData) => {
      const newItem = document.createElement('div');
      newItem.className = 'mdl-accordion__item mdl-tax_calc__form-block_item';
      newItem.setAttribute('data-accordion', 'item');
      newItem.innerHTML = template(this.ui.formItemTemplate.innerHTML)(itemData);
      itemsParentNode.appendChild(newItem);
      (<any>window).estatico.helpers.app.registerModulesInElement(newItem);
      (<any>window).estatico.helpers.app.initModulesInElement(newItem);
    });
    this.ui.nextBtn.classList.add(this.options.stateClasses.nextBtn.next);
    this.ui.nextBtn.classList.remove(this.options.stateClasses.nextBtn.calculate);
    this.lastSectionIdx = formItemsData.length + 1;
  }

  private getCalculatorFormLayout(calcIdFromResp: string)
    : { title: string,
        rows: { fields: string[]}[]
      }[] {
    let formLayout;
    this.log('FormConfig currently is', this.formConfig);
    if (this.formConfig && this.formConfig[calcIdFromResp]) {
      formLayout = cloneDeep(this.formConfig[calcIdFromResp]);
    }
    return formLayout;
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

  private doSubmitForm() {
    this.log('Submit!!');
    const url = `${this.calculatorUrl}/calculate`;
    this.postCalculatorFormData(url).then((resp) => {
      this.log('Calculate Response:', resp);
    });
    this.toNextFormSection();
  }

  private async postCalculatorFormData(endpoint: string) {
    const formData = window[namespace].form.formToJSON(this.ui.formBase.elements, true);
    delete formData.taxEntity;
    delete formData.taxType;

    this.ui.nextBtn.classList.add(this.options.stateClasses.nextBtn.loading);
    return new Promise<any>((resolve, reject) => {
      this.log('Post formdata to endpoint.', formData);
      if (formData) {
        this.postJsonData(endpoint, formData).then((resp) => {
          this.log('Api Response:', resp);
          this.ui.nextBtn.classList.remove(this.options.stateClasses.nextBtn.loading);
          resolve(resp);
        }, reject);
      } else {
        reject(new Error('Invalid form data!'));
      }
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

  private formHasErrors() {
    return !!this.ui.formBase.getAttribute('form-has-errors');
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

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default TaxCalc;
