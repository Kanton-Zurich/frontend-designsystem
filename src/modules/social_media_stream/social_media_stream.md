### Beschreibung
 
Mit dem Modul Social Media Stream (tech. «.mdl-social-media-links») können externe Social Media Feeds in einer Webseite eingebettet und in einer ansprechenden Weise dargestellt werden. Mit dem Modul Social Media Stream können digitale Kommunikationen zu einem Thema visuell, interaktiv und zeitlich am Puls des Geschehens präsentiert werden. Nutzende werden dazu ermuntert zu interagieren und sich mit dem fokussierten Thema auseinanderzusetzen.
 
Die Streams werden dabei asynchron geladen.
 
#### Enthaltene Atome und Module
* <a href="../../atoms/headings/headings.html">ATM: Heading</a>
* <a href="../../atoms/button/button.html">ATM: Button</a>

### Integration
<ul>
<li>Die Datenquelle ist mit einem Pattern definiert und kann frei konfiguriert werden. <br>data-source
{page} ist dabei der Seitenplatzhalter
```html
<div class="mdl-social-media-stream" data-init="socialMediaStream" data-source="/mocks/modules/social_media_stream/social_media_stream.json?page={page}">
```

<li>HTML kopieren.
</ul>