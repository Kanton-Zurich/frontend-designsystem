const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.noToc.props;
const headerData = require('../../modules/header/header.data').props;

const defReleatedContentData = require('../../modules/related_content/related_content.data.js').variants.default.props;
const defContactData = require('../../modules/contact/contact.data.js').variants.fullWidthLessData.props;
const defTagGroupData = require('../../modules/tag_group/tag_group.data.js').variants.default.props;
const defNewsTeaserData = require('../../modules/news_teaser/news_teaser.data').variants.withoutLinklist.props;
const defBreadcrumbData = require('../../modules/breadcrumb/breadcrumb.data').variants.default.props;
const defFlexDataData = require('../../modules/flex_data/flex_data.data').variants.rrb.props;
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const defBack2TopData = require('../../modules/back2top/back2top.data').variants.default.props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Regierungsratssbeschlüsse',
    jira: 'CZHDEV-1236',
    content: dataHelper.getFileContent('rrb_data.hbs'),
    documentation: dataHelper.getDocumentation('rrb_data.md'),
  },
  props: {
    defaultColorVariation: 'cv-bordeaux',
    skiplinks: skiplinksData,
    header: headerData,
    modules: {
      pageHeaderData: {
        pageTitle: 'Beschlüsse des Regierungsrats',
        inverted: true,
        breadcrumb: defBreadcrumbData,
        leadText: 'Alle öffentlichen, publizierten Beschlüsse (ab 1. Oktober 2008) können hier nach verschiedenen Kriterien (RRB-Nummer, antragstellende Direktion) oder über die Volltextsuche aufgerufen werden.',
      },
      flexDataData: defFlexDataData,
      newsTeaserData: defNewsTeaserData,
      releatedContentData: _.merge({}, defReleatedContentData, { relatedContentHeading: { anchorNavReference: 'related_content' } }),
      contactData: _.merge({}, defContactData),
      tagGroupData: _.assign(_.merge({}, defTagGroupData, { tagGroupdHeading: { anchorNavReference: 'responsibilities' } }), {
        anchorLinks: [{
          anchorlink: {
            anchorlinkText: 'Regierungsrat',
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
      back2topData: _.merge({}, defBack2TopData, { preserveLangSwitch: false }),
    },
  },
});

module.exports = data;
