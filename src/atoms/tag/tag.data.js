const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('tag.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Tag',
    className: 'Tag',
    jira: 'CZHDEV-*',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {},
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Standard ohne Icon',
        desc: '',
      },
      props: {
        text: 'Abgeschlossen',
      },
    },
    defaultNegative: {
      meta: {
        title: 'Standard ohne Icon negativ',
        desc: '',
      },
      props: {
        text: 'Abgeschlossen',
        isNegative: true,
      },
    },
    notification: {
      meta: {
        title: 'Notifikation',
        desc: '',
      },
      props: {
        text: 'Abgeschlossen',
        icon: 'confirm',
        modifier: 'notification',
      },
    },
    notificationNegative: {
      meta: {
        title: 'Notifikation negativ',
        desc: '',
      },
      props: {
        text: 'Abgeschlossen',
        icon: 'confirm',
        modifier: 'notification',
        isNegative: true,
      },
    },
    warning: {
      meta: {
        title: 'Warnung',
        desc: '',
      },
      props: {
        text: 'Abgelaufen',
        icon: 'caution',
        modifier: 'warning',
      },
    },
    warningNegative: {
      meta: {
        title: 'Warnung negativ',
        desc: '',
      },
      props: {
        text: 'Abgelaufen',
        icon: 'caution',
        modifier: 'warning',
        isNegative: true,
      },
    },
    completed: {
      meta: {
        title: 'Abgeschlossen',
        desc: '',
      },
      props: {
        text: 'Abgeschlossen',
        icon: 'confirm',
        modifier: 'completed',
      },
    },
    delayed: {
      meta: {
        title: 'Verzögert',
        desc: '',
      },
      props: {
        text: 'Verzögert',
        icon: 'alert',
        modifier: 'delayed',
      },
    },
    onSchedule: {
      meta: {
        title: 'Planmässig',
        desc: '',
      },
      props: {
        text: 'Planmässig',
        icon: 'locate',
        modifier: 'on-schedule',
      },
    },
    abandoned: {
      meta: {
        title: 'Verzicht',
        desc: '',
      },
      props: {
        text: 'Verzicht',
        icon: 'block',
        modifier: 'abandoned',
      },
    },
    paused: {
      meta: {
        title: 'Sistiert',
        desc: '',
      },
      props: {
        text: 'Sistiert',
        icon: 'pause',
        modifier: 'paused',
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
          data: dataHelper.getFormattedJson(variantProps),
          html: dataHelper.getFormattedHtml(compiledVariant()),
        },
      },
    });

    return variantData;
  }
);

data.variants = variants;

module.exports = data;
