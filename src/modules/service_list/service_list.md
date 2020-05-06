### Beschreibung
Stehen zu einem Thema einer oder mehrere Services zur Verfügung, werden diese mit der Service-Liste einheitlich dargestellt. Ein Klick auf den Button «Start» lädt den Service als bildschirmfüllendes Overlay über der aktuellen Seite. Die Service-Liste wird hauptsächlich auf Themenseiten verwendet.

#### Was verstehen wir unter einem Service?
Ein Service wird immer dann erstellt, wenn die Nutzenden etwas erledigen müssen oder wollen. Beispielsweise einen Führerschein beantragen. Wir fassen den Begriff sehr weit, im Sinn einer Erledigung. Wir verstehen darunter, alles, was jemand im Zusammenspiel mit der kantonalen Verwaltung erledigen möchte. Es spielt dabei keine Rolle, ob sie oder er dabei ein Onlineformular ausfüllt, ein PDF-Formular herunter lädt, ausfüllt und uns per Post schickt, uns anruft oder am Schalter vorbei kommt. <br>

Wir unterscheiden zwischen internen und externen Services. Von einem Service kann der Nutzer auf ein externes System weitergeleitet werden, muss aber nicht. Das Ziel eines Service kann auch sein, dass die Nutzenden wissen, welche Telefonnummer sie anrufen müssen, oder welche Dienststelle sie aufsuchen sollen.


### Integration

ACHTUNG!: Es muss darauf geachtet werden, dass die id Attribute bei den Modals im DOM einzigartig sind. Das gilt insbesondere auch, für die Inhalte die in den Modalfenstern eingebunden werden.
#### Modal Markup
```html
<html>
<head>
  <link rel="canonical" href="{{canonical}}">
</head>
<body>
<div id="lightbox-content">
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
        {{> "modules/instructions/instructions" instructions }}
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
</div>
</body>
</html>
