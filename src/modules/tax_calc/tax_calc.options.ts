interface ModuleDomSelectors {
  formBase: string;
  formItems: string;
  taxEntityInputs: string;
  taxTypeInputs: string;
  nextBtn: string;
}
interface ModuleStateClasses {
  formItem: {
    enabled: string;
    fixed: string;
  };
  nextBtn: {
    show: string;
  };
  hasResult: string;
}
export interface TaxCalcModuleOptions { // eslint-disable-line
  paramKeyCalculator: string;
  apiBase: string;
  availableEntities: string[];
  availableCalculator: string[];
  attributeNames: {
    module: string;
    apiBase: string;
  };
  domSelectors: ModuleDomSelectors;
  stateClasses: ModuleStateClasses;
}

const domSelectors: ModuleDomSelectors = {
  formBase: '[data-tax_calc="formBase"]',
  formItems: '.mdl-tax_calc__form-block .mdl-accordion__item',
  taxEntityInputs: '[data-tax_calc="inputEntity"]',
  taxTypeInputs: '[data-tax_calc^="inputTaxType"]',
  nextBtn: '[data-tax_calc="nextBtn"]',
};
const stateClasses: ModuleStateClasses = {
  formItem: {
    enabled: 'mdl-tax_calc__form-block_item--enabled',
    fixed: 'mdl-tax_calc__form-block_item--fixed',
  },
  nextBtn: {
    show: 'show',
  },
  hasResult: 'mdl-tax_calc--result',
};
const attributeNames = {
  module: 'data-tax_calc',
  apiBase: 'data-tax_calc-apibase',
};

export const TaxCalcDefaultOptions: TaxCalcModuleOptions = { // eslint-disable-line
  paramKeyCalculator: 'calculatorId',
  apiBase: 'https://www.steueramt.zh.ch/ZH-Web-Calculators/calculators/',
  availableEntities: ['individual', 'incorp'],
  availableCalculator: ['income_assets', 'federal', 'benefit_payments', 'benefit_payments_federal', 'inheritance', 'legal_simple', 'legal_iterative'],
  attributeNames,
  domSelectors,
  stateClasses,
};
