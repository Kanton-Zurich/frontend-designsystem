class FormRules {
  private ui: {
    owner: HTMLElement,
  }

  private rules: Array<any>;

  constructor($ruleOwner) {
    this.ui = {
      owner: $ruleOwner,
    };

    this.getRules();
  }

  getRules() {
    this.rules = JSON.parse(this.ui.owner.getAttribute('data-rules'));
  }
}

export default FormRules;
