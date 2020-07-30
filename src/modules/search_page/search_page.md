### Beschreibung
 
Das Modul Suchseite (tech. «.mdl-search_page») ist ein Eingabefeld für Suchbegriffe. Es kann nur auf einer Seite eingebunden werden.


### Integration

* HTML kopieren

* Das Modul Suchseite wird nur auf der Suchseite verwendet.

* Folgende Properties müssen auf dem DIV mit der Klasse '.mdl-search_page' gesetzt werden:

> <p>data-search-page-options, muss ein JSON-Objekt sein welches über das Property «url» verfügt. Diese URL wird für das Laden der Suchanfragen benötigt.
>Um die Richtigen Daten zu erhalten, wird der URL als GET-Parameter folgende Daten übergeben:</p>

 - q: Ein String mit dem eingegebenen Suchbegriff
 - type: Ein String welcher die Art der Assets vorgibt. ('all' wird nicht gesendet)
 - page: Eine Nummer die die aktuelle Seitenzahl angibt.
