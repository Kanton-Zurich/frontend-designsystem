const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const contentNavDataDef = require('../content_nav/content_nav.data').variants.default.props;
const contentTeaserDefaultData = require('../../atoms/content_teaser/content_teaser.data').variants
  .default.props;

const template = dataHelper.getFileContent('related_content.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Verwandte Inhalte',
    className: 'RelatedContent',
    jira: 'CZHDEV-397',
    label: 'Navigation',
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
        fullWidth: true,
        anchorNavReference: 'related_content',
        heading: {
          title: 'Das könnte Sie auch interessieren',
          level: 2,
          visualLevel: 2,
        },
        contentNavData: contentNavDataDef,
      },
    },
    amtNavigation: {
      meta: {
        title: 'Amt Navigation (CZHDEV-503)',
        desc: 'Title mit Fliesstext und einer Content-Navigation',
      },
      props: {
        heading: {
          level: 2,
          visualLevel: 2,
          title: 'Ämter und Bereiche',
        },
        relatedContentLead:
          'Der Sicherheitsdirektion sind folgende Ämter und Fachstellen untergeordnet',
        contentNavData: {
          forceTwoColumns: true,
          items: [
            _.merge({}, contentTeaserDefaultData, {
              shortTitle: 'Kantonspolizei',
              buzzwords:
                'Sicherheit, Kriminal-, Sicherheits und Verkehrspolizei, Prävention, Repression Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy',
            }),
            _.merge({}, contentTeaserDefaultData, {
              shortTitle: 'Forensisches Institut Zürich',
              buzzwords:
                'Kriminalwissenschaft, Spurensicherung, Unfalltechnik, Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy',
            }),
            _.merge({}, contentTeaserDefaultData, {
              shortTitle: 'Strassenverkehrsamt',
              buzzwords:
                'Füherausweis, Fahrzeugprüfung, Fahrzeug, Autonummern, Velo, Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy',
            }),
            _.merge({}, contentTeaserDefaultData, {
              shortTitle: 'Passbüro',
              buzzwords: 'Ausweise, Passanträge, Reisepass, Provisorischer Pass, Identitätskarten',
            }),
            _.merge({}, contentTeaserDefaultData, {
              shortTitle: 'Migrationsamt',
              buzzwords:
                'Einreise- und Aufenthaltsbewilligungen, Visumsverlängerungen, Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy',
            }),
            _.merge({}, contentTeaserDefaultData, {
              shortTitle: 'Sozialamt',
              buzzwords:
                'Öffentliche Sozialhilfe, Unterstützung Bedürftiger, Asylfürsorge, AHV/IV, Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy',
            }),
            _.merge({}, contentTeaserDefaultData, {
              shortTitle: 'Beglaubigungen und Gewerbebewilligungen',
              buzzwords:
                'Apostillen, Beglaubigungen, Tombolas, Lotto, Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy',
            }),
            _.merge({}, contentTeaserDefaultData, {
              shortTitle: 'Eichämter',
              buzzwords: 'Amtliche Prüfung, Waagen, Tanksäulen, Abgasmessgeräte',
            }),
            _.merge({}, contentTeaserDefaultData, {
              shortTitle: 'Amt für Militär und Zivilschutz',
              buzzwords:
                'Militärverwaltung, Zivilschutzes, Wehrpflicht, Verteidigung, Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy',
            }),
          ],
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
