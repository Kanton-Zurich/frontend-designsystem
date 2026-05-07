### Integration

* HTML kopieren
* Das Modul Suchseite wird nur auf der Suchseite verwendet.

Folgende Properties müssen auf dem DIV mit der Klasse '.mdl-search_page' gesetzt werden:

- data-search-page-options, muss ein JSON-Objekt sein welches über die Eigenschaft «url» verfügt. Diese URL wird für das Laden der Suchanfragen benötigt. Im Living Styleguide ist ausserdem die Eigenschaft «inEstatico» gesetzt, um verschiedene Mock-Reponses zu similieren. Diese Eigenschaft darf in der Integration **nicht** gesetzt sein.

Um die Richtigen Daten zu erhalten, wird der URL als GET-Parameter folgende Daten übergeben:

- q: Ein String mit dem eingegebenen Suchbegriff ('no results' erzeugt im Living Styleguide die Ansicht für keine Resultate)
- type: Ein String welcher die Art der Assets vorgibt. ('contentpage' wird nicht gesendet)
- page: Eine Nummer die die aktuelle Seitenzahl angibt.
