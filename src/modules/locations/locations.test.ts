import { DefaultOptions, LocationsModuleOptions } from './locations.options'; // eslint-disable-line no-unused-vars

jest.setTimeout(30000); // eslint-disable-line no-magic-numbers
describe('Locations', () => {
  let page: any;

  beforeAll(async () => {
    // eslint-disable-next-line no-underscore-dangle
    const url = `http://localhost:${(<any>global).__STATIC_PORT__}/modules/locations/locations.html`;

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

  it('has default options', () => {
    expect(DefaultOptions).toBeDefined();
  });

  it('shows the related details when a listitem is clicked', async () => {
    const result = await page
      .evaluate((options: LocationsModuleOptions) => {
        const itemIdx = 2;
        const defaultVariant = document.querySelector<HTMLDivElement>('.mdl-locations');
        const listItem = defaultVariant.querySelectorAll(options.domSelectors.listItems)[itemIdx];
        const sidebar = defaultVariant.querySelector<HTMLDivElement>(options.domSelectors.sidebar);
        const relatedDetailNode = defaultVariant
          .querySelectorAll<HTMLDivElement>(options.domSelectors.detailNodes).item(itemIdx);
        (<any>listItem).click();
        return {
          showsRelatedDetailsBlock: relatedDetailNode
            .classList.contains(options.stateClasses.detailShow),
          hasSidebarOnDetails: sidebar.classList.contains(options.stateClasses.sidebar.onDetails),
        };
      }, DefaultOptions);

    expect(result).toEqual({
      showsRelatedDetailsBlock: true,
      hasSidebarOnDetails: true,
    });
  });

  it('filters list items by searchterm entered in input field', async () => {
    const result = await page.evaluate((options: LocationsModuleOptions) => {
      const defaultVariant = document.querySelector<HTMLDivElement>('.mdl-locations');
      const filterInput = defaultVariant
        .querySelector<HTMLInputElement>(options.domSelectors.filterInput);
      const listItems = defaultVariant.querySelectorAll(options.domSelectors.listItems);

      filterInput.value = 'Regensdorf';

      let visibleItems = 0;
      let hiddenItems = 0;
      listItems.forEach((listNode) => {
        if (listNode.parentElement.classList.contains(options.stateClasses.listItemHide)) {
          hiddenItems += 1;
        } else {
          visibleItems += 1;
        }
      });
      return {
        listItemsTotal: listItems.length,
        visibleListItemsCount: visibleItems,
        hiddenListItemsCount: hiddenItems,
        // eslint-disable-next-line no-magic-numbers
        thirdItemHidden: listItems.item(2).parentElement
          .classList.contains(options.stateClasses.listItemHide),
      };
    }, DefaultOptions);

    expect(result).toEqual({
      listItemsTotal: 6,
      visibleListItemsCount: 1,
      hiddenListItemsCount: 5,
      thirdItemHidden: false,
    });
  });

  it('selects a location on map marker click', async () => {
    const testee: {
      hasSidebarOnDetails: boolean,
      hasAnOpenDetailBlock: boolean,
    } = await page.evaluate((options: LocationsModuleOptions) => {
      const defaultVariant = document.querySelector<HTMLDivElement>('.mdl-locations');
      const map = defaultVariant.querySelector(options.domSelectors.map);
      const marker = map.querySelector<HTMLDivElement>('.mdl-map_view__marker');
      marker.click();
      const sidebar = defaultVariant.querySelector<HTMLDivElement>(options.domSelectors.sidebar);
      const relatedDetailNode = defaultVariant
        .querySelector<HTMLDivElement>(`${options.domSelectors.detailNodes}.${options.stateClasses.detailShow}`);

      return {
        hasSidebarOnDetails: sidebar.classList.contains(options.stateClasses.sidebar.onDetails),
        hasAnOpenDetailBlock: relatedDetailNode !== undefined,
      };
    }, DefaultOptions);


    expect(testee).toEqual({
      hasSidebarOnDetails: true,
      hasAnOpenDetailBlock: true,
    });
  });

  afterAll(async () => {
    await page.close();
  });

  it('should load without error', async () => true);
});
