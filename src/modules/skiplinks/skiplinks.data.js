const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('skiplinks.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Sprunglinks',
    className: 'Skiplinks',
    jira: 'CZHDEV-292',
    label: 'Navigation',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {},
});

data.colorVariations = []; // no color variations available

const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Standard',
        desc: 'Keine visuelle Darstellung ausser, wenn ein Sprunglink Fokus erhält.',
      },
      props: {
        skiplinks: [
          {
            href: '/',
            accesskey: 0,
            label: 'Startseite',
          },
          {
            href: '#navigation',
            accesskey: 1,
            label: 'Navigation',
          },
          {
            href: '#main',
            accesskey: 2,
            label: 'Inhalt',
          },
          {
            href: '#contact',
            accesskey: 3,
            label: 'Kontakt',
          },
          {
            href: '#toc',
            accesskey: 4,
            label: 'Auf dieser Seite',
          },
          {
            href: '#search',
            accesskey: 5,
            label: 'Suche',
          },
          {
            href: '#contentinfo',
            accesskey: 6,
            label: 'Fussbereich',
          },
        ],
      },
    },
    noToc: {
      meta: {
        title: 'Standard',
        desc: 'Keine visuelle Darstellung ausser, wenn ein Sprunglink Fokus erhält.',
      },
      props: {
        skiplinks: [
          {
            href: '/',
            accesskey: 0,
            label: 'Startseite',
          },
          {
            href: '#navigation',
            accesskey: 1,
            label: 'Navigation',
          },
          {
            href: '#main',
            accesskey: 2,
            label: 'Inhalt',
          },
          {
            href: '#contact',
            accesskey: 3,
            label: 'Kontakt',
          },
          {
            href: '#search',
            accesskey: 5,
            label: 'Suche',
          },
          {
            href: '#contentinfo',
            accesskey: 6,
            label: 'Fussbereich',
          },
        ],
      },
    },
    fullsize: {
      meta: {
        title: 'Für Fullsize-Layout',
        desc: 'Reduzierte Sprunglinks, wenn kein Kontakt und Footer auf der Seite zu finden sind (Applikationen, iFrame).',
      },
      props: {
        skiplinks: [
          {
            href: '/',
            accesskey: 0,
            label: 'Startseite',
          },
          {
            href: '#navigation',
            accesskey: 1,
            label: 'Navigation',
          },
          {
            href: '#main',
            accesskey: 2,
            label: 'Inhalt',
          },
          {
            href: '#search',
            accesskey: 5,
            label: 'Suche',
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
