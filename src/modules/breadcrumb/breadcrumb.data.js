const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
// const defaultData = require('../../data/default.data.js');
const template = dataHelper.getFileContent('breadcrumb.hbs');
const data = _.merge(
  {},
  {
    meta: {
      title: 'Breadcrumb',
      className: 'Breadcrumb',
      jira: 'CZHDEV-436',
      label: 'Navigation',
      documentation: dataHelper.getDocumentation('README.md'),
      disabledColorVariations: [
        'cv-monochrome',
        'cv-turqoise',
        'cv-bordeaux',
        'cv-magenta',
        'cv-violet',
        'cv-green',
        'cv-darkblue',
        'cv-anthracite',
      ],
      defaultColorVariation: 'cv-blue',
    },
    props: {},
  }
);
const variants = _.mapValues(
  {
    /* default: {
    meta: {
      title: 'Default',
      desc: 'Standardmässige Implementierung',
    },
    props: {
      path: [
        {
          title: 'Kanton Zürich',
          href: '#',
        },
        {
          title: 'Urgrosselternseite',
          href: '#',
        },
        {
          title: 'Grosselternseite',
          href: '#',
        },
        {
          title: 'Elternseite',
          href: '#',
        },
        {
          title: 'aktuelle Seite',
        },
      ],
    },
  }, */
    backOnly: {
      meta: {
        title: 'Nur Zurück',
        desc: 'Wenn es nur ein Zurück-Link ist',
      },
      props: {
        backOnly: true,
        hasStorage: true,
        path: [
          {
            title: 'Zurück',
            href: '#',
          },
        ],
      },
    },
    /* twoItems: {
    meta: {
      title: 'Zwei Elemente',
      desc: 'Spezialfall wenn 2 Elemente angezeigt werden müssen',
    },
    props: {
      contextMenu: false,
      path: [
        {
          title: 'Kanton Zürich',
          href: '#',
        },
        {
          title: 'Aktuelle Seite',
        },
      ],
    },
  },
  singleItemErrorPage: {
    meta: {
      title: 'einzelnes Item',
      desc: 'Für 404-Seiten z.B.',
    },
    props: {
      backOnly: false,
      disableJS: true,
      path: [
        {
          title: 'Kanton Zürich',
          href: '#',
        },
      ],
    },
  },
  */
    parentOnly: {
      meta: {
        title: 'Nur auf Elternseite',
        desc: 'Für Regierungsplattform',
      },
      props: {
        parentOnly: true,
        path: [
          {
            title: 'Parent Page',
            href: '#',
          },
        ],
      },
    },
    eDirectory: {
      meta: {
        title: 'eDirectory',
        desc: 'eDirectory',
      },
      props: {
        spa: true,
        path: [],
      },
    },
  },
  (variant) => {
    // eslint-disable-next-line
    const variantProps = _.mergeWith({}, data, variant, (dataValue, variantValue, key) => {
      if (key === 'path') {
        return variantValue;
      }
    }).props;
    const compiledVariant = () => handlebars.compile(template)(variantProps);
    const variantData = _.mergeWith(
      {},
      data,
      variant,
      {
        meta: {
          demo: compiledVariant,

          code: {
            handlebars: dataHelper.getFormattedHandlebars(template),
            html: dataHelper.getFormattedHtml(compiledVariant()),
            data: dataHelper.getFormattedJson(variantProps),
          },
        },
        // eslint-disable-next-line
      },
      (dataValue, variantValue, key) => {
        if (key === 'path') {
          return variantValue;
        }
      }
    );

    return variantData;
  }
);

data.variants = variants;

module.exports = data;
