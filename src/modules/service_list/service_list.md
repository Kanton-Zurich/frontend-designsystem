### Beschreibung
Die Service Liste (tech. «.mdl-service_list») ist das verwendete Modul um einen Service aufzurufen bzw. zu starten. Stehen zu einem Thema ein oder mehrere Services zur Verfügung, werden diese mit der Service Liste einheitlich dargestellt. Ein Klick auf den Button «Start» (siehe «Service Button») lädt den Service als bildschirmfüllendes Overlay (siehe «Modal») über die aktuelle Seite.
 
Auch wenn es nur ein Service ist der aufgerufen werden kann, soll die Liste verwendet werden.
 
#### Was ist ein Service?
Ein Service ist eine Erledigung. Ein Service wird immer dann erstellt, wenn Nutzende etwas erledigen möchten, beispielsweise einen Führerschein beantragen. Es spielt dabei keine Rolle ob Nutzende dabei ein Onlineformular ausfüllen oder ein PDF-Formular herunterladen, dass sie ausfüllen und per Post einreichen. Auch anrufen oder am Schalter vorbeikommen sind übliche Wege etwas zu erledigen.
 
#### Enthaltene Atome und Module
* ATM: Button
* ATM: Heading
* ATM: Paragraph
 
### Integration
ACHTUNG!: Es muss darauf geachtet werden, dass die id Attribute bei den Modals im DOM einzigartig sind. Das gilt insbesondere auch, für die Inhalte die in den Modalfenstern eingebunden werden.

#### Modal Markup
```html
>
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
