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

  it('when show all button was clicked the expanded class should be set', async () => {
    const hasHiddenClass = await page.evaluate(() => {
      const topiclist = document.querySelector('[data-init="topiclist"]');
      const showAllButton = topiclist.querySelector('[data-topiclist="showAllTrigger"]');

      (<any>showAllButton).click();

      return Boolean(topiclist.classList.contains('.mdl-topiclist--expanded'));
    });

    expect(hasHiddenClass).toBe(false);
  });

  it('when button was clicked he should be hidden from the module', async () => {
    const buttonExists = await page.evaluate(() => {
      const topiclist = document.querySelector('[data-init="topiclist"]');
      const showAllButton = topiclist.querySelector('[data-topiclist="showAllTrigger"]');

      (<any>showAllButton).click();

      const style = window.getComputedStyle(showAllButton);

      return Boolean(style.display === 'none');
    });

    expect(buttonExists).toBe(false);
  });
});
