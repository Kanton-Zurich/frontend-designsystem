const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('sibling_navigation.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Geschwister-Navigation',
    className: 'SiblingNavigation',
    jira: 'CZHDEV-3522',
    label: 'Navigation',
    documentation: dataHelper.getDocumentation('README.md'),
  },
});

const labels = {
  previous: 'Vorherige',
  next: 'Nächste',
};

const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Default',
        desc: 'Default implementation',
      },
      props: {
        labels,
        heading: {
          title: 'Weitere Legislaturziele',
          level: 2,
          visualLevel: 2,
        },
        previous: {
          linkText: 'Internationalen Führerschein beantragen',
          url: '#',
        },
        next: {
          linkText: 'Der Kanton ist zweckmässig und wirtschaftlich organisiert.',
          url: '#',
        },
      },
    },
    longTitle: {
      meta: {
        title: 'Langer Titel',
        desc: 'Default implementation mit langem Titel',
      },
      props: {
        labels,
        heading: {
          title: 'Weitere Legislaturziele',
          level: 2,
          visualLevel: 2,
        },
        previous: {
          linkText: 'Führerschein ',
          url: '#',
        },
        next: {
          linkText: 'Der Kanton ist zweckmässigundwirtschaftlich organisiert.',
          url: '#',
        },
      },
    },
    noNext: {
      meta: {
        title: 'Keine Nächste',
        desc: 'Keine Nächste',
      },
      props: {
        labels,
        heading: {
          title: 'Weitere Legislaturziele',
          level: 2,
          visualLevel: 2,
        },
        previous: {
          linkText: 'Internationalen Führerschein beantragen',
          url: '#',
        },
      },
    },
    noPrev: {
      meta: {
        title: 'Keine Vorherige',
        desc: 'Keine Vorherige',
      },
      props: {
        labels,
        heading: {
          title: 'Weitere Legislaturziele',
          level: 2,
          visualLevel: 2,
        },
        next: {
          linkText: 'Der Kanton ist zweckmässig und wirtschaftlich organisiert.',
          url: '#',
        },
      },
    },
    noHeader: {
      meta: {
        title: 'Kein Header',
        desc: 'Kein Header',
      },
      props: {
        labels,
        previous: {
          linkText: 'Internationalen Führerschein beantragen',
          url: '#',
        },
        next: {
          linkText: 'Der Kanton ist zweckmässig und wirtschaftlich organisiert.',
          url: '#',
        },
      },
    },
    reports: {
      meta: {
        title: 'Berichte',
        desc: 'Für Online-Berichte',
      },
      props: {
        labels,
        heading: {
          title: 'Weiterlesen',
          level: 2,
          visualLevel: 2,
        },
        next: {
          linkText: '2.2 Organisationsformen',
          url: '#',
        },
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
