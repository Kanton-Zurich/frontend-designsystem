jest.setTimeout(30000); // eslint-disable-line no-magic-numbers
describe('Accordion', () => {
  let page: any;

  beforeAll(async () => {
    // eslint-disable-next-line no-underscore-dangle
    const url = `http://localhost:${(<any>global).__STATIC_PORT__}/modules/accordion/accordion.html`;

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

  it('possible to open a accordion', async () => {
    const firstChildIsOpen = await page.evaluate(() => {
      const firstTrigger = document.querySelector('[data-accordion="trigger"]');
      const item = document.querySelector('[data-accordion="item"]');
      const panel = document.querySelector('[data-accordion="panel"]');

      (<any>firstTrigger).click();

      return {
        itemHasClass: item.classList.contains('mdl-accordion__item--open'),
        panelHasMaxHeight: (<any>panel).style.maxHeight !== '0px' || (<any>panel).style.maxHeight !== '',
      };
    });

    expect(firstChildIsOpen).toEqual({
      itemHasClass: true,
      panelHasMaxHeight: true,
    });
  });

  // Test is suddenly failing but inspecting it doesn't reveal a problem,
  // can't debug the test itself, so I have no Idea what the problem is
  it('tabindex before and after click correct', async () => {
    const correctTabIndex = await page.evaluate(() => {
      const thirdItem = document.querySelectorAll('[data-accordion="item"]')[2];
      const trigger = thirdItem.querySelector('[data-accordion="trigger"]');
      const panelContent = thirdItem.querySelector('[data-accordion="panel-content"]');
      const firstFocusableInPanelContent = panelContent.querySelector('button, [href], input, select, textarea, [tabindex]');

      const tabindexBefore = firstFocusableInPanelContent.getAttribute('tabindex').toString();

      (<any>trigger).click();

      const tabindexAfter = firstFocusableInPanelContent.hasAttribute('tabindex');

      return {
        before: tabindexBefore === '-1',
        after: !tabindexAfter,
      };
    });

    expect(correctTabIndex).toEqual({
      before: true,
      after: true,
    });
  });
});
