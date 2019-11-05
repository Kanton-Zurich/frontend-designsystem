describe('Video', () => {
  let page: any;

  beforeAll(async () => {
    // eslint-disable-next-line no-underscore-dangle
    const url = `http://localhost:${(<any>global).__STATIC_PORT__}/modules/video/video.html`;

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

  it('inital there should be no cookie "acceptYouTube" set and the preview should be displayed', async () => {
    const result = await page.evaluate(() => {
      const preview = (<any>document.querySelector('.mdl-video__preview'));
      const previewIsVisible = window.getComputedStyle(preview).display === 'flex' ? true : false;
      const cookieName = 'acceptYouTube';
      const match = document.cookie.match(new RegExp(`(^| )${cookieName}=([^;]+)`));
      let cookieNameFound = false;
      if (match && match[2] === 'true') {
        cookieNameFound = true;
      }

      return {
        previewIsVisible: previewIsVisible,
        cookieNameFound: cookieNameFound,
      };
    });

    expect(result).toEqual({
      previewIsVisible: true,
      cookieNameFound: false,
    });
  });

  it('inital the iframe src should be null/empty if no cookie is set', async () => {
    const result = await page.evaluate(() => {
      const iframeSrc = (<any>document.querySelector('.mdl-video__frame'));
      const hasSrcAttribute = iframeSrc.hasAttribute('src');
      const cookieName = 'acceptYouTube';
      const match = document.cookie.match(new RegExp(`(^| )${cookieName}=([^;]+)`));
      let cookieNameFound = false;
      if (match && match[2] === 'true') {
        cookieNameFound = true;
      }

      return {
        hasSrcAttribute: hasSrcAttribute,
        cookieNameFound: cookieNameFound,
      };
    });

    expect(result).toEqual({
      hasSrcAttribute: false,
      cookieNameFound: false,
    });
  });

  it('after clicking the preview button the cookie-dialog should be visible and the preview should be hidden', async () => {
    const result = await page.evaluate(() => {
      const preview = (<any>document.querySelector('.mdl-video__preview'));
      const dialog = (<any>document.querySelector('.mdl-video__cookie-dialog'));
      const previewBtn = (<any>document.querySelector('.mdl-video__preview button'));
      previewBtn.click();

      const previewIsHidde = window.getComputedStyle(preview).display === 'none' ? true : false;
      const dialogIsVisible = window.getComputedStyle(dialog).display === 'flex' ? true : false;

      return {
        previewIsHidde: previewIsHidde,
        dialogIsVisible: dialogIsVisible,
      };
    });

    expect(result).toEqual({
      previewIsHidde: true,
      dialogIsVisible: true,
    });
  });

  it('after clicking the "Video Abspielen button" the iframe src should be set, the cookie should exist and the dialog should be hidden', async () => {
    const result = await page.evaluate(() => {
      const dialog = (<any>document.querySelector('.mdl-video__cookie-dialog'));
      const dialogPlayBtn = (<any>document.querySelector('.mdl-video__cookie-dialog .atm-button'));
      dialogPlayBtn.click();

      const iframeSrc = (<any>document.querySelector('.mdl-video__frame'));
      const hasSrcAttribute = iframeSrc.hasAttribute('src');

      const dialogIsHidden = window.getComputedStyle(dialog).display === 'none' ? true : false;

      const cookieName = 'acceptYouTube';
      const match = document.cookie.match(new RegExp(`(^| )${cookieName}=([^;]+)`));
      let cookieNameFound = false;
      if (match && match[2] === 'true') {
        cookieNameFound = true;
      }

      return {
        cookieNameFound: cookieNameFound,
        hasSrcAttribute: hasSrcAttribute,
        dialogIsHidden: dialogIsHidden,
      };
    });

    expect(result).toEqual({
      cookieNameFound: true,
      hasSrcAttribute: true,
      dialogIsHidden: true,
    });
  });

});
