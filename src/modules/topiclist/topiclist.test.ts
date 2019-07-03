describe('Topiclist', () => {
  let page: any;

  beforeAll(async () => {
    // eslint-disable-next-line no-underscore-dangle
    const url = `http://localhost:${(<any>global).__STATIC_PORT__}/modules/topiclist/topiclist.html`;

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

  it('should load without error', async () => true);

  it('when show all button is clicked no items should have the hidden class', async () => {
    const hasHiddenClass = await page.evaluate(() => {
      const topiclist = document.querySelector('[data-init="topiclist"]');
      const showAllButton = topiclist.querySelector('[data-topiclist="showAllTrigger"]');

      (<any>showAllButton).click();

      const hiddenItems = topiclist.querySelectorAll('.mdl-content_nav__item--hidden');

      return Boolean(hiddenItems.length);
    });

    expect(hasHiddenClass).toBe(false);
  });

  it('when button is clicked he should be removed from the module', async () => {
    const buttonExists = await page.evaluate(() => {
      const topiclist = document.querySelector('[data-init="topiclist"]');
      let showAllButton = topiclist.querySelector('[data-topiclist="showAllTrigger"]');

      (<any>showAllButton).click();

      showAllButton = topiclist.querySelector('[data-topiclist="showAllTrigger"]');

      return Boolean(showAllButton);
    });

    expect(buttonExists).toBe(false);
  });
});
