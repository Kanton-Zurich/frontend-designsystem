### Enthaltene Atome und Module
* [Atom: Button](../../atoms/button/button.html)
* [Atom: Titel (Heading)](../../atoms/headings/headings.html)
* [Atom: Paragraph](../../atoms/paragraph/paragraph.html)
 
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
