const parseArgs = require('minimist');
const _ = require('lodash');
const git = require('git-rev-sync');
const dataHelper = require('@unic/estatico-data');

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

function getColorMap() {
  const colors = dataHelper.getColors('../assets/css/data/colors.json');
  return colors.map((x) => {
    const rgb = hexToRgb(x.color);
    const meanValue = (rgb.r + rgb.g + rgb.b) / 3.0; //eslint-disable-line
    return {
      name: x.name,
      color: x.color,
      blackSmall: meanValue > 120,//eslint-disable-line
      whiteSmall: meanValue < 120,//eslint-disable-line
      blackLarge: meanValue > 60,//eslint-disable-line
      whiteLarge: meanValue < 140, //eslint-disable-line
    };
  });
}
const dateNow = new Date(Date.now());

const strPad = (num) => {
  const s = `0${num}`;
  return s.substr(s.length - 2);
};

const env = parseArgs(process.argv.slice(2));
const data = {
  meta: {
    project: 'CZHDEV - Living Styleguide',
    gitRemoteLink: git.remoteUrl().slice(0, -4).replace(/(?<=https:\/\/)(.*)(?=bitbucket\.org)/g, '') //eslint-disable-line
      + '/src/' + git.long(),
    gitBranch: git.branch(),
    gitShort: git.short(),
    gitDate: `${strPad(git.date().getDate())}.${strPad(git.date().getMonth())}.${git.date().getFullYear()}`,
    buildDate: `${strPad(dateNow.getDate())}.${strPad(dateNow.getMonth())}.${dateNow.getFullYear()} ${strPad(dateNow.getHours())}:${strPad(dateNow.getMinutes())}`,
  },
  colors: getColorMap(),
  colorVariations: _.map(dataHelper.getColors('../assets/css/data/colorVariations.json'), (color) => {
    // Remove non-aphanumeric characters
    color.name = color.name.replace('cv', 'cv-'); // eslint-disable-line no-param-reassign
    return color;
  }),
  env,
  wrappingElements: {
    pageHeaderData: {
      title: 'Seitenkopf',
      homelink: '',
      pageTitle: 'Living Styleguide',
      breadcrumb: {
        contextMenu: false,
        path: [
          {
            title: 'Kanton Zürich',
            href: '',
          },
        ],
      },
    },
    contact: {
      fullWidth: true,
      contactTitle: 'Kontakt',
      contactSubtitle: 'Staatskanzlei',
      contactAddress: {
        street: 'Neumühlequai 10',
        zip: '8090',
        city: 'Zürich',
        routeLinkHref: 'https://goo.gl/maps/aNPYTs5yN8ggd9vk9',
        routeLinkLabel: 'Route anzeigen',
        openingTimes: {
          timeTitle: 'Bürozeiten',
          times: [
            { text: 'Mo-Fr: 8.00 - 11:30 &' },
            { text: '13:30 - 17:00' },
          ],
        },
      },
      contactPhone: [{
        anchorLabel: '043 259 11 11',
        phoneNumer: '+41432591111',
      }],
      contactSubtitleMoreInfo: {
        href: 'https://www.zh.ch/',
        label: 'Mehr erfahren',
      },
      contactMail: {
        address: 'info@sk.zh.ch',
      },
    },
    footer: {
      maintenance: true,
    },
  },
  props: {
    svgSprites: JSON.stringify([
      '/assets/media/svgsprite/base.svg',
    ]),
    defaultColorVariation: 'cv-blue',
  },
};

module.exports = data;
