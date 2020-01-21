const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.default.props;
const headerData = require('../../modules/header/header.data').variants.userMenu.props;

const defPageHeaderData = require('../../modules/page_header/page_header.data.js');
const topicListData = require('../../modules/topiclist/topiclist.data').props;
const contactData = require('../../modules/contact/contact.data').variants.fullWidth.props;
const teaserData = require('../../modules/teaser/teaser.data').variants.inverted.props;
const defAboutData = require('../../modules/about/about.data').props;
const newsTeaserData = require('../../modules/news_teaser/news_teaser.data').variants.withProminentTeaser.props;

const pageHeaderWithoutBtn = _.omit(defPageHeaderData.variants.colored.props, ['buttonData', 'breadcrumb']);
defPageHeaderData.variants.colored.props = pageHeaderWithoutBtn;

const contextMenuProps = require('../../modules/context_menu/context_menu.data').props;
const contextMenuItemDef = require('../../atoms/context_menu_item/context_menu_item.data').variants.default.props;
const socialMediaStreamData = require('../../modules/social_media_stream/social_media_stream.data').props;
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;

const defAnchorNavData = {
  anchornavTitle: {
    level: 2,
    title: 'Inhaltsverzeichnis',
  },
  anchornavItems: [
    {
      anchorlink: {
        anchorlinkText: 'Themen',
        anchorlinkAdress: 'ourtopics',
        anchorlinkIsActive: true,
        anchorlinkAsButton: true,
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Unser Amt',
        anchorlinkAdress: 'aboutus',
        anchorlinkIsActive: false,
        anchorlinkAsButton: true,
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'News',
        anchorlinkAdress: 'news_teaser',
        anchorlinkIsActive: false,
        anchorlinkAsButton: true,
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Kontakt',
        anchorlinkAdress: 'contact',
        anchorlinkIsActive: false,
        anchorlinkAsButton: true,
      },
    },
  ],
};

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Amtsseite',
    jira: 'CZHDEV-342',
    content: dataHelper.getFileContent('department.hbs'),
    documentation: dataHelper.getDocumentation('department.md'),
  },
  props: {
    skiplinks: skiplinksData,
    header: headerData,
    title: 'Amtsseite',
    text: '',
    modules: {
      pageHeader: _.merge({}, defPageHeaderData, {
        variants: {
          colored: {
            props: {
              pageTitle: 'Strassenverkehrsamt',
              leadTitle: 'Interessierte können ab sofort die Genauigkeit ihrer Smartphones und Navigationsgeräte überprüfen. Die Baudirektion hat beim Landesmuseum in Zürich einen Kontrollpunkt beim Landesmuseum in Zürich einen Kontrollpunkt für mobile Geräte eingerichtet – den ersten in der Schweiz.',
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
                    title: 'Sicherheitsdirektion',
                    href: '#',
                  },
                  {
                    title: 'Strassenverkehrsamt',
                    href: '#',
                  },
                ],
              },
            },
          },
        },
      }),
      anchorNav: defAnchorNavData,
      newsTeaser: newsTeaserData,
      topiclist: _.merge({}, topicListData, { topiclistHeading: { anchorNavReference: 'ourtopics' } }),
      contact: _.merge({}, contactData, { anchorNavReference: 'contact' }),
      teaser: _.merge({}, teaserData, { anchorNavReference: 'department_teaser' }),
      about: _.merge({}, defAboutData, { anchorNavReference: 'aboutus' }),
      socialMediaStream: socialMediaStreamData,
      footer: defFooterData,
    },
  },
});

module.exports = data;
