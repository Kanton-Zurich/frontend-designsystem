const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const dataQuote = require('../quote/quote.data');

const template = dataHelper.getFileContent('richtext.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Text',
    className: 'Richtext',
    jira: 'CZHDEV-111',
    label: 'Inhalt',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: _.merge({
    h1Text: 'H1: Pagetitle Black Strassenverkehrsamt',
    h2Text: 'H2: Content title Black',
    h3Text: 'H3: Black title Kontrollpunkt für mobile Geräte eingerichtet – den ersten in der Schweiz.',
    h4Text: 'H4: Black title',
    pText: 'P, Regular Interessierte können ab sofort die Genauigkeit ihrer Smartphones und Navigationsgeräte überprüfen. Die'
      + ' Baudirektion hat beim <a href="#" class="atm-text_link">Landesmuseum</a> in Zürich einen Kontrollpunkt beim Landesmuseum in Zürich einen Kontrollpunktfür'
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
  }, dataQuote.props),
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Primary',
      desc: '',
    },
    props: {},
  },
  smallHeadings: {
    meta: {
      title: 'Kleine Titel',
      desc: '',
    },
    props: {
      smallerHeadings: true,
    },
  },
  blue: {
    meta: {
      title: 'mit Image Zitat',
      desc: '',
    },
    props: {
      hasImage: true,
    },
  },
  embedded: {
    meta: {
      title: 'Eingebunden Variante',
      desc: '',
    },
    props: {
      embedded: true,
      contentItems: [
        {
          h4Text: 'H4: Black title',
        },
        {
          pText: 'P, Regular Interessierte können ab sofort die Genauigkeit ihrer Smartphones und Navigationsgeräte überprüfen. Die'
            + ' Baudirektion hat beim <a href="#" class="atm-text_link">Landesmuseum</a> in Zürich einen Kontrollpunkt beim Landesmuseum in Zürich einen Kontrollpunktfür'
            + ' mobile Geräte eingerichtet – den ersten in der Schweiz.P, Helvetic Roman Interessierte können ab sofort die'
            + ' Genauigkeit ihrer Smartphones und Navigationsgeräte überprüfen.'
            + ' Die Baudirektion hat beim Landesmuseum in Zürich einen Kontrollpunkt beim Landesmuseum in Zürich einen'
            + ' Kontrollpunktfür mobile Geräte eingerichtet – den ersten in der Schweiz.',
        },
        {
          quoteDemo: true,
        },
        {
          benefitDemo: true,
        },
      ],
    },
  },
  numberHeadings: {
    meta: {
      title: 'Nummerierte Überschriften (CZHDEV-3010)',
      desc: '',
    },
    props: {
      smallerHeadings: true,
      customContent: [
        {
          content: '<h2 class="atm-heading atm-heading--number-prefix"><span class="atm-heading__prefix">1.</span>Erläuterungen</h2>',
        },
        {
          content: '<h3 class="atm-heading atm-heading--number-prefix"><span class="atm-heading__prefix">1.1</span><span class="atm-heading__content">Anrechenbare Vermögenswerte</span></h3>',
        },
        {
          content: '<h4 class="atm-heading atm-heading--number-prefix"><span class="atm-heading__prefix">1.1.1</span><span class="atm-heading__content">Bundesebene</span></h4>',
        },
        {
          content: '<p class="atm-paragraph">'
            + 'Nach § 16 Abs. 2 SHV gehören neben den Einkünften auch das Vermögen des Klienten bzw. der Klientin sowie jenes der mit der antragstellenden Person zusammenlebenden Ehegatten bzw. eingetragenen Partner zu den in die Bedarfsrechnung einzubeziehenden eigenen Mitteln (vgl. auch § 14 SHG).\n'
            + 'Vor der Ausrichtung von wirtschaftlicher Hilfe ist (unter Vorbehalt von Notfällen) abzuklären, ob und allenfalls welche Vermögenswerte vorhanden sind (vgl. dazu auch SKOS-Richtlinien, Kapitel D.3.1 sowie Erläuterungen a)) . Darüber hat die um Hilfe ersuchende Person vollständig und wahrheitsgetreu sowie durch Vorlage von entsprechenden Unterlagen Auskunft zu geben (vgl. Kapitel 6.2 und Kapitel 5.1.08.).\n'
            + 'Als anrechenbare Vermögenswerte kommen insbesondere in Betracht:\n'
            + '</p>',
        },
        {
          content: '<h4 class="atm-heading atm-heading--number-prefix"><span class="atm-heading__prefix">1.2</span><span class="atm-heading__content">Kantonale Verordnungen</span></h4>',
        },
        {
          content: '<ul>'
            + '<li>Privatfahrzeuge (vgl. dazu auch nachfolgend Ziff. 6),\n</li>'
            + '<li>Grundeigentum (vgl. dazu Kapitel 9.3.01),\n</li>'
            + '<li>Informiert werden, sobald eine Sendung unterwegs ist. Informiert werden, sobald eine Sendung unterwegs ist</li>'
            + '<li>Insofern handelt es sich dabei um bedingt rückzahlbare Sozialhilfeleistungen.\n</li>'
            + '</ul>',
        },
        {
          content: '<h3 class="atm-heading atm-heading--number-prefix"><span class="atm-heading__prefix">2.</span><span class="atm-heading__content">Persönliche Effekten und Hausrat</span></h3>',
        },
        {
          content: '<p class="atm-paragraph">'
            + 'Von der Verwendung des Vermögens kann insofern abgesehen werden, als für den Klienten bzw.'
            + 'die Klientin und seine bzw. ihre Angehörigen eine ungebührliche Härte entstünde (§ 16 Abs. 3 SHV).'
            + 'Ebenso kann von einer Verwertung ausnahmsweise abgesehen werden, wenn die Verwertung unwirtschaftlich'
            + ' wäre oder die Veräusserung von Wertgegenständen aus anderen Gründen unzumutbar ist.'
            + 'Ist dem oder der Hilfesuchenden die Realisierung von erheblichen, den Freibetrag übersteigenden '
            + 'Vermögenswerten nicht möglich oder nicht zumutbar, so können diese für die Bemessung der Sozialhilfe '
            + 'unberücksichtigt bleiben. Allerdings setzt dies in der Regel voraus, dass der oder die Hilfesuchende '
            + 'sich schriftlich verpflichtet, die Sozialhilfeleistungen bei Realisierbarkeit der Vermögenswerte ganz '
            + 'oder teilweise zurückzuerstatten (§ 20 Abs. 1 SHG; vgl. dazu Kapitel 9.2.02 und Kapitel 15.2.04). Zudem '
            + 'ist eine pfandrechtliche Sicherstellung zu ermöglichen (§ 20 Abs. 2 SHG; vgl. Kapitel 9.2.02). Insofern '
            + 'handelt es sich dabei um bedingt rückzahlbare Sozialhilfeleistungen. Nicht als anrechenbares Vermögen zu '
            + 'behandeln ist das Guthaben, welches eine Person dank einer ausserordentlich bescheidenen Lebensführung aus den ausgerichteten Sozialhilfeleistungen angespart hat. Ein solches Guthaben ist nach der Rechtsprechung des Verwaltungsgerichts des Kantons Zürich als eine Art Rücklage aus dem geleisteten Grundbedarf für den Lebensunterhalt zu betrachten. Es ist nicht zulässig, die wirtschaftliche Hilfe einzustellen, wenn das Guthaben den im konkreten Fall anwendbaren Freibetrag (vgl. nachfolgend Ziff. 6) übersteigt (VB.2009.00178, E. 5).'
            + '</p>',
        },
        {
          content: '<h3 class="atm-heading atm-heading--number-prefix"><span class="atm-heading__prefix">3.</span><span class="atm-heading__content">Leistungen aus Genugtuung und Integritätsentschädigungen</span></h3>',
        },
        {
          content: '<p class="atm-paragraph">'
            + 'Persönliche Effekten und Hausrat gehören zum unantastbaren bzw. nicht anrechenbaren Besitz, soweit sie '
            + 'unentbehrlich sind. Dies entspricht den unpfändbaren Vermögenswerten nach Art. 92 SchKG '
            + '(SKOS-Richtlinien, Kapitel D.3.1 Erläuterungen a)).'
            + '</p>',
        },
      ],
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
