interface ModuleDomSelectors {
  toTopBtn: string,
}
interface ModuleStateClasses {
  unlocked: string,
  scrolledOn: string;
  preserveLangSwitch: string;
}
export interface Back2TopModuleOptions {
  necessaryScrollY: number;
  sufficientScrollUp: number;
  stateSlip: number;
  customSmoothScrollConfig: {
    stepDuration: number,
    refinement: number,
  };
  transitionDelay: number;
  footerSelector: string;
  domSelectors: ModuleDomSelectors
  stateClasses: ModuleStateClasses
}

const domSelectors: ModuleDomSelectors = {
  toTopBtn: '[data-back2top=toTopBtn]',
};
const stateClasses: ModuleStateClasses = {
  unlocked: 'mdl-back2top--unlocked',
  scrolledOn: 'mdl-back2top--scrolled-on',
  preserveLangSwitch: 'mdl-back2top--preserveLangSwitch',
};

export const Back2TopDefaultOptions: Back2TopModuleOptions = { // eslint-disable-line
  necessaryScrollY: 700,
  sufficientScrollUp: 300,
  stateSlip: 50,
  customSmoothScrollConfig: {
    stepDuration: 10,
    refinement: 8,
  },
  transitionDelay: 1000,
  footerSelector: '.mdl-footer',
  domSelectors,
  stateClasses,
};
