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
import WindowEventListener from '../../assets/js/helpers/events';
import jump from 'jump.js';

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

interface TableRow {
  entries: string[];
  isHighlighted: boolean;
}
interface TableBlockProperties {
  blockHead: string;
  headRow: string[];
  bodyRows: TableRow[];
  caption?: string;
}

class TaxCalc extends Module {
  public options: TaxCalcModuleOptions;

  public ui: {
    element: Element,
    formBase: HTMLFormElement,
    formItems: HTMLElement[],
    taxEntityInputs: HTMLInputElement[],
    taxTypeInputs: HTMLInputElement[],
    apiErrorNotification: HTMLElement,
    nextBtn: HTMLButtonElement,
    resultBlock: HTMLElement,
    resultTaxYear: HTMLElement,
    resultContainer: HTMLElement,
    formItemTemplate: HTMLScriptElement,
    fieldTemplates: HTMLElement[],
    tableBlockTemplate: HTMLScriptElement,
    remarkBlockTemplate: HTMLScriptElement,
    formLayoutConfig: HTMLScriptElement,
    resultTableConfig: HTMLScriptElement,
  };

  private readonly apiBase: string;
  private calculatorUrl: string;

  private currentFormSection: number;
  private lastSectionIdx: number;

  private readonly formConfig: any;
  private readonly resultTableConfig: any;

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
      this.log('Failed to parse form config JSON: ', e, this.ui.formLayoutConfig.innerText);
    }
    try {
      this.resultTableConfig = JSON.parse(this.ui.resultTableConfig.innerText);
    } catch (e) {
      this.log('Failed to parse form config JSON: ', e, this.ui.formLayoutConfig.innerText);
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
            this.onFormChange();
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
    const formSectionItems = this.getFormSectionItems();
    formSectionItems.forEach((formSectionItem, i) => {
      const toggleBtn = formSectionItem.querySelector<HTMLButtonElement>('.mdl-accordion__button');
      toggleBtn.setAttribute('type', 'button'); // Do this for each to prevent unintended form submit.

      if (i <= sectionIdx) {
        const sectioInputs = formSectionItem.querySelectorAll<HTMLElement>('.atm-form_input button, input');
        sectioInputs.forEach((el) => {
          el.removeAttribute('tabindex');
        });
      }
      if (i < sectionIdx) {
        const sectioInputs = formSectionItem.querySelectorAll<HTMLInputElement>('input');
        const sectionVals: string[] = [];
        sectioInputs.forEach((inEl) => {
          if (inEl.type === 'radio' && inEl.checked) {
            const labelEl = formSectionItem.querySelector<HTMLLabelElement>(`label[for=${inEl.id}]`);
            sectionVals.push(labelEl.childNodes[0].nodeValue);
          } else if (inEl.type === 'checkbox' && inEl.checked) {
            sectionVals.push(inEl.value);
          } else if (inEl.type === 'number') {
            const numVal = inEl.valueAsNumber;
            let numValStr = '0';
            if (!Number.isNaN(numVal)) {
              numValStr = this.currencyNumberValueToString(numVal);
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
        toggleBtn.setAttribute('aria-disabled', 'false');

        if (i === formSectionItems.length - 1) {
          setTimeout(() => {
            toggleBtn.click();
            setTimeout(() => {
              this.ui.nextBtn.focus();
            }, this.options.transitionTimeout);
          }, this.options.transitionTimeout);
        }
      } else if (i === sectionIdx) {
        this.ui.nextBtn.classList.remove(this.options.stateClasses.nextBtn.showing);
        formSectionItem.classList.add(this.options.stateClasses.formItem.enabled);
        setTimeout(() => {
          toggleBtn.click();
          formSectionItem.classList.add(this.options.stateClasses.formItem.fixed);
          toggleBtn.setAttribute('aria-disabled', 'true');

          this.watchFormSection(formSectionItem);

          setTimeout(() => {
            const firstSectionInput = formSectionItem.querySelector<HTMLElement>('.atm-form_input button, input');
            this.log('Focus on', firstSectionInput);
            firstSectionInput.focus();
          }, this.options.transitionTimeout);
        });

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

  private currencyNumberValueToString(numVal: number, forceFloat?: boolean): string {
    let str = numVal.toString();
    if (forceFloat) {
      str = numVal.toFixed(2); // eslint-disable-line no-magic-numbers
    }
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, '’');
  }

  private watchFormSection(sectionBlock: HTMLElement) {
    const sectionInputs = sectionBlock.querySelectorAll<HTMLInputElement>('input');
    sectionInputs.forEach((inEl) => {
      if (inEl.type === 'number' || inEl.type === 'text') {
        inEl.addEventListener('keyup', this.onFormChange.bind(this));
      } else {
        inEl.addEventListener('change', this.onFormChange.bind(this));
      }

      if (inEl.getAttribute(this.options.attributeNames.reinvoke)) {
        inEl.addEventListener('change', this.onReinvokeTriggerChange.bind(this));
      }
    });
  }

  private onFormChange() {
    const conClasses = this.ui.nextBtn.classList;
    // if (!conClasses.contains(this.options.stateClasses.nextBtn.showing)) {
    setTimeout(() => {
      const requiredBeforeNext = document.querySelectorAll<HTMLInputElement>(`.${this.options.stateClasses.formItem.fixed} input[required]`);
      let allFilled = true;
      requiredBeforeNext.forEach((requiredInEl) => {
        if (requiredInEl.type === 'number' || requiredInEl.type === 'text') {
          allFilled = allFilled && requiredInEl.classList.contains('dirty');
        } else if (requiredInEl.type === 'radio') {
          const selectUl = requiredInEl.parentElement.parentElement;
          if (selectUl.querySelector('input:checked') == null) {
            allFilled = false;
          }
        }
      });

      if (allFilled) {
        conClasses.add(this.options.stateClasses.nextBtn.showing);
      } else {
        conClasses.remove(this.options.stateClasses.nextBtn.showing);
      }
    }, this.options.transitionTimeout);
    // }
    setTimeout(() => {
      this.checkOpenPanelHeights();
    }, this.options.transitionTimeout);
    this.ui.apiErrorNotification.style.maxHeight = '0';
  }

  private async onReinvokeTriggerChange() {
    this.log('Reinvoke triggered!');
    this.postCalculatorFormData(this.calculatorUrl).then((reinvokeResp) => {
      this.log('ReinvokeResponse:', reinvokeResp);
      const formItems = this.buildFormItemsFromResp(reinvokeResp, true);
      this.setFormItems(formItems, true);
      this.ui.nextBtn.classList.remove(this.options.stateClasses.nextBtn.loading);
      setTimeout(() => {
        this.activateFormSection(this.currentFormSection);
        this.onFormChange();
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
      .on('blur', this.options.domSelectors.openSectionsValidationInputs, () => {
        // Form validation on field will be triggered by blur, so check Panel heights.
        setTimeout(() => {
          this.checkOpenPanelHeights();
        });
      })
      .on('change', this.options.domSelectors.taxEntityInputs, (ev) => {
        this.ui.element.classList.remove(this.options.stateClasses.hasResult);

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
        this.ui.element.classList.remove(this.options.stateClasses.hasResult);

        const calculatorId = ev.target.value;
        this.log('CalculatorId: ', calculatorId);
        this.setCalculatorInURL(calculatorId);
        this.prepareCalculatorForm(calculatorId).catch(() => {
          this.onFormException(`Invalid calculatorId: ${calculatorId}`);
        });
      })
      .on('click', this.options.domSelectors.editBtn, () => {
        jump(this.options.domSelectors.formBase);
      });
  }

  private initStickyEditBtn(): void {
    const toFormBtn = document.querySelector<HTMLElement>('.mdl-tax_calc__toformbtn');
    const toFormBtnAnker = document.querySelector<HTMLElement>('.mdl-tax_calc__toformbtn_anker');

    WindowEventListener.addEventListener('scroll', () => {
      const rectheight = toFormBtn.getBoundingClientRect().height;
      const ankerBt = toFormBtnAnker.getBoundingClientRect().bottom;
      if (ankerBt > window.innerHeight) {
        toFormBtn.style.top = `${ankerBt - rectheight}px`;
      } else {
        toFormBtn.style.top = null;
      }
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
            const formItems = this.buildFormItemsFromResp(resp, true);
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
        this.log('Unknown Calculator Id: ', calculatorId);
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
        const tempFieldType = templateNode
          .getAttribute(this.options.attributeNames.fieldTemplateType);
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
      newItem.className = this.options.stateClasses.formItem.newClasses;
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

  private setResultBlocks(blocksProps: TableBlockProperties[], remarks: string[]): void {
    this.ui.resultContainer.innerHTML = '';

    blocksProps.forEach((props) => {
      const newItem = document.createElement('div');
      newItem.innerHTML = template(this.ui.tableBlockTemplate.innerHTML)(props);
      this.ui.resultContainer.appendChild(newItem);
      (<any>window).estatico.helpers.app.registerModulesInElement(newItem);
      (<any>window).estatico.helpers.app.initModulesInElement(newItem);
    });

    if (remarks && remarks.length > 0) {
      const remarkItem = document.createElement('div');
      remarkItem.innerHTML = template(this.ui.remarkBlockTemplate.innerHTML)({ remarks });
      this.ui.resultContainer.appendChild(remarkItem);
    }
  }

  private getRemarksFromResponse(resp: any): string[] {
    const calcId = resp.taxCalculatorId;
    const remarks: string[] = [];

    const resultRemarkConfigs = this.resultTableConfig[calcId].remarks;
    resultRemarkConfigs.forEach((key) => {
      const remarkObj = resp[key];
      if (remarkObj) {
        remarks.push(remarkObj.value);
      }
    });

    return remarks;
  }

  private getTablePropertiesFromResponse(resp: any): TableBlockProperties[] {
    const calcId = resp.taxCalculatorId;
    this.log('Generating result tables for calculator: ', calcId);
    const tables: TableBlockProperties[] = [];

    const resultTableConfigs = this.resultTableConfig[calcId].tables;
    if (resultTableConfigs && resultTableConfigs.length > 0) {
      resultTableConfigs.forEach((conf) => {
        const confClone = cloneDeep(conf);
        const bodyRows = confClone.fieldRows.map(rowConf => ({
          entries: rowConf.entries.map(path => this.getResponseValByPath(resp, path))
            .map(e => (e === undefined || e === null ? '' : e)),
          isHighlighted: rowConf.isHighlighted === true,
        })).filter(row => row.entries.reduce((acc, cur) => cur.length + acc, 0) > 0);
        tables.push({
          blockHead: confClone.heading,
          headRow: confClone.thead,
          bodyRows,
          caption: confClone.caption,
        });
      });
    }

    this.log('Result table properties from response: ', tables);
    return tables;
  }

  private getResponseValByPath(respObj: any, path: string) {
    let tmp = respObj;
    if (path.indexOf('.') >= 0) {
      const pathSplit = path.split('.');
      pathSplit.forEach((key) => {
        if (tmp !== undefined && tmp !== null) {
          tmp = tmp[key];
        }
      });
    } else {
      tmp = respObj[path];
    }

    if (typeof tmp === 'object' && tmp !== null) {
      const { value, currency, symbol } = tmp;
      if (currency) {
        return this.currencyNumberValueToString(value, true);
      }
      if (symbol) {
        return `${value} ${tmp.symbol}`;
      }
      return value;
    }
    return tmp;
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

  private onApiError(errorsResponseObject: { error: {text: string}[]}) {
    this.log('Response contained "errors" object. ', errorsResponseObject);
    this.onFormException(errorsResponseObject.error.map(e => e.text).join('<br>'));
  }

  private onFormException(exceptionStr: string) {
    this.log('Form Exception: ', exceptionStr);
    this.ui.nextBtn.classList.remove(this.options.stateClasses.nextBtn.showing);

    this.ui.apiErrorNotification.querySelector<HTMLSpanElement>('span')
      .innerHTML = exceptionStr;
    const height = this.getContentHeight(this.ui.apiErrorNotification);
    this.ui.apiErrorNotification.style.maxHeight = `${height}px`;
  }

  private async doSubmitForm() {
    let to = 0;
    if (this.ui.element.classList.contains(this.options.stateClasses.hasResult)) {
      this.ui.element.classList.remove(this.options.stateClasses.hasResult);
      to = this.options.transitionTimeout;
    }

    setTimeout(() => {
      const url = `${this.calculatorUrl}/calculate`;
      this.postCalculatorFormData(url, true).then((resp) => {
        if (resp.errors) {
          this.onApiError(resp.errors);
        } else {
          this.log('Calculate Response:', resp);
          const tableProps = this.getTablePropertiesFromResponse(resp);
          const remarks = this.getRemarksFromResponse(resp);
          this.setResultBlocks(tableProps, remarks);
          this.ui.element.classList.add(this.options.stateClasses.hasResult);
          this.ui.resultTaxYear.innerText = resp.taxYear ? resp.taxYear.value : '';

          this.initStickyEditBtn();
        }
      }, (postFailReason) => {
        this.log('FormSubmit failed! ', postFailReason);
      });
      this.toNextFormSection();
    }, to);
  }

  private async postCalculatorFormData(endpoint: string, transformEmptyNumberToZero = false) {
    const formData = window[namespace].form
      .formToJSON(this.ui.formBase.elements, true, transformEmptyNumberToZero);
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
        }, (postFailReason) => {
          this.log(`POST request to endpoint ${endpoint} failed with reason ${postFailReason}!`);
          this.ui.element.classList.add(this.options.stateClasses.connectionFail);
          reject(postFailReason);
        });
      } else {
        reject(new Error('Invalid form data!'));
        this.onFormException('Invalid form data exception.');
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
      const panelContentHeight = this.getContentHeight(panelContent);
      panelContent.parentElement.style.maxHeight = `${panelContentHeight}px`;
    });
  }

  private getContentHeight(el: HTMLElement): number {
    let completeHeight = 0;
    const children = Array.prototype.slice.call(el.children);
    children.forEach((child) => {
      if (typeof child.offsetHeight !== 'undefined') {
        const styles = window.getComputedStyle(child);
        const margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
        completeHeight += Math.ceil(child.offsetHeight + margin);
      }
    });
    return completeHeight;
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
