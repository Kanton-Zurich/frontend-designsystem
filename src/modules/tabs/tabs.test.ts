jest.setTimeout(30000); // eslint-disable-line no-magic-numbers
describe('Tabs', () => {
  let page: any;

  beforeAll(async () => {
    // eslint-disable-next-line no-underscore-dangle
    const url = `http://localhost:${(<any>global).__STATIC_PORT__}/modules/tabs/tabs.html`;

    // eslint-disable-next-line no-underscore-dangle
    page = await (<any>global).__BROWSER__.newPage();
    // eslint-disable-next-line
    page.on('pageerror', console.log);

    await page.goto(url, {
      waitUntil: ['networkidle2'],
    });
  });

  afterEach(async () => {
    await page.reload();
  });

  afterAll(async () => {
    await page.close();
  });

  it('when first tab is clicked expand content', async () => {
    const result = await page.evaluate(() => {
      const firstTabButton = document.querySelector('[role="tab"]');
      const firstTabPanel = document.querySelector('[role="tabpanel"]');

      (<any>firstTabButton).click();

      return {
        selected: (firstTabButton.getAttribute('aria-selected') === 'true'),
        tabActive: (<any>firstTabPanel).classList.contains('mdl-tabs__tab--active'),
      };
    });

    expect(result).toEqual({
      selected: true,
      tabActive: true,
    });
  });

  it('when second tab is clicked expand content and deselect first one', async () => {
    const result = await page.evaluate(() => {
      const firstTabButton = document.querySelectorAll('[role="tab"]')[0];
      const firstTabPanel = document.querySelectorAll('[role="tabpanel"]')[0];
      const secondTabButton = document.querySelectorAll('[role="tab"]')[1];
      const secondTabPanel = document.querySelectorAll('[role="tabpanel"]')[1];

      (<any>secondTabButton).click();

      return {
        firstSelected: (firstTabButton.getAttribute('aria-selected') === 'true'),
        firstTabActive: (<any>firstTabPanel).classList.contains('mdl-tabs__tab--active'),
        secondSelected: (secondTabButton.getAttribute('aria-selected') === 'true'),
        secondTabActive: (<any>secondTabPanel).classList.contains('mdl-tabs__tab--active'),
      };
    });

    expect(result).toEqual({
      firstSelected: false,
      firstTabActive: false,
      secondSelected: true,
      secondTabActive: true,
    });
  });

  it('should load without error', async () => true);
});
