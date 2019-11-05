describe('CookieControls', () => {
  let page: any;

  beforeAll(async () => {
    // eslint-disable-next-line no-underscore-dangle
    const url = `http://localhost:${(<any>global).__STATIC_PORT__}/modules/cookie_controls/cookie_controls.html`;

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

  it('inital there should be no or an falsy cookie "acceptYouTube" set and the checkbox should be unchecked', async () => {
    const result = await page.evaluate(() => {
      const cookieName = 'acceptYouTube';
      const match = document.cookie.match(new RegExp(`(^| )${cookieName}=([^;]+)`));
      let cookieNameFound = false;
      if (match && match[2] === 'true') {
        cookieNameFound = true;
      }

      const checkbox = (<any>document.querySelector('#cookieCheckboxYoutube')).checked;

      return {
        checkboxState: checkbox,
        cookieNameFound: cookieNameFound,
      };
    });

    expect(result).toEqual({
      checkboxState: false,
      cookieNameFound: false,
    });
  });

  it('after checking the checkbox there should be a cookie with the name "acceptYouTube" set ' +
    'and the checkbox state should be true', async () => {
    const result = await page.evaluate(() => {
      let checkbox = (<any>document.querySelector('#cookieCheckboxYoutube'));
      checkbox.click();

      const cookieName = 'acceptYouTube';
      const match = document.cookie.match(new RegExp(`(^| )${cookieName}=([^;]+)`));
      let cookieNameFound = false;
      if (match && match[2] === 'true') {
        cookieNameFound = true;
      }
      const checkboxState = checkbox.checked;

      return {
        checkboxState: checkboxState,
        cookieNameFound: cookieNameFound,
      };
    });

    expect(result).toEqual({
      checkboxState: true,
      cookieNameFound: true,
    });
  });
});
