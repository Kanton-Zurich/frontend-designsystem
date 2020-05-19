jest.setTimeout(30000); // eslint-disable-line no-magic-numbers
describe('Video', () => {
  let page: any;

  const iframeDelay = 30000;
  jest.setTimeout(iframeDelay);

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

  describe('INITIAL', () => {
    it('there should be no cookie "acceptYouTube" set and the preview should be displayed', async () => {
      const result = await page.evaluate(() => {
        const preview = (<any>document.querySelector('.mdl-video__preview'));
        const isVisible = window.getComputedStyle(preview).display === 'flex';
        const cookieName = 'acceptYouTube';
        const match = document.cookie.match(new RegExp(`(^| )${cookieName}=([^;]+)`));
        let hasCookie = false;
        if (match && match[2] === 'true') {
          hasCookie = true;
        }

        return {
          previewIsVisible: isVisible,
          cookieNameFound: hasCookie,
        };
      });

      expect(result).toEqual({
        previewIsVisible: true,
        cookieNameFound: false,
      });
    });

    it('the iframe src should be null/empty if no cookie is set', async () => {
      const result = await page.evaluate(() => {
        const iframeSrc = (<any>document.querySelector('.mdl-video__frame'));
        const srcAttribute = iframeSrc.hasAttribute('src');
        const cookieName = 'acceptYouTube';
        const match = document.cookie.match(new RegExp(`(^| )${cookieName}=([^;]+)`));
        let hasCookie = false;
        if (match && match[2] === 'true') {
          hasCookie = true;
        }

        return {
          hasSrcAttribute: srcAttribute,
          cookieNameFound: hasCookie,
        };
      });

      expect(result).toEqual({
        hasSrcAttribute: false,
        cookieNameFound: false,
      });
    });

    describe('AFTER CLICK the preview button', () => {
      it('the cookie-dialog should be visible and the preview should be hidden', async () => {
        const result = await page.evaluate(() => {
          const preview = (<any>document.querySelector('.mdl-video__preview'));
          const dialog = (<any>document.querySelector('.mdl-video__cookie-dialog'));
          const previewBtn = (<any>document.querySelector('.mdl-video__preview button'));
          previewBtn.click();

          const previewDisplay = window.getComputedStyle(preview).display === 'none';
          const dialogDisplay = window.getComputedStyle(dialog).display === 'flex';

          return {
            previewIsHidde: previewDisplay,
            dialogIsVisible: dialogDisplay,
          };
        });

        expect(result).toEqual({
          previewIsHidde: true,
          dialogIsVisible: true,
        });
      });

      describe('AFTER CLICK the "Video Abspielen button"', () => {
        it('the iframe src should be set, the cookie should exist and the dialog should be hidden', async () => {
          const result = await page.evaluate(() => {
            const dialog = (<any>document.querySelector('.mdl-video__cookie-dialog'));
            const dialogPlayBtn = (<any>document.querySelector('.mdl-video__cookie-dialog .atm-button'));
            dialogPlayBtn.click();

            const iframeSrc = (<any>document.querySelector('.mdl-video__frame'));
            const srcAttribute = iframeSrc.hasAttribute('src');

            const dialogDisplay = window.getComputedStyle(dialog).display === 'none';

            const cookieName = 'acceptYouTube';
            const match = document.cookie.match(new RegExp(`(^| )${cookieName}=([^;]+)`));
            let hasCookie = false;
            if (match && match[2] === 'true') {
              hasCookie = true;
            }

            return {
              cookieNameFound: hasCookie,
              hasSrcAttribute: srcAttribute,
              dialogIsHidden: dialogDisplay,
            };
          });

          expect(result).toEqual({
            cookieNameFound: true,
            hasSrcAttribute: true,
            dialogIsHidden: true,
          });
        });
      });
    });
  });
});
