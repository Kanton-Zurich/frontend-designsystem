const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('event_card.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Veranstaltung Card',
    className: 'EventCard',
    jira: 'CZHDEV-4787',
    label: 'Teaser',
    documentation: dataHelper.getDocumentation('README.md'),
  },
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Default',
        desc: 'Default implementation',
      },
      props: {
        title: 'Preisliste Fischerpatente',
        headingLevel: 3,
        month: 'Okt',
        day: '22',
        teaserText: ['22.10.2025, 08:00 bis 09:30', 'Kraftwerk Selnau', 'kostenlos'],
        label: 'Ausgebucht',
        link: 'http://search.zh.ch/xyz',
        typeLabel: 'Event',
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
