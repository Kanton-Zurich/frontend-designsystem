const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const dialog = require('../dialog/dialog.data.js').variants.default.props;
const contextMenuItemDef = require('../../atoms/context_menu_item/context_menu_item.data').variants
  .default.props;

const pagination = require('../pagination/pagination.data.js').variants.default.props;
const autosuggestTemplate = require('../../atoms/content_teaser/content_teaser.data').variants
  .default.meta.code.template;
const defNotificationData = require('../notification/notification.data').variants.default.props;
const defFilterPillsData = require('../filter_pills/filter_pills.data.js');

const templateConverter = require('../../../gulp/helpers/templateConverter');

const datasetHBS = `<div class="mdl-dataset{{#if withStatus}} mdl-dataset--with-status{{/if}}" data-init="dataset">
  <h3 class="mdl-dataset__title atm-heading">
    {{title}}
  </h3>

  {{#if icon}}
    <div class="mdl-dataset__icon">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#{{icon}}"></use>
      </svg>
    </div>
  {{/if}}

  {{#if withStatus}}
    <div class="mdl-dataset__status">
      <p class="atm-tag{{#if status.modifier}} atm-tag--{{status.modifier}}{{/if}}">
        {{#if status.icon}}<span class="atm-tag__icon">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#{{status.icon}}"></use>
          </svg>
        </span>{{/if}}
        <span class="atm-tag__text">{{status.text}}</span>
      </p>
    </div>
  {{/if}}

  <dl class="mdl-dataset__meta-list">
    <div>
      <dt class="mdl-dataset__meta-term">
        RRZ <%=id%>
      </dt>
      <dd class="mdl-dataset__meta-data">
        <%=policyArea%>
      </dd>
    </div>
    <div>
      <dt class="mdl-dataset__meta-term">
        Zuständig
      </dt>
      <dd class="mdl-dataset__meta-data">
        <%=responsibleBodies%>
      </dd>
    </div>
  </dl>
</div>`;

const template = dataHelper.getFileContent('measures_search.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Massnahmen-Suche',
    className: 'MeasuresSearch',
    jira: 'CZHDEV-3604',
    label: 'Suche',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {},
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Standard',
        desc: '',
      },
      props: {
        filterPillsData: defFilterPillsData.props,
        searchInputData: {
          type: 'text',
          label: 'Suchbegriff',
          isSmall: true,
          isInput: true,
          iconOnly: {
            icon: 'inspect',
          },
          additionalFunctionality: {
            icon: 'clear',
            buttontype: 'clear',
            ariaText: 'Lösche Eingabe',
          },
        },
        noResults: 'Keine Massnahmen zu Ihren Filterkriterien gefunden.',
        noResultsSubText: 'Passen Sie Ihre Filter an oder setzen Sie diese zurück.',
        sortContextMenu: {
          lists: [
            {
              items: [
                {
                  ...contextMenuItemDef,
                  text: 'Nummer',
                  iconAfter: false,
                  iconBefore: false,
                  additionalAttributes: 'data-sort="code"',
                  isButton: true,
                },
                {
                  ...contextMenuItemDef,
                  text: 'Status',
                  iconAfter: false,
                  iconBefore: false,
                  additionalAttributes: 'data-sort="status"',
                  isButton: true,
                },
                {
                  ...contextMenuItemDef,
                  text: 'Zuständigkeit',
                  iconAfter: false,
                  iconBefore: false,
                  additionalAttributes: 'data-sort="responsibleBodies"',
                  isButton: true,
                },
              ],
            },
          ],
        },
        notificationData: _.merge({}, defNotificationData, {
          message: 'Beim Laden der Daten ist ein Fehler aufgetreten!',
        }),
        datasetTemplate: templateConverter(datasetHBS, false),
        modules: {
          dialog: {
            ...dialog,
            preview: false,
          },
          pagination,
          autosuggestTemplate,
        },
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
