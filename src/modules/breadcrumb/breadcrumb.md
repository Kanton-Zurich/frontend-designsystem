### Beschreibung
Die «Breadcrumb-Navigation» (tech. «.mdl-breadcrumb») zeigt Nutzenden an, wo sie sich innerhalb der Website-Struktur befinden. Sie bildet im Header den Pfad der Seite ab; also alle höheren Ebenen bis zur Startseite. Sie ermöglicht ein Zurücknavigieren entlang dieses Pfades.

Die Navigation erfolgt in eine Richtung, nämlich immer um ein oder mehrere Seiten-Level nach oben. Eine nützliche Ergänzung zur Breadcrumb sind Navigationen mit ContentTeasern (Bsp. Themenliste, ContentNav). Diese erlauben die Navigation in die andere Richtung, also um ein Seiten-Level tiefer.

Navigationen sind für Nutzende ein Werkzeug um sich durch die Website-Struktur zu bewegen. Sie dienen dazu, Inhalte schnell zu finden und sich auf der Website zurechtzufinden. Die Struktur der Website hat einen grossen Einfluss auf die Nutzerfreundlichkeit der Navigation. Eine gute Navigation trägt massgeblich zu einem positiven Nutzererlebnis bei.
 
Die Breadcrumb enthält folgende Atome und Module:
Context-Menu (Modul)


### Integration
* HTML kopieren.

Folgender Link muss  gesetzt werden auch wenn ein Backlink genutzt wird. Stimmt der Referrer nicht mit diesem Link überein so wird dortin weitergleitet. Ansonsten wird history.back() ausgelöst
```html
	<a class="mdl-breadcrumb__link" href="#">Kanton Zürich</a>
```