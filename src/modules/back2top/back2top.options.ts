interface ModuleDomSelectors {
  toTopBtn: string,
}
interface ModuleStateClasses {
  unlocked: string,
  scrolledOn: string;
}
export interface Back2TopModuleOptions {
  neccessaryScrollY: number;
  sufficientScrollUp: number;
  domSelectors: ModuleDomSelectors
  stateClasses: ModuleStateClasses
}

const domSelectors: ModuleDomSelectors = {
  toTopBtn: '[data-back2top=toTopBtn]',
};
const stateClasses: ModuleStateClasses = {
  unlocked: 'mdl-back2top--unlocked',
  scrolledOn: 'mdl-back2top--scrolled-on',
};

export const Back2TopDefaultOptions: Back2TopModuleOptions = {
  neccessaryScrollY: 700,
  sufficientScrollUp: 300,
  domSelectors,
  stateClasses,
};
