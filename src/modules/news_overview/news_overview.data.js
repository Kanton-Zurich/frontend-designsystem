const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const {handlebars} = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const selectData = require('../select/select.data.js');
const demoTeaserData = require('../teaser/teaser.data').variants.inverted.props;

const templateConverter = require('../../../gulp/helpers/templateConverter');

const template = dataHelper.getFileContent('news_overview.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'News Übersicht',
    className: 'NewsOverview',
    jira: 'CZHDEV-511',
    documentation: dataHelper.getDocumentation('news_overview.md'),
  },
  props: {
    typeSelect: _.assign(_.merge({}, selectData.variants.defaultMultiPreSelect.props, {
      listData: {
        validation: {
          isRequired: false,
        },
      },
      triggerInputData: {
        label: 'News-Typ',
        validation: {
          isRequired: false,
        },
      },
    }), {
      listData: {
        groupPostfix: 'iconLeftMulti',
        iconLeft: 'check',
        isMultiSelect: true,
        hasFilterAndButton: true,
        hasOptionIcon: true,
        hasCheckIcon: true,
        selectOptions: [
          { value: 'mit', label: 'Mitteilung' },
          { value: 'serv', label: 'Services' },
          { value: 'stat', label: 'Statistik' },
          { value: 'vid', label: 'Video' },
          { value: 'wahl', label: 'Wahlen' },
        ],
      },
    }),
    topicSelect: _.assign(_.merge({}, selectData.variants.multiSelect.props, {
      triggerInputData: {
        validation: {
          isRequired: false,
        },
        label: 'Themen',
      },
    }), {
      listData: {
        groupPostfix: 'iconLeftMulti',
        iconLeft: 'check',
        isMultiSelect: true,
        hasFilterAndButton: true,
        hasOptionIcon: true,
        hasCheckIcon: true,
        selectOptions: [
          { value: 'mig', label: 'Migration & Integration' },
          { value: 'mo', label: 'Mobilität' },
          { value: 'sich', label: 'Sicherheit & Justiz' },
          { value: 'so', label: 'Soziales' },
          { value: 'st', label: 'Steuern' },
          { value: 'umte', label: 'Umwelt & Tier' },
          { value: 'ge', label: 'Gemeinschaften' },
          { value: 'scer', label: 'Schulen & Erziehung' },
        ],
      },
    }),
    organisationSelect: _.assign(_.merge({}, selectData.variants.multiSelect.props, {
      triggerInputData: {
        validation: {
          isRequired: false,
        },
        label: 'Organisationen',
      },
    }), {
      listData: {
        groupPostfix: 'iconLeftMulti',
        iconLeft: 'check',
        isMultiSelect: true,
        hasFilterAndButton: true,
        hasOptionIcon: true,
        hasCheckIcon: true,
        selectOptions: [
          { value: 'ainf', label: 'Amt für Informatik' },
          { value: 'ajug', label: 'Amt für Jugend & Beruf' },
          { value: 'ajus', label: 'Amt für Justizvollzug' },
          { value: 'amil', label: 'Amt für Militär und Zivilschutz' },
          { value: 'aumw', label: 'Amt für Umwelt' },
          { value: 'aver', label: 'Amt für Verkehr' },
        ],
      },
    }),
    dateInputData: {
      type: 'text',
      label: 'Zeitraum von/bis',
      isInput: true,
      isFloatingLabel: true,
      iconOnly: {
        icon: 'time',
      },
    },
    searchInputData: {
      type: 'text',
      label: 'Filter',
      isInput: true,
      isFloatingLabel: true,
      iconOnly: {
        icon: 'search',
      },
      additionalFunctionality: {
        icon: 'exit',
        buttontype: 'clear',
        ariaText: 'Lösche Eingabe',
      },
    },
    prominentTeaser: demoTeaserData,
    newsTeaserTemplate: templateConverter(dataHelper.getFileContent('../news_teaser/_news_teaser_item.hbs'), false),
    topNewsTeaserItems: [
      {
        href: '#',
        dateLabel: 'Medienmitteilung',
        date: '14.12.2018',
        dateMachineReadable: '2018-12-14',
        title: 'Winterthur: Unbekannter Mann raubt Tankstellen-Shop aus',
      },
      {
        href: '#',
        date: '14.12.2018',
        dateMachineReadable: '2018-12-14',
        title: 'Zürich-Flughafen: Drogenkurier verhaftet und Kokain sichergestellt',
      },
      {
        href: '#',
        dateLabel: 'Medienmitteilung',
        date: '14.12.2018',
        dateMachineReadable: '2018-12-14',
        title: 'Weiningen: Vermisstmeldung - Willi Müller',
      },

    ],
  },
});

const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
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
        html: dataHelper.getFormattedHtml(compiledVariant()),
        data: dataHelper.getFormattedJson(variantProps),
      },
    },
  });

  return variantData;
});

data.variants = variants;

module.exports = data;
