
describe('Table', () => {
  let page: any;

  beforeAll(async () => {
    // eslint-disable-next-line no-underscore-dangle
    const url = `http://localhost:${(<any>global).__STATIC_PORT__}/modules/table/table.html`;

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

  it('should be ordered without a problem', async () => {
    const orderedTableResult = await page.evaluate(() => {
      (<HTMLElement>document.querySelector('input#variants16')).click();

      const panel = document.querySelector('#panel16');
      const table = panel.querySelector('.mdl-table__table');
      const testingColumn = table.querySelectorAll('[data-table="sortable"]')[1];
      const rowheaders = table.querySelectorAll('[role="rowheader"]');

      const arrayAscending = [];
      const arrayDescending = [];
      const arrayNone = [];

      (<HTMLElement>testingColumn).click();

      rowheaders.forEach((rowheader) => {
        arrayAscending.push(rowheader.textContent.trim());
      });

      (<HTMLElement>testingColumn).click();

      rowheaders.forEach((rowheader) => {
        arrayDescending.push(rowheader.textContent.trim());
      });

      (<HTMLElement>testingColumn).click();

      rowheaders.forEach((rowheader) => {
        arrayNone.push(rowheader.textContent.trim());
      });

      return {
        asc: arrayAscending,
        desc: arrayDescending,
        none: arrayNone,
      };
    });

    expect(orderedTableResult).toEqual({
      asc: ['Zürich', 'Bern', 'Basel', 'Gesamtschweiz'],
      desc: ['Gesamtschweiz', 'Basel', 'Bern', 'Zürich'],
      none: ['Zürich', 'Bern', 'Basel', 'Gesamtschweiz'],
    });
  });
});
