const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const contentNavDataDef = require('../content_nav/content_nav.data').variants.default.props;
const contentTeaserDataWithoutBuzzwords = require('../../atoms/content_teaser/content_teaser.data').variants.withoutBuzzwords.props;
const contentTeaserDefaultData = require('../../atoms/content_teaser/content_teaser.data');
const inputFormData = require('../../atoms/form_input/form_input.data').props;
const subnavigationTemplate = require('../subnavigation/subnavigation.data').variants.default.meta.code.template;

const template = dataHelper.getFileContent('topiclist.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Themenliste',
    className: 'Topiclist',
    jira: 'CZHDEV-505',
    documentation: dataHelper.getDocumentation('topiclist.md'),
  },
  props: {
    isNavigation: false,
    topiclistHeading: {
      level: 2,
      title: 'Unsere Themen',
      anchorNavReference: '',
    },
    topiclistLead: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore '
    + 'et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. '
    + 'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit '
    + 'amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam '
    + 'erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, '
    + 'no sea takimata sanctus est Lorem ipsum dolor sit amet.',
    topiclistButtonLabel: 'Alle anzeigen',
    topiclistInputPlaceholder: '',
    topiclistcontentNavData: _.merge({}, contentNavDataDef, {
      selector: 'data-topiclist="contentNav"',
      items: [
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: 'Führerausweis',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: 'Fahrzeug',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: 'Autonummern',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: 'Führerausweis',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: 'Velo',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: 'Ausweis oder Schild verloren',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: 'Ausweisentzug & Verwarnung',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: 'Schiffahrt',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: 'Spezielle Bewilligungen',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: 'Velo',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: 'Velo',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: 'Ausweis oder Schild verloren',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: 'Fahren im Alter1',
        }),
      ],
    }),
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default Themenliste (CZHDEV-505 )',
      desc: 'Default implementation bzw. reguläre Themenliste. Title mit Fliesstext sowie einer Content-Navigation nur'
      + ' mit buzzwords und einem "Alle anzeigen" Button sowie versteckten Items ab einer Anzahl von mehr als 12.',
    },
  },
  home: {
    meta: {
      title: 'Themenliste Home (CZHDEV-507)',
      desc: 'Themenliste auf der Startseite mit Filtermöglichkeit',
    },
    props: {
      topiclistInput: _.merge({}, inputFormData, {
        label: 'Themen nach Stichwort filtern',
        isSmall: true,
        selector: 'data-topiclist="input"',
        hasClearButton: true,
      }),
      topiclistHeading: false,
      topiclistLead: false,
      isTopiclistHome: true,
      topiclistButtonLabel: 'Alle anzeigen',
      topiclistcontentNavData: _.merge({}, contentNavDataDef, {
        items: [
          _.merge({}, contentTeaserDefaultData.variants.default.props, {
            shortTitle: 'Gesundheit',
            buzzwords: 'Krankenversicherung, Gesundheitsversorgung, Gesundheitsberufe, Gesund bleiben',
          }),
          _.merge({}, contentTeaserDefaultData.variants.default.props, {
            shortTitle: 'Familie',
            buzzwords: 'Partnerschaft, Eltern & Kinder, Unterstützung für Kinder & Jugendliche, Alter, Tod, Vormundschaft',
          }),
          _.merge({}, contentTeaserDefaultData.variants.default.props, {
            shortTitle: 'Soziales',
            buzzwords: 'Arbeitslosigkeit, Finanzielle Hilfen, Sozialversicherungen, Beratungsangebote, Soziale Einrichtungen',
          }),
          _.merge({}, contentTeaserDefaultData.variants.default.props, {
            shortTitle: 'Bildung',
            buzzwords: 'Bildungssystem, Schulen, Unterrichten, Schwierigkeiten in der Schule, Weiterbildung, Forschung, Bildungsgerechtigkeit',
          }),
          _.merge({}, contentTeaserDefaultData.variants.default.props, {
            shortTitle: 'Sport & Kultur',
            buzzwords: 'Jugendsport, Sportförderung, Kulturpolitik, Kulturförderung, Kulturpreise, Archäologie',
          }),
          _.merge({}, contentTeaserDefaultData.variants.default.props, {
            shortTitle: 'Wirtschaft & Arbeit',
            buzzwords: 'Arbeitsmarkt, Arbeitnehmer- & Arbeitgeberverhältnis, Schwarzarbeit',
          }),
          _.merge({}, contentTeaserDefaultData.variants.default.props, {
            shortTitle: 'Steuern',
            buzzwords: 'Steuererklärung, Steuern bezahlen, Grundlagen',
          }),
          _.merge({}, contentTeaserDefaultData.variants.default.props, {
            shortTitle: 'Mobilität',
            buzzwords: 'Reisen: Pass & ID, Fahren lernen, Führerausweis, Fahrzeuge, Autonummern, Gesamtverkehr, Öffentlicher Verkehr',
          }),
          _.merge({}, contentTeaserDefaultData.variants.default.props, {
            shortTitle: 'Bauen & Planen',
            buzzwords: 'Karten, Bauprojekte (Hochbau), Baubewilligung, Wohnbauförderung, Energie, Lärm',
          }),
          _.merge({}, contentTeaserDefaultData.variants.default.props, {
            shortTitle: 'Umwelt & Tier',
            buzzwords: 'Tier, Umweltschutz, Boden, Wald & Pflanzen, Wasser, Luft, Politik & Staat',
          }),
          _.merge({}, contentTeaserDefaultData.variants.default.props, {
            shortTitle: 'Wahlen & Abstimmungen',
            buzzwords: 'Bezirke, Gemeinden, Daten & Statistik, Recht & Gesetze, Beschlüsse, Vernehmlassungen',
          }),
          _.merge({}, contentTeaserDefaultData.variants.default.props, {
            shortTitle: 'Migration & Integration',
            buzzwords: 'Willkommen im Kanton Zürich, Einreise, Aufenthalt, Wegweisung, Asyl, Integration, Einbürgerung',
          }),
          _.merge({}, contentTeaserDefaultData.variants.default.props, {
            shortTitle: 'Sicherheit & Justiz',
            buzzwords: 'Polizeimeldungen, Bussen, ePolice, Strafanzeige, Prävention, Kriminalitätsstatisik',
          }),
          _.merge({}, contentTeaserDefaultData.variants.default.props, {
            shortTitle: 'Über den Kanton',
            buzzwords: 'Zahlen & Fakten, So funktioniert der Kanton, Grossprojekte, Ausgewählte Publikationen',
          }),
        ],
      }),
      autosuggestTopicList: {
        items: [],
        selector: 'data-topiclist="autosuggest"',
        additionalClasses: 'mdl-topiclist__autosuggest mdl-content_nav--single-column',
      },
      contentTeaserTemplate: contentTeaserDefaultData.variants.default.meta.code.template,
      options: JSON.stringify({
        url: '/mocks/modules/topiclist/topiclist.json',
      }),
    },
  },
  topicsNav: {
    meta: {
      title: 'Themenliste Hauptnavigation',
      desc: 'Themenliste für die Hauptnavigation',
    },
    props: {
      isNavigation: true,
      topiclistInput: _.merge({}, inputFormData, {
        label: 'Themen nach Stichwort filtern',
        isSmall: true,
        selector: 'data-topiclist="input"',
        hasClearButton: true,
      }),
      topiclistHeading: false,
      topiclistLead: false,
      isTopiclistHome: true,
      topiclistButtonLabel: 'Alle anzeigen',
      topiclistcontentNavData: {
        items: [],
        selector: 'data-topiclist="navigation"',
        additionalClasses: 'mdl-topiclist__navigation',
      },
      autosuggestTopicList: {
        items: [],
        selector: 'data-topiclist="autosuggest"',
        additionalClasses: 'mdl-topiclist__autosuggest mdl-content_nav--single-column',
      },
      contentTeaserTemplate: contentTeaserDefaultData.variants.default.meta.code.template,
      options: JSON.stringify({
        url: '/mocks/modules/topiclist/topiclist.json',
      }),
      subnavigationTemplate,
    },
  },
  organisationNav: {
    meta: {
      title: 'Organisation Hauptnavigation',
      desc: 'Organisationen für die Hauptnavigation',
    },
    props: {
      isNavigation: true,
      topiclistInput: _.merge({}, inputFormData, {
        label: 'Filtern nach Amt, Fachstelle, Direktion',
        isSmall: true,
        selector: 'data-topiclist="input"',
        hasClearButton: true,
      }),
      topiclistHeading: false,
      topiclistLead: false,
      isTopiclistHome: true,
      topiclistButtonLabel: 'Alle anzeigen',
      topiclistcontentNavData: {
        items: [],
        selector: 'data-topiclist="navigation"',
        additionalClasses: 'mdl-topiclist__navigation',
      },
      autosuggestTopicList: {
        items: [],
        selector: 'data-topiclist="autosuggest"',
        additionalClasses: 'mdl-topiclist__autosuggest mdl-content_nav--single-column',
      },
      contentTeaserTemplate: contentTeaserDefaultData.variants.default.meta.code.template,
      options: JSON.stringify({
        url: '/mocks/modules/topiclist/topiclist.organisations.json',
      }),
      subnavigationTemplate,
      organisationTeaser: {
        orgTitle: 'Regierungsrat',
        orgLead: 'Der Regierungsrat ist die oberste leitende und vollziehende Behörde des Kantons. Er wahrt die Verfassung und setzt die Gesetze, Verordnungen und die Beschlüsse des Kantonsrates um.',
        url: '#',
      },
    },
  },
}, (variant) => {
  // eslint-disable-next-line consistent-return
  const variantProps = _.mergeWith({}, data, variant, (dataValue, variantValue, key) => {
    if (key === 'items') {
      return variantValue;
    }
  }).props;

  const compiledVariant = () => handlebars.compile(template)(variantProps);
  const variantData = _.mergeWith({}, data, variant, {
    meta: {
      demo: compiledVariant,

      code: {
        handlebars: dataHelper.getFormattedHandlebars(template),
        html: dataHelper.getFormattedHtml(compiledVariant()),
        data: dataHelper.getFormattedJson(variantProps),
      },
    },
    // eslint-disable-next-line consistent-return
  }, (dataValue, variantValue, key) => {
    if (key === 'items') {
      return variantValue;
    }
  });

  return variantData;
});

data.variants = variants;

module.exports = data;
