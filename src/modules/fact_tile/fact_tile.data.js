const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('fact_tile.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Fact Tile',
    className: 'FactTile',
    jira: 'CZHDEV-4316',
    label: 'Inhalt',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    stacked: false,
    inverted: true,
    title: 'Einwohner/innen 2021',
    content: {
      icon: {
        src: '../../assets/media/image/facts_folder.svg',
      },
      number: '+32%',
      unit: 'Wachstum',
    },
    info: {
      description: 'Einwohner nach Alter und Geschlecht',
      textLink: {
        icon: 'arrow-right',
        text: 'Text Link',
        hasLeadingIcon: true,
        hasTrailingIcon: false,
      },
    },
  },
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Default',
        desc: 'Zahl neben Icon',
      },
    },
    defaultWithLongContent: {
      meta: {
        title: 'Default mit langem Inhalt',
        desc: 'Zahl neben Icon mit langem Inhalt',
      },
      props: {
        title: 'Aspekte des Wohlbefindens',
        content: {
          icon: {
            src: '../../assets/media/image/facts_growth.svg',
          },
          number: '12’345’600',
          unit: 'Erkrankungen insgesamt',
        },
      },
    },
    defaultWithLongLink: {
      meta: {
        title: 'Default mit langem Link',
        desc: 'Zahl neben Icon mit langem Link',
      },
      props: {
        info: {
          textLink: {
            icon: 'arrow-right',
            text: 'Text Link mit sehr langem Text. Occaecati sunt soluta minus qui sequi. Ut eveniet ut et iusto ut harum neque. Similique labore facere eveniet illum ratione quod consequatur pariatur. Reprehenderit beatae fugit aut qui laborum.',
            hasLeadingIcon: true,
            hasTrailingIcon: false,
          },
        },
      },
    },
    defaultWithoutTitle: {
      meta: {
        title: 'Default ohne Titel',
        desc: 'Zahl neben Icon ohne Titel',
      },
      props: {
        title: '',
        content: {
          icon: {
            src: '../../assets/media/image/facts_thumb-up.svg',
          },
          number: '1345',
          unit: 'Gewünscht',
        },
      },
    },
    defaultWithoutUnit: {
      meta: {
        title: 'Default ohne Einheit',
        desc: 'Zahl neben Icon ohne Einheit',
      },
      props: {
        title: 'Anträge 2021',
        content: {
          icon: {
            src: '../../assets/media/image/facts_thumb-down.svg',
          },
          number: '1345',
          unit: '',
        },
      },
    },
    defaultWithoutDescription: {
      meta: {
        title: 'Default ohne Beschreibung',
        desc: 'Zahl neben Icon ohne Beschreibung',
      },
      props: {
        info: {
          description: '',
          textLink: {
            icon: 'arrow-right',
            text: 'Zur Statistik',
            hasLeadingIcon: true,
            hasTrailingIcon: false,
          },
        },
      },
    },
    defaultWithoutLink: {
      meta: {
        title: 'Default ohne Link',
        desc: 'Zahl neben Icon ohne Link',
      },
      props: {
        info: {
          textLink: false,
        },
      },
    },
    defaultWithoutLinkDescription: {
      meta: {
        title: 'Default ohne Beschreibung und Link',
        desc: 'Zahl neben Icon ohne Link',
      },
      props: {
        info: {
          description: '',
          textLink: false,
        },
      },
    },
    defaultWithoutLinkDescriptionTitle: {
      meta: {
        title: 'Default ohne Titel, Beschreibung und Link',
        desc: 'Zahl neben Icon ohne Titel, Beschreibung und Link',
      },
      props: {
        title: '',
        info: {
          description: '',
          textLink: false,
        },
      },
    },
    defaultWithoutTitleUnitLink: {
      meta: {
        title: 'Default ohne Titel, Einheit und Link',
        desc: 'Zahl neben ohne Titel, Einheit und Link',
      },
      props: {
        title: '',
        content: {
          unit: '',
        },
        info: {
          textLink: false,
        },
      },
    },
    stacked: {
      meta: {
        title: 'Stacked',
        desc: 'Zahl unter Icon',
      },
      props: {
        stacked: true,
      },
    },
    stackedWithLongContent: {
      meta: {
        title: 'Stacked mit langem Inhalt',
        desc: 'Zahl neben Icon mit langem Inhalt',
      },
      props: {
        stacked: true,
        content: {
          number: '12’345’600',
          unit: 'Erkrankungen insgesamt',
        },
      },
    },
    stackedWithLongLink: {
      meta: {
        title: 'Stacked mit langem Link',
        desc: 'Zahl neben Icon mit langem Link',
      },
      props: {
        stacked: true,
        info: {
          description:
            'Einwohner nach Hochleistungsflüssigkeitschromatographie nach Loremipsumdolorsitameconsectetur und Geschlecht Einwohner nach Alter und Geschlecht',
          textLink: {
            icon: 'arrow-right',
            text: 'Einwohner Telekommunikationsüberwachungsverordnung und EinwohnerEinwohnerEinwohnerEinwohnerEinwohner',
            hasLeadingIcon: true,
            hasTrailingIcon: false,
          },
        },
      },
    },
    stackedWithoutTitle: {
      meta: {
        title: 'Stacked ohne Titel',
        desc: 'Zahl neben Icon ohne Titel',
      },
      props: {
        stacked: true,
        title: '',
        content: {
          icon: {
            src: '../../assets/media/image/facts_thumb-up.svg',
          },
          number: '1345',
          unit: 'Gewünscht',
        },
      },
    },
    stackedWithoutUnit: {
      meta: {
        title: 'Stacked ohne Einheit',
        desc: 'Zahl neben Icon ohne Einheit',
      },
      props: {
        stacked: true,
        content: {
          icon: {
            src: '../../assets/media/image/facts_thumb-down.svg',
          },
          number: '1345',
          unit: '',
        },
      },
    },
    stackedWithoutDescription: {
      meta: {
        title: 'Stacked ohne Beschreibung',
        desc: 'Zahl neben Icon ohne Beschreibung',
      },
      props: {
        stacked: true,
        info: {
          description: '',
          textLink: {
            icon: 'arrow-right',
            text: 'Zur Statistik',
            hasLeadingIcon: true,
            hasTrailingIcon: false,
          },
        },
      },
    },
    stackedWithoutLink: {
      meta: {
        title: 'Stacked ohne Link',
        desc: 'Zahl neben Icon ohne Link',
      },
      props: {
        stacked: true,
        info: {
          textLink: false,
        },
      },
    },
    stackedWithoutLinkAndDescription: {
      meta: {
        title: 'Stacked ohne Beschreibung und Link',
        desc: 'Zahl neben Icon ohne Link',
      },
      props: {
        stacked: true,
        info: {
          description: '',
          textLink: false,
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
