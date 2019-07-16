### Beschreibung



### Integration

ACHTUNG!: Es muss darauf geachtet werden, dass die id Attribute bei den Modals im DOM einzigartig sind. Das gilt insbesondere auch, für die Inhalte die in den Modalfenstern eingebunden werden.
#### Modal Markup
```html
<div class="lyt-wrapper">
  <div class="grid-x grid-margin-x">
    <div class="cell small-offset-2 medium-offset-2 large-offset-2 xlarge-offset-2 small-10 medium-9 large-8">
      <!-- modal header -->
      {{> "modules/page_header/page_header" servicePageHeaderData }}
    </div>
  </div>
</div>
<div class="lyt-wrapper">
  <div class="grid-x grid-margin-x">
    <div class="cell small-offset-2 medium-offset-2 large-offset-2 xlarge-offset-2 small-10 medium-9 large-8">
      <!-- modal content -->
      {{> "modules/service_box/service_box" serviceBoxData }}
    </div>
  </div>
</div>
<div class="lyt-wrapper">
  <div class="grid-x grid-margin-x">
    <div class="cell small-offset-2 medium-offset-2 large-offset-2 xlarge-offset-2 small-10 medium-9 large-8">
      <!-- modal footer -->
    </div>
  </div>
</div>
```
#### Modal data
```javascript
{
	servicePageHeaderData: {
		pageTitle: 'Führerausweis bestellen',
		inverted: true,
		hasImageTitle: false,
		hasVideo: false,
		hasImage: false,
		hasBacklink: false,
		hasBreadcrumb: false,
		noButton: true,
		noText: true,
		hasCloseButton: true
	},
	serviceBoxData: {
		svgSprites: '["/assets/media/svgsprite/base.svg"]',
		defaultColorVariation: 'cv-blue',
		tabs: [{
				title: 'Vor Ort',
				data: '<p class="atm-paragraph">Wenn Ihr Ausweis vor dem 01.01.2013 ausgestellt wurde, müssen Sie ein neues Passfoto machen.  Ihr Reisebüro oder das Konsulat Ihres Reiseziels können Ihnen dabei helfen. </p>'
			},
			{
				title: 'Online',
				data: '<p class="atm-paragraph">Klären Sie ab, ob Sie für Ihr Reiseziel einen internationalen Führerschein benötigen. Ihr Reisebüro oder das Konsulat Ihres Reiseziels können Ihnen dabei helfen. </p>'
			},
			{
				title: 'Per Post',
				data: '<p class="atm-paragraph">Holen Sie den internationalen Führerschein direkt am Schalter einer unserer Strassenverkehrsämter ab.</p>'
			}
		],
		linklist: {
			list1: {
				links: [{
					linkListItemTitle: 'Stellungsnahme des Direktors',
					linkListItemHref: '/'
				}]
			}
		}
	}
}
```
#### Modal Inhaltsmarkup
```html
<div class="lyt-wrapper">
  <div class="grid-x grid-margin-x">
    <div class="cell small-offset-2 medium-offset-2 large-offset-2 xlarge-offset-2 small-10 medium-9 large-8">
      <!-- modal header -->
      <div class="mdl-page-header  mdl-page-header--inverted  ">
        <div class="lyt-wrapper">
          <div class="grid-x grid-margin-x">
            <div class="mdl-page-header__logo-container cell tiny-2 xsmall-2 small-2 medium-2 large-2 xlarge-2">
              <span class="visuallyhidden">Logo des Kantons Zürich</span>
              <svg viewBox="0 0 100 100" class="mdl-page-header__logo">
                <use xlink:href="#ktzh_inverted"></use>
              </svg>
            </div>
            <div class="cell  tiny-10 xsmall-10 small-10 medium-10 large-10 xlarge-10">
              <div class="mdl-page-header__breadcrumb">
                <button class="mdl-page-header__closebutton">Schliessen <svg class="icon">
                    <use xlink:href="#exit"></use>
                  </svg></button>
              </div>
              <h1 class="atm-heading">Führerausweis bestellen</h1>
            </div>
          </div>
          <div class="grid-x grid-margin-x">
            <div class="cell xsmall-offset-2 small-offset-2 medium-offset-2 large-offset-2 xlarge-offset-2 xsmall-auto small-auto medium-9 large-8 xlarge-8">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="lyt-wrapper">
  <div class="grid-x grid-margin-x">
    <div class="cell small-offset-2 medium-offset-2 large-offset-2 xlarge-offset-2 small-10 medium-9 large-8">
      <!-- modal content -->
      <div class="mdl-service_box">
        <div class="mdl-instructions" data-init="instructions">
          <h2 class="atm-heading atm-heading--bordered">H2: 48px Content title Black</h2>
          <ol class="mdl-instructions__list  mdl-instructions__list--ordered">
            <li class="mdl-instructions__item">
              <div aria-hidden="true" class="mdl-instructions__bullet"> 01 </div>
              <div>
                <h3 class="mdl-instructions__item-title atm-heading"> Bevor Sie starten </h3>
                <div class="mdl-instructions__item-content">
                  <div class="mdl-richtext">
                    <p class="atm-paragraph"> Klären Sie ab, ob Sie für Ihr Reiseziel einen internationalen Führerschein benötigen. Ihr Reisebüro oder das Konsulat Ihres Reiseziels können Ihnen dabei helfen. </p>
                  </div>
                  <div class="mdl-linklist">
                    <ul class="mdl-linklist__list">
                      <li class="mdl-linklist__item">
                        <a class="atm-linklist_item  " href="../../">
                          <span class="atm-linklist_item__text">
                            <span>Stellungsnahme des Direktors</span>
                          </span>
                          <svg class="icon atm-linklist_item__arrow">
                            <use xlink:href="#arrow-right"></use>
                          </svg>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
            <li class="mdl-instructions__item">
              <div aria-hidden="true" class="mdl-instructions__bullet"> 02 </div>
              <div>
                <h3 class="mdl-instructions__item-title atm-heading"> Dokumente vorbereiten </h3>
                <div class="mdl-instructions__item-content">
                  <div class="mdl-richtext">
                    <p class="atm-paragraph"> Führerausweis Kopie </p>
                    <p class="atm-paragraph"> Wenn Ihr Ausweis vor dem 01.01.2013 ausgestellt wurde, müssen Sie ein neues Passfoto machen. </p>
                    <p class="atm-paragraph">
                      <a href="#" class="atm-text_link">Diese Anforderungen muss Ihr Passfoto erfüllen</a>
                    </p>
                  </div>
                </div>
              </div>
            </li>
            <li class="mdl-instructions__item">
              <div aria-hidden="true" class="mdl-instructions__bullet"> 03 </div>
              <div>
                <h3 class="mdl-instructions__item-title atm-heading"> Beantragen </h3>
                <div class="mdl-instructions__item-content">
                  <div class="mdl-richtext">
                    <p class="atm-paragraph"> Wenn Ihr Ausweis vor dem 01.01.2013 ausgestellt wurde, müssen Sie ein neues Passfoto machen. Ihr Reisebüro oder das Konsulat Ihres Reiseziels können Ihnen dabei helfen. </p>
                  </div>
                  <div class="mdl-tabs" data-init="tabs">
                    <ul class="mdl-button_group" data-init="buttonGroup">
                      <li class="mdl-button_group__item">
                        <button class="atm-button atm-button--secondary" data-tab-index="0" role="tab" aria-selected="false"> Vor Ort </button>
                      </li>
                      <li class="mdl-button_group__item">
                        <button class="atm-button atm-button--secondary" data-tab-index="1" role="tab" aria-selected="false"> Online </button>
                      </li>
                      <li class="mdl-button_group__item">
                        <button class="atm-button atm-button--secondary" data-tab-index="2" role="tab" aria-selected="false"> Per Post </button>
                      </li>
                    </ul>
                    <div class="mdl-tabs__tab" role="tabpanel">
                      <p class="atm-paragraph">Wenn Ihr Ausweis vor dem 01.01.2013 ausgestellt wurde, müssen Sie ein neues Passfoto machen. Ihr Reisebüro oder das Konsulat Ihres Reiseziels können Ihnen dabei helfen. </p>
                    </div>
                    <div class="mdl-tabs__tab" role="tabpanel">
                      <p class="atm-paragraph">Klären Sie ab, ob Sie für Ihr Reiseziel einen internationalen Führerschein benötigen. Ihr Reisebüro oder das Konsulat Ihres Reiseziels können Ihnen dabei helfen. </p>
                    </div>
                    <div class="mdl-tabs__tab" role="tabpanel">
                      <p class="atm-paragraph">Holen Sie den internationalen Führerschein direkt am Schalter einer unserer Strassenverkehrsämter ab.</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="lyt-wrapper">
  <div class="grid-x grid-margin-x">
    <div class="cell small-offset-2 medium-offset-2 large-offset-2 xlarge-offset-2 small-10 medium-9 large-8">
      <!-- modal footer -->
    </div>
  </div>
</div>
```
