const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const headerData = require('../../modules/header/header.data').variants.inverted.props;
const defPageHeaderData = require('../../modules/page_header/page_header.data.js');
const contextMenuProps = require('../../modules/context_menu/context_menu.data').props;
const contextMenuItemDef = require('../../atoms/context_menu_item/context_menu_item.data').variants.default.props;
const defCookieControls = require('../../modules/cookie_controls/cookie_controls.data.js');

const pageHeaderWithoutBreadcrumbs = _.omit(defPageHeaderData.variants.default.props, ['breadcrumb']);
defPageHeaderData.variants.default.props = pageHeaderWithoutBreadcrumbs;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Datenschutzerklärung',
    jira: 'CZHDEV-466',
    content: dataHelper.getFileContent('privacy_notice.hbs'),
    documentation: dataHelper.getDocumentation('privacy_notice.md'),
  },
  props: {
    header: headerData,
    modules: {
      pageHeaderData: _.merge({}, defPageHeaderData, {
        variants: {
          default: {
            props: {
              pageTitle: 'Datenschutzerklärung',
              buttonData: false,
              inverted: false,
              noText: true,
              breadcrumb: {
                contextMenu: _.merge({}, contextMenuProps, {
                  lists: [
                    {
                      items: [
                        _.merge({}, contextMenuItemDef, { text: 'Kanton Zürich', iconAfter: false, iconBefore: false }),
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
                    title: 'Datenschutzerklärung',
                    href: '#',
                  },
                ],
              },
            },
          },
        },
      }),
      cookieControlsData: defCookieControls,
      tagGroupData: {
        tagGroupdHeading: {
          title: 'Für dieses Thema zuständig:',
        },
        anchorLinks: [
          {
            anchorlink: {
              anchorlinkText: 'Staatskanzlei',
              anchorlinkAdress: '#',
              anchorlinkIsActive: false,
              anchorlinkIsTagAnchor: true,
              anchorlinkIsInverted: true,
              anchorlinkIsTopitem: true,
              anchorlinkIsTopitemSmall: true,
            },
          },
        ],
      },
      footerData: '',
    },
  },
});

module.exports = data;
