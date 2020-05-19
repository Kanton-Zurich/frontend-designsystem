jest.setTimeout(30000); // eslint-disable-line no-magic-numbers
describe('Carousel', () => {
  let page: any;

  beforeAll(async () => {
    // eslint-disable-next-line no-underscore-dangle
    const url = `http://localhost:${(<any>global).__STATIC_PORT__}/modules/image_gallery/image_gallery.html`;

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

  it('when image is clicked full screen is opened on right page', async () => {
    const result = await page.evaluate(() => {
      const imageButton = document.querySelectorAll('[data-carousel="open"]')[2];
      const indicator = document.querySelector('[data-carousel="indicator"]');
      const gallery = document.querySelector('.mdl-image_gallery');
      const carousel = document.querySelector('.mdl-carousel');
      const firstSlide = document.querySelectorAll('[data-carousel="slide"]')[0];

      (<any>imageButton).click();

      return {
        isFullscreen: gallery.classList.contains('mdl-image_gallery--fullscreen') && carousel.classList.contains('mdl-carousel--fullscreen'),
        indicator: indicator.textContent,
        marginLeft: (<any>firstSlide).style.marginLeft,
      };
    });

    expect(result).toEqual({
      isFullscreen: true,
      indicator: '3',
      marginLeft: '-200%',
    });
  });

  it('gallery can be expanded', async () => {
    const result = await page.evaluate(() => {
      const gallery = document.querySelector('.mdl-image_gallery');
      const showMoreButton = document.querySelector('[data-image-gallery="showMore"]');

      (<any>showMoreButton).click();

      return gallery.classList.contains('mdl-image_gallery--expanded');
    });

    expect(result).toBe(true);
  });
});
