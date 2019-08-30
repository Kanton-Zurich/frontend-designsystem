const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const templateConverter = require('../../../gulp/helpers/templateConverter');

const template = dataHelper.getFileContent('news_overview.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'News Übersicht',
    className: 'NewsOverview',
    jira: 'CZHDEV-511',
    documentation: dataHelper.getDocumentation('news_overview.md'),
  },
  props: {
    newsTeaserTemplate: templateConverter(dataHelper.getFileContent('../news_teaser/_news_teaser_item.hbs'), false),
    newsTeaserItems: [
      {
        href: '#',
        dateLabel: 'Medienmitteilung',
        date: '14.12.2018',
        dateMachineReadable: '2018-12-14',
        title: 'Winterthur: Unbekannter Mann raubt Tankstellen-Shop aus',
      },
      {
        href: '#',
        date: '14.12.2018',
        dateMachineReadable: '2018-12-14',
        title: 'Zürich-Flughafen: Drogenkurier verhaftet und Kokain sichergestellt',
      },
      {
        href: '#',
        dateLabel: 'Medienmitteilung',
        date: '14.12.2018',
        dateMachineReadable: '2018-12-14',
        title: 'Weiningen: Vermisstmeldung - Willi Müller',
      },

    ],
  },
});

const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
  },
}, (variant) => {
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
});

data.variants = variants;

module.exports = data;
