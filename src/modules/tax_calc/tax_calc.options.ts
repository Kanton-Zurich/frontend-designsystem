interface ModuleDomSelectors {
  formBase: string;
  formItems: string;
  taxEntityInputs: string;
  taxTypeInputs: string;
  openSectionsValidationInputs: string;
  nextBtn: string;
  apiErrorNotification: string;
  resultBlock: string;
  resultTaxYear: string;
  resultContainer: string;
  editBtn: string;
  formItemTemplate: string;
  tableBlockTemplate: string;
  remarkBlockTemplate: string;
  fieldTemplates: string;
  reinvokeTrigger: string;
  formLayoutConfig: string;
  resultTableConfig: string;
}
interface ModuleStateClasses {
  formItem: {
    enabled: string;
    fixed: string;
    open: string;
    newClasses: string;
  };
  nextBtn: {
    showing: string;
    disabled: string;
    next: string;
    calculate: string;
    loading: string;
  }
  hasResult: string;
  connectionFail: string;
}
export interface TaxCalcModuleOptions { // eslint-disable-line
  transitionTimeout: number;
  paramKeyCalculator: string;
  availableEntities: string[];
  availableCalculator: string[];
  attributeNames: {
    module: string;
    apiBase: string;
    reinvoke: string;
    fieldTemplateType: string;
  };
  flatCurrencyValues: string[];
  globalScopeVariables: string[];
  datePartialFields: string[];
  negativeValues: string[];
  domSelectors: ModuleDomSelectors;
  stateClasses: ModuleStateClasses;
}

const domSelectors: ModuleDomSelectors = {
  formBase: '[data-tax_calc="formBase"]',
  formItems: '.mdl-tax_calc__form-block .mdl-accordion__item',
  taxEntityInputs: '[data-tax_calc="inputEntity"]',
  taxTypeInputs: '[data-tax_calc^="inputTaxType"]',
  openSectionsValidationInputs: '.mdl-accordion__item--open input[data-validation]',
  nextBtn: '[data-tax_calc="nextBtn"]',
  apiErrorNotification: '[data-tax_calc="apiErrorsNotification"]',
  resultBlock: '.mdl-tax_calc__result-block',
  resultTaxYear: '[data-tax_calc-taxyear]',
  editBtn: '[data-tax_calc="editBtn"]',
  resultContainer: '[data-tax_calc="resultCon"]',
  formItemTemplate: '[data-tax_calc="formItemTemplate"]',
  tableBlockTemplate: '[data-tax_calc="tableBlockTemplate"]',
  remarkBlockTemplate: '[data-tax_calc="remarksTemplate"]',
  fieldTemplates: '[data-tax_calc-fieldtemplate]',
  reinvokeTrigger: '[data-tax_calc-reinvoke]',
  formLayoutConfig: '[data-tax_calc-formconfig]',
  resultTableConfig: '[data-tax_calc-resultconfig]',
};
const stateClasses: ModuleStateClasses = {
  formItem: {
    enabled: 'mdl-tax_calc__form-block_item--enabled',
    fixed: 'mdl-tax_calc__form-block_item--fixed',
    open: 'mdl-accordion__item--open',
    newClasses: 'mdl-accordion__item mdl-tax_calc__form-block_item',
  },
  nextBtn: {
    showing: 'show',
    disabled: 'atm-button--disabled',
    next: 'mdl-tax_calc__next-btn--next',
    calculate: 'mdl-tax_calc__next-btn--calculate',
    loading: 'mdl-tax_calc__next-btn--loading',
  },
  hasResult: 'mdl-tax_calc--result',
  connectionFail: 'mdl-tax_calc--connection-fail',
};
const attributeNames = {
  module: 'data-tax_calc',
  apiBase: 'data-tax_calc-apibase',
  reinvoke: 'data-tax_calc-reinvoke',
  fieldTemplateType: 'data-tax_calc-fieldtemplate',
};

export const TaxCalcDefaultOptions: TaxCalcModuleOptions = { // eslint-disable-line
  transitionTimeout: 600,
  paramKeyCalculator: 'calculatorId',
  availableEntities: ['individual', 'incorp'],
  availableCalculator: ['income_assets', 'federal', 'benefit_payments', 'benefit_payments_federal', 'inheritance', 'legal_simple', 'legal_iterative'],
  flatCurrencyValues: ['ascertainedTaxableIncome', 'taxableIncome', 'ascertainedTaxableAssets', 'taxableAssets', 'taxableFederalIncome'],
  globalScopeVariables: ['taxYear'],
  datePartialFields: ['liabilityBegin', 'liabilityEnd'],
  negativeValues: ['withholdingTax'],
  attributeNames,
  domSelectors,
  stateClasses,
};
