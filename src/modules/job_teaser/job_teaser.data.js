const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const imageFigureDemoData = require('../image_figure/image_figure.data');

const template = dataHelper.getFileContent('job_teaser.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Job Teaser',
    className: 'JobTeaser',
    jira: 'CZHDEV-2967',
    documentation: dataHelper.getDocumentation('README.md'),
    label: 'Teaser',
  },
  props: _.merge(
    {
      teaserTitle: 'Offene Stellen',
      teaserText: 'Beim Kanton Zürich sind über 35\'000 Personen angestellt. Sie arbeiten in den unterschiedlichsten Berufen und gestalten den Kanton zum Wohle von Bevölkerung, Unternehmen, Natur sowie Infrastruktur. Werden Sie ein Teil von uns!',
      linkMoreInfo: '#',
      linkAllJobs: '#',
      apiUrl: 'https://live.solique.ch/KTZH/de/api/v1/data/',
      baseUrl: 'https://live.solique.ch/KTZH/de/',
      filters: 'office.id=KTZH_Office;organization.id=ORG60',
      template: `<li class="mdl-news-teaser__item">
          <a href="<%=link%>" target="_blank">
            <h3 class="atm-heading"><%=title.value%>
             <% if (from.value === to.value) { %>
             (<%=from.value%>%)
             <% } %>
             <% if (from.value !== to.value) { %>
                <% if (from.value === "") { %>
                (<%=to.value%>%)
                <% } %>
                <% if (to.value === "") { %>
                (<%=from.value%>%)
                <% } %>
                <% if (from.value !== "" && to.value !== "") { %>
                (<%=from.value%>% - <%=to.value%>%)
                <% } %>
             <% } %>
            </h3>
            <div class="mdl-job-teaser__job-details">
              <span><%=organization.value%></span>
              <span><%=office.value%></span>
              <span><%=location.value%></span>
              <span><%=dateModified%></span>
            </div>
            <div class="atm-button atm-button--icon-only atm-button--secondary">
              <svg class="icon atm-button__icon" focusable="false">
                <use xlink:href="#arrow-right"></use>
              </svg>
            </div>
          </a>
        </li>`,
    },
    imageFigureDemoData.props, {
      noTitle: true,
      hasImage: true,
      alt: '',
    },
    {
      srcsets: [{
        image: '/assets/media/image/teaserimage_4_3_584_15.jpeg',
        imageWidth: 1024,
      }, {
        image: '/assets/media/image/teaserimage_16_9_905_15.jpeg',
        imageWidth: 600,
      }, {
        image: '/assets/media/image/teaserimage_16_9_530_15.jpeg',
        imageWidth: 320,
      }],
    }),
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
