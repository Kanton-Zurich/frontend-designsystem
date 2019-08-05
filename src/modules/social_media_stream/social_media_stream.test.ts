describe('SocialMediaStream', () => {
  let page: any;

  beforeAll(async () => {
    // eslint-disable-next-line no-underscore-dangle
    const url = `http://localhost:${(<any>global).__STATIC_PORT__}/modules/social_media_stream/social_media_stream.html`;

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

  it('when more button is clicked item list size increases', async () => {
    await ((ms) => { return new Promise(resolve => setTimeout(resolve, ms));})(250); // eslint-disable-line
    const preResult = await page.evaluate(() => {
      const itemList = document.querySelector('.mdl-social-media-stream__items');
      const itemCount = itemList.children.length;
      const moreButton = document.querySelector('.mdl-social-media-stream__footer-button');
      (<any>moreButton).click();
      return itemCount;
    });
    await ((ms) => { return new Promise(resolve => setTimeout(resolve, ms));})(250); // eslint-disable-line
    const postResult = await page.evaluate(() => {
      const itemList = document.querySelector('.mdl-social-media-stream__items');
      return itemList.children.length;
    });
    const result = {
      diff: postResult > preResult,
    };

    expect(result).toEqual({
      diff: true,
    });
  });

  it('should load without error', async () => true);
});
