const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.noToc.props;
const headerData = require('../../modules/header/header.data').variants.userMenu.props;

const defPageHeaderData = require('../../modules/page_header/page_header.data.js').variants.colored.props;
const contextMenuProps = require('../../modules/context_menu/context_menu.data').props;
const contextMenuItemDef = require('../../atoms/context_menu_item/context_menu_item.data').variants.default.props;

const defFlexData = require('../../modules/flex_data/flex_data.data').variants.socialCareHandbook.props;
const defContactData = require('../../modules/contact/contact.data.js').variants.fullWidthLessData.props;
const defReleatedContentData = require('../../modules/related_content/related_content.data.js').variants.default.props;
const defTagGroupData = require('../../modules/tag_group/tag_group.data.js').variants.default.props;

const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const defBack2TopData = require('../../modules/back2top/back2top.data').variants.default.props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Inhaltsverzeichnis',
    jira: 'CZHDEV-3178',
    content: dataHelper.getFileContent('toc_list.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    skiplinks: skiplinksData,
    header: headerData,
    defaultColorVariation: 'cv-magenta',
    modules: {
      pageHeaderData: _.merge({}, defPageHeaderData, {
        pageTitle: 'Inhaltsverzeichnis',
        inverted: true,
        buttonData: false,
        breadcrumb: {
          contextMenu: _.merge({}, contextMenuProps, {
            lists: [
              {
                items: [
                  _.merge({}, contextMenuItemDef, { text: 'Sicherheitsdirektion', iconAfter: false, iconBefore: false }),
                ],
              },
            ],
          }),
          path: [
            {
              title: 'Kanton Zürich',
              href: '#',
            },
            {
              title: 'Steuern',
              href: '#',
            },
            {
              title: 'Sozialhilfe-Handbuch',
              href: '#',
            },
          ],
        },
        leadText: 'Das Sozialhilfe-Behördenhandbuch enthält Beiträge zum Sozialhilferecht des Kantons Zürich und zum Zuständigkeitsgesetz des Bundes. Daneben gibt es einen Überblick über die Einrichtungen der primären sozialen Sicherheit und zu weiteren sozialrechtlichen Fragen.',
      }),
      flexData: defFlexData,
      contactData: _.merge({}, defContactData, { anchorNavReference: 'contact' }),
      releatedContentData: _.merge({}, defReleatedContentData, { relatedContentHeading: { anchorNavReference: 'related_content' } }),
      tagGroupData: _.assign(_.merge({}, defTagGroupData, { tagGroupdHeading: { anchorNavReference: 'responsibilities' } }),
        {
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
      back2topData: _.merge({}, defBack2TopData, { preserveLangSwitch: true }),
    },
  },
});

module.exports = data;
