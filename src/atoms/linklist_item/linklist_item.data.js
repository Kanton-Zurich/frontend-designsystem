const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('linklist_item.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'LinklistItem',
    className: 'LinklistItem',
    jira: 'CZHDEV-188',
    documentation: dataHelper.getDocumentation('linklist_item.md'),
  },
  props: {
    linkListItemTitle: 'Test',
    linkListItemHref: '/',
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
  },
  withSubtitle: {
    meta: {
      title: 'Link mit zusätzlicher Zeile',
      desc: 'Bietet zusätzliche Zeile z.B. für Adresseinträge',
    },
    props: {
      linkListItemTitle: 'Strassenverkehrsamt Kanton Zürich',
      linkListItemLabel: 'Uetlibergstrasse 301, 8036 Zürich',
      linkListItemHref: '/',
    },
  },
  download: {
    meta: {
      title: 'Downloadlink',
      desc: 'Link für die Downloadliste',
    },
    props: {
      linkListItemIsDownload: true,
      linkListItemLabel: 'Dateityp | Seiten | DE | 100kb',
      linkListItemHref: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
  },
  downloadAsButton: {
    meta: {
      title: 'Downloadlink als Button (für mehrere Sprachen)',
      desc: 'Ein Button für die Downloadliste, welches ein Kontext-Menü öffnet',
    },
    props: {
      linkListItemIsDownload: true,
      linkListItemLabel: 'Dateityp | Seiten | Sprache | 100kb',
      isButton: true,
      linkListItemHref: false,
    },
  },
  legalFoundation: {
    meta: {
      title: 'Rechliche Grundlage herunterladen',
      desc: 'Ein Link welches ermöglicht eine rechtliche Grundlage herunterzuladen',
    },
    props: {
      linkListItemHref: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      linkListItemLabel: 'RRB Nr. 258 | 21.03.2019 | Direktion der Justiz und des Inneren',
      linkListItemTitle: 'ZHAW Hochschule Winterthur, Campus Technikumstrasse, Projektierung "Campus T" 1. Etappe, gebunde Ausgabe',
      isLegalFoundation: true,
      linkListItemIsDownload: true,
      isButton: false,
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
        data: dataHelper.getFormattedJson(variantProps),
        html: dataHelper.getFormattedHtml(compiledVariant()),
      },
    },
  });

  return variantData;
});

data.variants = variants;

module.exports = data;
