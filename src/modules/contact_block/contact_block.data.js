const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('contact_block.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Kontaktblock',
    className: 'ContactBlock',
    jira: 'CZHDEV-4463',
    label: 'Komplex',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    title: 'Leitung',
    representativeTitle: 'Vertretung des Regierungsrats',
    headingLevel: 2,
    visualHeadingLevel: 2,
  },
});
const sectionItems = [
  {
    icon: 'phone',
    href: 'tel:+41447523770',
    text: '+41 44 752 37 70',
  },
  {
    icon: 'email',
    href: 'mailto:info@example.ch',
    text: 'info@example.ch',
  },
  {
    icon: 'link',
    href: 'https://www.example.ch',
    text: 'www.example.ch',
  },
];

const variants = _.mapValues(
  {
    organisation: {
      meta: {
        title: 'Kontakt Organisation',
        desc: 'Kontakt Details einer Organisation',
      },
      props: {
        variant: 'organisation',
        title: 'Kontakt',
        headingLevel: 2,
        visualHeadingLevel: 3,
        spa: false,
        sections: [
          {
            headingHidden: true,
            items: sectionItems,
          },
        ],
      },
    },
    leaders: {
      meta: {
        title: 'Kontakte Leaders',
        desc: 'Leader Kontakt Details einer Organisation',
      },
      props: {
        variant: 'leaders',
        headingLevel: 2,
        visualHeadingLevel: 3,
        spa: false,
        sections: [
          {
            headingHidden: false,
            firstName: 'Wilhelm',
            lastName: 'Natrup',
            jobTitle: 'Co-Leitung',
            items: sectionItems,
          },
          {
            headingHidden: false,
            firstName: 'Cornelia',
            lastName: 'Conzett',
            jobTitle: 'Co-Leitung',
            items: sectionItems,
          },
        ],
      },
    },
    organisationSpa: {
      meta: {
        title: 'Kontakt Organisation SPA',
        desc: 'Kontakt Details einer Organisation. Für SPA',
      },
      props: {
        variant: 'organisation',
        title: 'Kontakt',
        headingLevel: 2,
        visualHeadingLevel: 3,
        spa: true,
        sections: [
          {
            headingHidden: true,
            items: sectionItems,
          },
        ],
      },
    },
    leadersSpa: {
      meta: {
        title: 'Kontakte Leaders SPA',
        desc: 'Leader Kontakt Details einer Organisation. Für SPA',
      },
      props: {
        variant: 'leaders',
        headingLevel: 2,
        visualHeadingLevel: 3,
        spa: true,
        sections: [
          {
            headingHidden: false,
            items: sectionItems,
          },
          {
            headingHidden: false,
            items: sectionItems,
          },
        ],
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
          html: dataHelper.getFormattedHtml(compiledVariant()),
          data: dataHelper.getFormattedJson(variantProps),
        },
      },
    });

    return variantData;
  }
);

data.variants = variants;

module.exports = data;
