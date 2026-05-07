### Integration

* HTML kopieren
* Das Modul Suchseite wird nur auf der Suchseite verwendet.

### Besonderheit im Living Styleguide

Über das Attribut "data-search_result_list-results" auf '.mdl-search_result_list' wird im Living Styleguide ein fixes Set an Resultat-Daten mitgegeben. Das soll **nicht** übernommen werden.

In der richtigen Implementation setzt das übergeordnete Modul "search_page" dynamisch die Daten, die vom Server gefetcht wurden.
