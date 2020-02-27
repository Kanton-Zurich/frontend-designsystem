const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.noToc.props;
const headerData = require('../../modules/header/header.data').variants.inverted.props;

const defPageHeaderData = require('../../modules/page_header/page_header.data.js');
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const defBack2TopData = require('../../modules/back2top/back2top.data').variants.default.props;
const defReleatedContentData = require('../../modules/related_content/related_content.data.js').variants.default.props;
const defContactData = require('../../modules/contact/contact.data.js').variants.smallMailOnly.props;
const defTagGroupData = require('../../modules/tag_group/tag_group.data.js').variants.default.props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Flex Data Detailseite (Entscheide)',
    jira: 'CZHDEV-1234',
    content: dataHelper.getFileContent('decision_detail.hbs'),
    documentation: dataHelper.getDocumentation('decision_detail.md'),
  },
  props: {
    header: headerData,
    skiplinks: skiplinksData,
    modules: {
      pageHeaderData: _.merge({}, defPageHeaderData.variants.rrbDetail.props, {
        pageTitle: 'Entscheid 3021',
        breadcrumb: {
          path: [{
            title: 'Zurück zur Übersicht',
            href: '#',
          }],
        },
      }),
      metablockData: {
        rows: [{
          columns: [{
            label: 'Entscheidinstanz',
            text: 'Sicherheitsdirektion',
          },
          {
            label: 'Geschäftsnummer',
            text: '2017.0067',
          }],
        }, {
          columns: [{
            label: 'Entscheiddatum',
            text: '10.03.1985',
          },
          {
            label: 'Rechtsgebiet',
            text: 'Sozialhilfe',
          }],
        }, {
          columns: [{
            label: 'Stichworte',
            text: 'Nothilfeleistungen für abgewiesene Asylbewerber,<br /> kantonale Notunterkünfte,<br /> Realakt,<br /> Sonderstatusverhältnis',
          },
          {
            label: 'Verwendete Erlasse',
            text: 'Art. 7, 12 BV,<br />Art. 80–82 AsylG,<br />§ 5c SHG,§ 10 c VRG,<br />Nothilfeverordnung vom 24. Oktober 2007',
          }],
        }, {
          columns: [{
            label: 'Zusammenfassung (verfasst von der Staatskanzlei)',
            text: '<p class="atm-paragraph">Notunterkünfte beherbergen abgewiesene und rechtskräftig aus der Schweiz weggewiesene Asylbewerber, deren Wegweisung von den zuständigen Behörden und Gerichten als möglich, zulässig und zumutbar beurteilt wurde, die aber nicht freiwillig ausreisen, rechtswidrig hier bleiben und auch nicht zwangsweise ausgeschafft werden können. Nothilfe wird ihnen in Form von Naturalien wie Obdach, Kleidung und Hygienemittel sowie mit einem täglichen Barbetrag für Esswaren gewährt. Während bereits früher die Regelung galt, dass Nothilfe nur erhält, wer in der Notunterkunft übernachtet, wurden die Bezüger anfangs Februar mit einem Merkblatt über eine Änderung des Vorgehens orientiert. Statt wie bisher auf drei Tage verteilt wird neu die Nothilfe auf fünf Tage pro Woche verteilt ausgerichtet, dies weiterhin nur an Personen, die in der Notunterkunft übernachten, und nur an Personen, die jeweils bei der Anwesenheitskontrolle von Montag bis Freitag (zwischen 08:30 Uhr und 09:30 Uhr morgens und zwischen 16:00 Uhr und 21:00 Uhr abends) anwesend sind. Mit dem dagegen erhobenen Rekurs wird im Wesentlichen verlangt, die Nothilfe wie bisher dreimal pro Woche auszurichten und auf die täglich zweimaligen Präsenzkontrollen von Montag bis Freitag zu verzichten.</p>'
              + '<p class="atm-paragraph">Das angefochtene Merkblatt stellt keine rekursfähige Verfügung dar, sondern eine organisatorische Anordnung im Rahmen eines Sonderstatusverhältnisses. Es kann daher nicht Gegenstand eines Rekurses sein. Es handelt sich um einen sog. Realakt. Zur Beurteilung der Rechtmässigkeit und Angemessenheit eines solchen kann der Erlass einer rekursfähigen Verfügung verlangt werden. Im Sinne der Prozessökonomie ist davon auszugehen, dass im Rahmen des Schriftenwechsels des laufenden Verfahrens eine solche Verfügung erlassen wurde und als mit angefochten gilt, weshalb auf den Rekurs einzutreten und dieser materiell zu behandeln ist. Nothilfe ist nur auszurichten, wenn 1. eine entsprechende Notsituation vorhanden und 2. diese Notsituation von der bedürftigen Person ausreichend belegt wird. Es ist gerechtfertigt, für den Nachweis der Bedürftigkeit zu verlangen, dass die betroffene Person in der Notunterkunft übernachtet. Um dies zu überprüfen, sind Präsenzkontrollen abends und morgens angemessen. Da nach der allgemeinen Lebenserfahrung jene, die auswärts übernachten, von ihren Gastgebern nicht nur Obdach, sondern auch Nahrung erhalten, ist an Tagen mit Auswärtsübernachung der Nachweis der Bedürftigkeit nicht erbracht und es kann auf die Ausrichtung eines Barbetrags für Essen verzichtet werden.</p>',
          }],
        }],
      },
      smallcaptionData: {
        headingLevel: 3,
        text: 'Entscheidtext(e)',
      },
      downloadListData: {
        title: false,
        links: [{
          link: {
            linkListItemTitle: '173.4_10.3.85_91',
            linkListItemIsDownload: true,
            linkListItemLabel: 'PDF | 6 Seiten | 100KB',
            linkListItemHref: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          },
        }],
      },
      releatedContentData: _.merge({}, defReleatedContentData, {
        relatedContentHeading: {
          anchorNavReference: 'related_content',
        },
      }),
      contactData: _.merge({}, defContactData, {
        anchorNavReference: 'contact',
      }),
      tagGroupData: _.assign(_.merge({}, defTagGroupData, {
        tagGroupdHeading: {
          anchorNavReference: 'responsibilities',
        },
      }), {
        anchorLinks: [{
          anchorlink: {
            anchorlinkText: 'Staatskanzlei',
            anchorlinkAdress: '#',
            anchorlinkIsActive: false,
            anchorlinkIsTagAnchor: true,
            anchorlinkIsInverted: true,
            anchorlinkIsTopitem: true,
            anchorlinkIsTopitemSmall: true,
          },
        }],
      }),
      footerData: defFooterData,
      back2topData: _.merge({}, defBack2TopData, {
        preserveLangSwitch: false,
      }),
    },
  },
});

module.exports = data;
