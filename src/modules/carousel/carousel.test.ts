describe('Carousel', () => {
  let page: any;

  beforeAll(async () => {
    // eslint-disable-next-line no-underscore-dangle
    const url = `http://localhost:${(<any>global).__STATIC_PORT__}/modules/carousel/carousel.html`;

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

  it('when next is clicked, go to the next slide', async () => {
    const result = await page.evaluate(() => {
      const rightButton = document.querySelector('[data-carousel="next"]');
      const firstSlide = document.querySelectorAll('[data-carousel="slide"]')[0];
      const indicator = document.querySelector('[data-carousel="indicator"]');

      (<any>rightButton).click();

      return {
        indicator: indicator.textContent,
        marginLeft: (<any>firstSlide).style.marginLeft,
      };
    });

    expect(result).toEqual({
      indicator: '2',
      marginLeft: '-100%',
    });
  });

  it('working fullscreen mode', async () => {
    const hasFullscreenClass = await page.evaluate(() => {
      const carousel = document.querySelector('[data-init="carousel"]');
      const firstSlide = document.querySelectorAll('[data-carousel="open"]')[0];

      (<any>firstSlide).click();

      return carousel.classList.contains('mdl-carousel--fullscreen');
    });

    expect(hasFullscreenClass).toBe(true);
  });
});
