const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defRichtextData = require('../richtext/richtext.data.js');
const defStepperFormData = require('../stepper/stepper.data');
const defCarouselData = require('../carousel/carousel.data');
const defFlexDataData = require('../flex_data/flex_data.data');
const defSearchResultListData = require('../search_result_list/search_result_list.data');

const template = dataHelper.getFileContent('tabs.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Tabs',
    className: 'Tabs',
    jira: 'CZHDEV-473',
    label: 'Container',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {},
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Default',
        desc: 'Default implementation',
      },
      props: {
        tabs: [
          {
            title: 'Vor Ort',
            id: 'tabDemoId1',
            data: '<p class="atm-paragraph">Wenn Ihr Ausweis vor dem 01.01.2013 ausgestellt wurde, müssen Sie ein neues Passfoto machen. Ihr Reisebüro oder das Konsulat Ihres Reiseziels können Ihnen dabei helfen.</p>',
          },
          {
            title: 'Online',
            id: 'tabDemoId2',
            data: handlebars.compile(dataHelper.getFileContent('../stepper/stepper.hbs'))(
              defStepperFormData.variants.serviceForm.props
            ),
          },
          {
            title: 'Per Post',
            id: 'tabDemoId3',
            data: handlebars.compile(dataHelper.getFileContent('../richtext/richtext.hbs'))(
              defRichtextData.variants.embedded.props
            ),
          },
          {
            title: 'Test Gallerie',
            id: 'tabDemoId4',
            data: handlebars.compile(dataHelper.getFileContent('../carousel/carousel.hbs'))(
              _.merge({}, defCarouselData.variants.default.props, { title: null })
            ),
          },
        ],
      },
    },
    zhlex: {
      meta: {
        title: 'ZH-Lex',
        desc: 'Loseblattsammlung und Offizielle Gesetzessammlung',
      },
      props: {
        tabs: [
          {
            title: 'Loseblattsammlung',
            id: 'zhlex_ls',
            data: handlebars.compile(dataHelper.getFileContent('../flex_data/flex_data.hbs'))(
              _.merge({}, defFlexDataData.variants.zhlex_ls.props, {})
            ),
          },
          {
            title: 'Offizielle Gesetzessammlung',
            id: 'zhlex_os',
            data: handlebars.compile(dataHelper.getFileContent('../flex_data/flex_data.hbs'))(
              _.merge({}, defFlexDataData.variants.zhlex_os.props, {})
            ),
          },
        ],
      },
    },
    searchResults: {
      meta: {
        title: 'Suchresultate mit Beispieldaten',
        desc: 'Horizontal scrollbare Tabs bei Overflow mit Schatten',
      },
      props: {
        isScrollable: true,
        tabs: [
          {
            title: 'Inhaltsseiten (<span class="mdl-search_page__count">52</span>)',
            id: 'contentpage',
            data: handlebars.compile(
              dataHelper.getFileContent('../search_result_list/search_result_list.hbs')
            )(defSearchResultListData.variants.contentpage.props),
          },
          {
            title: 'Dokumente (<span class="mdl-search_page__count">16</span>)',
            id: 'document',
            data: handlebars.compile(
              dataHelper.getFileContent('../search_result_list/search_result_list.hbs')
            )(defSearchResultListData.variants.document.props),
          },
          {
            title: 'News (<span class="mdl-search_page__count">43</span>)',
            id: 'news',
            data: handlebars.compile(
              dataHelper.getFileContent('../search_result_list/search_result_list.hbs')
            )(defSearchResultListData.variants.news.props),
          },
          {
            title: 'Services (<span class="mdl-search_page__count">3</span>)',
            id: 'service',
            data: handlebars.compile(
              dataHelper.getFileContent('../search_result_list/search_result_list.hbs')
            )(defSearchResultListData.variants.service.props),
          },
          {
            title: 'Personen (<span class="mdl-search_page__count">7</span>)',
            id: 'person',
            data: handlebars.compile(
              dataHelper.getFileContent('../search_result_list/search_result_list.hbs')
            )(defSearchResultListData.variants.person.props),
          },
        ],
      },
    },
  },
  (variant) => {
    const variantProps = _.merge({}, data, variant).props;
    const compiledVariant = () => handlebars.compile(template)(variantProps);
    const variantData = _.merge({}, data, variant, {
      meta: {
        demo: compiledVariant,

        code: {
          handlebars: dataHelper.getFormattedHandlebars(template),
          html: dataHelper.getFormattedHtml(compiledVariant()),
          data: dataHelper.getFormattedJson(variantProps),
        },
      },
    });

    return variantData;
  }
);

data.variants = variants;

module.exports = data;
