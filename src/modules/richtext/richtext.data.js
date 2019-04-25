const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const {handlebars} = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('richtext.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Text',
    className: 'Richtext',
    jira: 'CZHDEV-111',
    documentation: dataHelper.getDocumentation('richtext.md'),
  },
  props: {
    h1Text: 'H1: Pagetitle Black Strassenverkehrsamt',
    h2Text: 'H2: Content title Black',
    h3Text: 'H3: Black title Kontrollpunkt für mobile Geräte eingerichtet – den ersten in der Schweiz.',
    h4Text: 'H4: Black title',
    pText: 'P, Regular Interessierte können ab sofort die Genauigkeit ihrer Smartphones und Navigationsgeräte überprüfen. Die'
      + ' Baudirektion hat beim <a href="">Landesmuseum</a> in Zürich einen Kontrollpunkt beim Landesmuseum in Zürich einen Kontrollpunktfür'
      + ' mobile Geräte eingerichtet – den ersten in der Schweiz.P, Helvetic Roman Interessierte können ab sofort die'
      + ' Genauigkeit ihrer Smartphones und Navigationsgeräte überprüfen.'
      + ' Die Baudirektion hat beim Landesmuseum in Zürich einen Kontrollpunkt beim Landesmuseum in Zürich einen'
      + ' Kontrollpunktfür mobile Geräte eingerichtet – den ersten in der Schweiz.',
    pText2: ' Die Baudirektion hat beim Landesmuseum in Zürich einen Kontrollpunkt beim Landesmuseum in Zürich einen Kontrollpunkt'
      + ' für mobile Geräte eingerichtet – den ersten in der Schweiz.',
    leadText: 'Lead: ExtraBold Interessierte können ab sofort die Genauigkeit ihrer Smartphones und Navigationsgeräte überprüfen.'
      + ' Die Baudirektion hat beim Landesmuseum in Zürich einen Kontrollpunkt beim Landesmuseum in Zürich einen Kontrollpunkt'
      + ' für mobile Geräte eingerichtet – den ersten in der Schweiz.',
    listItem1: 'P, Helvetic Roman Interessierte können ab sofort die Genauigkeit ihrer Smartphones und Navigationsgeräte überprüfen.',
    listItem2: 'Die Baudirektion hat beim Landesmuseum in Zürich einen Kontrollpunkt beim Landesmuseum in Zürich einen Kontrollpunkt.',
    listItem3: 'Koordinaten begegnen uns täglich.',
    benefitItem: 'Informiert werden, sobald eine Sendung unterwegs ist. Informiert werden, sobald eine Sendung unterwegs ist',
    emphasisText: 'Das richtige Paradigma von Projektmanagementerfolg stützt sich nicht auf die Einhaltung von Rahmenbedingungen,'
      + ' sondern orientiert sich am tieferen Sinn der Aufgabe: Das Transformieren von Ressourcen in Resultate, welche dem Unternehmen einen Nutzen stiften.',
    quoteText: '«Das richtige Paradigma von Projektmanagementerfolg stützt sich nicht auf die Einhaltung von'
      + ' Rahmenbedingungen, sondern orientiert sich am tieferen Sinn der Aufgabe: Das Transformieren von Ressourcen in'
      + ' Resultate, welche dem Unternehmen einen Nutzen stiften.»',
    quoteAuthor: 'Claudia Pletscher, Leiterin Entwicklung',
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Primary',
      desc: '',
    },
    props: {},
  },
  inverted: {
    meta: {
      title: 'Invertiert',
      desc: '',
    },
    props: {
      inverted: true,
    },
  },
  blue: {
    meta: {
      title: 'ZH Blau',
      desc: '',
    },
    props: {
      colorVariation: 'blue',
    },
  },
  darkblue: {
    meta: {
      title: 'ZH Dunkelblau',
      desc: '',
    },
    props: {
      colorVariation: 'darkblue',
    },
  },
  turqoise: {
    meta: {
      title: 'ZH Türkis',
      desc: '',
    },
    props: {
      colorVariation: 'turqoise',
    },
  },
  green: {
    meta: {
      title: 'ZH Grün',
      desc: '',
    },
    props: {
      colorVariation: 'green',
    },
  },
  bordeaux: {
    meta: {
      title: 'ZH Bordeaux',
      desc: '',
    },
    props: {
      colorVariation: 'bordeaux',
    },
  },
  magenta: {
    meta: {
      title: 'ZH Magenta',
      desc: '',
    },
    props: {
      colorVariation: 'magenta',
    },
  },
  violet: {
    meta: {
      title: 'ZH Violett',
      desc: '',
    },
    props: {
      colorVariation: 'violet',
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
