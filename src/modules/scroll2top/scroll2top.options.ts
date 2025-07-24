interface ModuleDomSelectors {
  toTopBtn: string;
}
interface ModuleStateClasses {
  unlocked: string;
  scrolledOn: string;
}
export interface Scroll2TopModuleOptions {
  necessaryScrollY: number;
  sufficientScrollUp: number;
  stateSlip: number;
  customSmoothScrollConfig: {
    stepDuration: number;
    refinement: number;
  };
  transitionDelay: number;
  footerSelector: string;
  domSelectors: ModuleDomSelectors;
  stateClasses: ModuleStateClasses;
}

const domSelectors: ModuleDomSelectors = {
  toTopBtn: '[data-scroll2top=toTopBtn]',
};
const stateClasses: ModuleStateClasses = {
  unlocked: 'mdl-scroll2top--unlocked',
  scrolledOn: 'mdl-scroll2top--scrolled-on',
};

export const Scroll2TopDefaultOptions: Scroll2TopModuleOptions = {
  // eslint-disable-line
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
