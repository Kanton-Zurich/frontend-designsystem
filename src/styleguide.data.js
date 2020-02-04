const _ = require('lodash');
const path = require('path');
const glob = require('glob');
const dataHelper = require('@unic/estatico-data');
const defaultData = require('./data/default.data.js');
const defTopiclistData = require('./modules/topiclist/topiclist.data').variants.home.props;

const colorPalette = [
  '#71b359',
  '#d99100',
  '#a700b3',
  '#ffbfc8',
  '#3000b3',
  '#00b38f',
  '#bfffd0',
  '#b20000',
  '#80d5ff',
  '#d96ca6',
  '#7340ff',
  '#ff7340',
  '#6c98d9',
  '#ff0066',
  '#d9c36c',
  '#ff00FF',
  '#d9a66c',
  '#00ffaa',
  '#d96c6c',
  '#88ff00',
  '#00cad9',
  '#ffee00',
];

const luminance = (hex) => {
  const r = parseInt(hex.substr(1, 2), 16);
  const g = parseInt(hex.substr(3, 2), 16);
  const b = parseInt(hex.substr(5, 2), 16);
  return Math.sqrt((0.299 * r) ** 2 + (0.587 * g) ** 2 + (0.114 * b) ** 2 );
};

const transform = (originalData, filePath) => {
  const previewUrl = path.relative('./src/', filePath).replace('.data.js', '.html');

  const data = _.merge({}, originalData, {
    meta: {
      previewUrl,
    },
  });

  return data;
};

const getDataArray = (fileGlob, dataTransform) => {
  const data = [];
  const paths = glob.sync(fileGlob);

  _.each(paths, (filePath) => {
    const requirePath = path.resolve(filePath);
    const fileName = path.basename(filePath).replace('.data.js', '');
    let fileData = require(requirePath); // eslint-disable-line

    // Optional data transformation
    if (dataTransform) {
      fileData = dataTransform(fileData, filePath);
    }

    data.push(fileData);
  });

  return data;
};

// Get Atoms
const atomsGlob = dataHelper.getDataGlob('./src/atoms/**/*.data.js', transform);
const atomList = _.merge({}, defTopiclistData, {
  topiclistInput: null,
});

atomList.topiclistcontentNavData.items = Object.keys(atomsGlob).map((item) => {
  return {
    shortTitle: atomsGlob[item].meta.title,
    buzzwords: `<span class="sg_jira-link" href="https://we.one-inside.com/jira/browse/${atomsGlob[item].meta.jira}">${atomsGlob[item].meta.jira}</span> `,
    target: atomsGlob[item].meta.previewUrl,
    isPromotopic: false,
    isTagged: true,
  };
}).filter(item => item && item.shortTitle && item.shortTitle.length > 0);

// Get Modules
const moduleArray = [];
const moduleLabels = [];
const moduleGroups = _.groupBy(_.filter(getDataArray('./src/modules/**/*.data.js', transform),item => item.meta.title), item => item.meta.label);
Object.keys(moduleGroups).forEach((label, index) => {
  moduleGroups[label] = _.sortBy(moduleGroups[label], item => item.meta.title);
  const background = colorPalette[index];
  const foreground = luminance(colorPalette[index]) > 120.0 ? '#000000' : '#FFFFFF'; // eslint-disable-line
  moduleLabels.push({ label, foreground, background });
  moduleGroups[label].forEach((module) => {
    module.meta.labelBackground = background;
    module.meta.labelColor = foreground;
    moduleArray.push(module);
  });
});

const moduleList = _.merge({}, defTopiclistData, {
  topiclistInput: null,
});

moduleList.topiclistcontentNavData.items = moduleArray.map((item) => {
  return {
    shortTitle: item.meta.title,
    alt: true,
    buzzwords: `<span class="sg_jira-link" href="https://we.one-inside.com/jira/browse/${item.meta.jira}">${item.meta.jira}</span> `
      + `<span class="sg_group-label" style="border-color:  ${item.meta.labelBackground}; background-color:  ${item.meta.labelBackground}; color: ${item.meta.labelColor}">${item.meta.label}</span>`,
    target: item.meta.previewUrl,
    isPromotopic: false,
    isTagged: true,
    additionalAttributes: `data-label-index="${item.meta.label}"`,
    label: item.meta.label,
  };
});

// Get Pages
const pagesGlob = dataHelper.getDataGlob('./src/pages/**/*.data.js', transform);
const pageList = _.merge({}, defTopiclistData, {
  topiclistInput: null,
});

pageList.topiclistcontentNavData.items = Object.keys(pagesGlob).map((item) => {
  return {
    shortTitle: pagesGlob[item].meta.title,
    buzzwords: `<span class="sg_jira-link" href="https://we.one-inside.com/jira/browse/${pagesGlob[item].meta.jira}">${pagesGlob[item].meta.jira}</span> `,
    target: pagesGlob[item].meta.previewUrl,
    isTagged: true,
    isPromotopic: false,
  };
}).filter(item => item && item.shortTitle && item.shortTitle.length > 0);

// Get other pages
const styleguide = _.merge({}, defTopiclistData, {
  topiclistInput: null,
});

styleguide.topiclistcontentNavData.items = _.sortBy(dataHelper.getDataGlob('./src/preview/styleguide/*.data.js', transform), item => item.meta.title).map((item) => {
  return {
    shortTitle: item.meta.title,
    buzzwords: ' ',
    target: item.meta.previewUrl,
    isPromotopic: false,
  };
});

styleguide.topiclistcontentNavData.items.push({
  shortTitle: 'Offline Seite Download (zip)',
  buzzwords: '',
  target: 'offline.zip',
  isPromotopic: false,
});

const data = _.merge({}, defaultData, {
  atomList,
  moduleList,
  moduleLabels,
  pageList,
  styleguide,
  wrappingElements: {
    pageHeaderData: {
      breadcrumb: {
        path: [
          {
            title: 'Kanton Zürich',
            href: 'index.html',
          },
          {
            title: 'Living Styleguide',
          },
        ],
      },
    },
  },
});


data.pages = _.sortBy(data.pages, item => item.meta.title);

const modules = _
  .groupBy(_.filter(data.modules, item => item.meta.title), item => item.meta.label);

data.modules = [];
const labelGroups = Object.keys(modules);
labelGroups.forEach((label, index) => {
  modules[label] = _.sortBy(modules[label], item => item.meta.title);
  modules[label].forEach((module) => {
    module.meta.labelBackground = colorPalette[index];
    module.meta.labelColor = luminance(colorPalette[index]) > 120.0 ? '#000000' : '#FFFFFF';
  });
  data.modules.push(modules[label]);
});


module.exports = data;
