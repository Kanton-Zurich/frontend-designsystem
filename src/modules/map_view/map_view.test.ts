import { MapViewDefaultOptions, MapViewModuleOptions } from './map_view.options'; // eslint-disable-line no-unused-vars

jest.setTimeout(30000); // eslint-disable-line no-magic-numbers
describe('MapView', () => {
  let page: any;

  beforeAll(async () => {
    // eslint-disable-next-line no-underscore-dangle
    const url = `http://localhost:${(<any>global).__STATIC_PORT__}/modules/map_view/map_view.html`;

    // eslint-disable-next-line no-underscore-dangle
    page = await (<any>global).__BROWSER__.newPage();
    // eslint-disable-next-line
    page.on('pageerror', console.log);

    await page.goto(url, {
      waitUntil: ['networkidle2'],
      timeout: 10000,
    });
  });

  afterEach(async () => {
    await page.reload();
  });

  afterAll(async () => {
    await page.close();
  });

  it('should load without error', async () => true);

  it('sets the correct number of markers', async () => {
    const result = await page
      .evaluate((options: MapViewModuleOptions) => {
        const defaultVariant = document.querySelector<HTMLDivElement>('.mdl-map_view');
        const markerDivNodes = defaultVariant.querySelectorAll(`.${options.stateClasses.markerClasses.default}`);

        return {
          markerCount: markerDivNodes.length,
        };
      }, MapViewDefaultOptions);

    expect(result).toEqual({
      markerCount: 6,
    });
  });

  it('highligths a marker on hover', async () => {
    const result = await page
      .evaluate((options: MapViewModuleOptions) => {
        const defaultVariant = document.querySelector<HTMLDivElement>('.mdl-map_view');
        const mapContainer = defaultVariant
          .querySelector<HTMLDivElement>(options.domSelectors.mapContainer);
        const highlightEvent = new CustomEvent('eventname.MapView.ext_marker_highlight', { detail: { idx: 2 } });
        mapContainer.dispatchEvent(highlightEvent);

        const defaultMarkerNodes = defaultVariant.querySelectorAll(`.${options.stateClasses.markerClasses.default}`);
        const highlightMarkerNodes = defaultVariant.querySelectorAll(`.${options.stateClasses.markerClasses.highlight}`);

        return {
          defaultMarkerCount: defaultMarkerNodes.length,
          highlightMarkerCount: highlightMarkerNodes.length,
        };
      }, MapViewDefaultOptions);

    expect(result).toEqual({
      defaultMarkerCount: 5,
      highlightMarkerCount: 1,
    });
  });

  it('allows to select a marker', async () => {
    const result = await page
      .evaluate((options: MapViewModuleOptions) => {
        const defaultVariant = document.querySelector<HTMLDivElement>('.mdl-map_view');
        const firstMarker = defaultVariant.querySelector<HTMLDivElement>(`.${options.stateClasses.markerClasses.default}`);

        firstMarker.click();

        const defaultMarkerNodes = defaultVariant.querySelectorAll(`.${options.stateClasses.markerClasses.default}`);
        const selectedMarkerNodes = defaultVariant.querySelectorAll(`.${options.stateClasses.markerClasses.selected}`);

        return {
          defaultMarkerCount: defaultMarkerNodes.length,
          highlightMarkerCount: selectedMarkerNodes.length,
        };
      }, MapViewDefaultOptions);

    expect(result).toEqual({
      defaultMarkerCount: 5,
      highlightMarkerCount: 1,
    });
  });
});
