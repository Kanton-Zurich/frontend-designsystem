const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('live_stream.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Live Stream Video',
    className: 'LiveStream',
    jira: 'CZHDEV-176',
    label: 'Eingebettet',
    documentation: dataHelper.getDocumentation('live_stream.md'),
  },
  props: {
    liveStreamHeading: {
      level: 2,
      title: 'Live Stream Video',
    },
    videoUrl: 'https://www.blitzvideoserver.de/player.html?serverip=62.113.210.2&serverapp=vod&smil=video-stream-hosting-testvideo.smil&stream360p=video-stream-hosting-testvideo_360p.mp4&stream480p=video-stream-hosting-testvideo_480p.mp4&stream720p=video-stream-hosting-testvideo_720p.mp4&stream1080p=video-stream-hosting-testvideo_1080p.mp4&bgimage=https://www.blitzvideoserver.de/video-stream-hosting-testvideo.jpg&livestreamnichtaktiv=funktioniert%20nicht&livestreamnichtaktivuntertitel=Abruf%20nicht%20m%C3%B6glich%0A&dateistreamnichtaktiv=gehtnicht&dateistreamnichtaktivuntertitel=datei%20nicht%20vorhanden',
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
