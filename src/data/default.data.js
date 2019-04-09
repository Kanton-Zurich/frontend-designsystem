const parseArgs = require('minimist');
const git = require('git-rev-sync');

const env = parseArgs(process.argv.slice(2));
const data = {
  meta: {
    project: 'CZHDEV - Living Styleguide',
    gitRemoteLink: git.remoteUrl().slice(0, -4).replace(/(?<=https:\/\/)(.*)(?=bitbucket\.org)/g, '') //eslint-disable-line
      + '/src/' + git.long(),
    gitBranch: git.branch(),
    gitShort: git.short(),
    gitDate: git.date(),
    buildDate: Date(Date.now()).toString(),
  },
  env,
  props: {
    svgSprites: JSON.stringify([
      '/assets/media/svgsprite/base.svg',
      '/assets/media/svgsprite/demo.svg',
    ]),
  },
};

module.exports = data;
