### Beschreibung
Die Breadcrumb oder "Brotkrümel"-Navigation zeigt den Nutzenden an, wo sie sich befinden. Sie bilden im Header den Pfad der Seite ab; also alle höheren Ebenen bis zur Startseite. Sie ermöglichen ein Zurücknavigieren entlang dieses Pfades.


### Integration
HTML kopieren.

Folgender Link muss  gesetzt werden auch wenn ein Backlink genutzt wird. Stimmt der Referrer nicht mit diesem Link überein so wird dortin weitergleitet. Ansonsten wird history.back() ausgelöst
```html
	<a class="mdl-breadcrumb__link" href="#">Kanton Zürich</a>
```