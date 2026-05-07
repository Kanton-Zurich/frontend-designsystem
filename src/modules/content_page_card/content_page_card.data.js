const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('content_page_card.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Inhaltsseite Card',
    className: 'ContentPageCard',
    jira: 'CZHDEV-4785',
    label: 'Teaser',
    documentation: dataHelper.getDocumentation('README.md'),
  },
});

const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Default',
        desc: 'Default content card implementation',
      },
      props: {
        title: 'Internationaler Führerausweis',
        teaserText:
          'In nicht englischsprachigen Ländern ausserhalb der EU emp<mark class="searchhighlight">fehlen</mark> wir Ihnen, einen internationalen Führerschein ausstellen zu lassen.',
        breadcrumb: 'Strassenverkehrsamt ‣ Führerausweis ‣ Internationaler Führerausweis',
        link: 'http://search.zh.ch/xyz',
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
