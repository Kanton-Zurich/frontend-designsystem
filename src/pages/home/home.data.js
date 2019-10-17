const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const defPageHeaderData = require('../../modules/page_header/page_header.data.js').variants.colored.props;
const headerData = require('../../modules/header/header.data').props;
const defNewsTeaserData = require('../../modules/news_teaser/news_teaser.data').variants.withProminentTeaser.props;
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;

const defPageHeaderCustomData = {
  pageTitle: 'Kanton Zürich',
  leadText: 'Lead: ExtraBold Interessierte können ab sofort die Genauigkeit ihrer Smartphones und Navigationsgeräte überprüfen. Die Baudirektion hat beim Landesmuseum in Zürich einen Kontrollpunkt beim Landesmuseum in Zürich einen Kontrollpunkt für mobile Geräte eingerichtet – den ersten in der Schweiz.',
  buttonData: { buttonTitle: 'Formular beantragen', serviceLink: '../../modules/service_list/service_page.mock.html', modalData: { modalId: 'service-modal0'},},
};

const contentTeaserDefaultData = require('../../atoms/content_teaser/content_teaser.data').variants.default.props;

const defContentNavCustomData = {
  items: [
    _.merge({}, contentTeaserDefaultData, {
      shortTitle: 'Gesundheit',
      buzzwords: 'Krankenversicherung, Prämienverbilligung, Kliniken',
    }),
    _.merge({}, contentTeaserDefaultData, {
      shortTitle: 'Familie',
      buzzwords: 'Partnerschaft, Eltern & Kinder, Untersützung für Kinder & Jugendliche, Alter, Tod, Vormunds Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua',
    }),
    _.merge({}, contentTeaserDefaultData, {
      shortTitle: 'Soziales',
      buzzwords: 'Arbeitslosigkeit, Finanzielle Hilfen, Sozialversicherungen, Beratungsangebote, Soziale Einricht Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua',
    }),
    _.merge({}, contentTeaserDefaultData, {
      shortTitle: 'Bildung',
      buzzwords: 'Bildungssystem, Schulen, Unterrichten, Schwierigkeiten in der Schule, Weiterbildung, Forschung, Bil Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua',
    }),
    _.merge({}, contentTeaserDefaultData, {
      shortTitle: 'Sport & Kultur',
      buzzwords: 'Jugendsport, Sportförderung, Kulturpolitik, Kulturförderung, Kulturpreise, Archä Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua',
    }),
    _.merge({}, contentTeaserDefaultData, {
      shortTitle: 'Wirtschaft & Arbeit',
      buzzwords: 'Arbeitsmarkt, Arbeitnehmer- & Arbeitgeberverhältnis, Schwarzarbeit, Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua',
    }),
    _.merge({}, {
      shortTitle: 'Steuern',
      buzzwords: 'Steuererklärung, Steuern bezahlen, Grundlagen',
    }),
    _.merge({}, contentTeaserDefaultData, {
      shortTitle: 'Mobilität',
      buzzwords: 'Reisen: Pass & ID, Fahren lernen, Führerausweis, Fahrzeuge, Autonummern, Gesamtverkehr, Öffentliches, Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua',
    }),
    _.merge({}, contentTeaserDefaultData, {
      shortTitle: 'Bauen & Planen',
      buzzwords: 'Karten, Bauprojekte (Hochbau), Baubewilligung, Wohnbauförderung, Energie, Lärm, Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua',
    }),
    _.merge({}, contentTeaserDefaultData, {
      shortTitle: 'Umwelt & Tier',
      buzzwords: 'Tier, Umweltschutz, Boden, Wald & Pflanzen, Wasser, Luft, Politik & Staat',
    }),
    _.merge({}, contentTeaserDefaultData, {
      shortTitle: 'Wahlen & Abstimmungen',
      buzzwords: 'Bezirke, Gemeinden, Daten & Statistik, Recht & Gesetze, Beschlüsse, Vernehmlassungen, Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua',
    }),
    _.merge({}, contentTeaserDefaultData, {
      shortTitle: 'Migration & Integration',
      buzzwords: 'Willkommen im Kanton Zürich, Einreise, Aufenthalt, Wegweisung, Asyl, Integration, Einbürgerung, Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua',
    }),
    _.merge({}, contentTeaserDefaultData, {
      shortTitle: 'Sicherheit & Justiz',
      buzzwords: 'Polizeimeldungen, Bussen, ePolice, Strafanzeige, Prävention, Kriminalität, Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua',
    }),
    _.merge({}, contentTeaserDefaultData, {
      shortTitle: 'Über den Kanton',
      buzzwords: 'Zahlen & Fakten, So funktioniert der Kanton, Grossprojekte, Ausgewählte Publikation, Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua',
    }),
  ],
};

const defContactCustomData = {
  fullWidth: true,
  contactTitle: 'Kontakt',
  contactAddress: {
    street: 'Neumühlequai 10',
    zip: '8090',
    city: 'Zürich',
    routeLinkHref: '#',
    routeLinkLabel: 'Route anzeigen',
  },
  contactPhone: [
    {
      anchorLabel: '043 259 11 11',
      phoneNumer: '+41432591111',
      additionalInfo: 'Telefon',
      openingTimes: [{
        timeTitle: 'Bürozeiten',
        times: [
          { text: 'Mo-Fr: 8.00 - 11:30 &' },
          { text: '13:30 - 17:00' },
        ],
      }],
    },
  ],
  contactMail: {
    address: 'info@sk.zh.ch',
  },
};

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Home',
    jira: 'CZHDEV-334',
    content: dataHelper.getFileContent('home.hbs'),
    documentation: dataHelper.getDocumentation('home.md'),
  },
  props: {
    header: headerData,
    title: 'Title',
    text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et '
    + 'dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita '
    + 'kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur.',
    modules: {
      pageHeaderData: _.merge(defPageHeaderData, defPageHeaderCustomData),
      contentNavData: defContentNavCustomData,
      contactData: defContactCustomData,
      newsTeaserData: defNewsTeaserData,
      footerData: defFooterData,
    },
  },
});

module.exports = data;
