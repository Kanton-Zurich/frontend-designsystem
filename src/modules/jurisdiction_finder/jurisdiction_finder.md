### Beschreibung

Der Zuständigkeitsfinder liefert einen passenden Kontakt mittels der (im Kontakt hinterlegten) Postleitzahl. Siehe auch Verwaltung von Kontakten.

### Integration

Wichtig! Bei der Integration muss auf den den Resultat Items im Standorte-Modul ein Filterkriterium gesetzt werden. Dieses kann durch Kommas separiert mehrere Werte enthalten. Diese Filterkriterien entsprechen den PLZ - Werten.
Wie in folgendem Beispiel:
```html
<a class="atm-linklist_item   atm-linklist_item--location" tabindex="0" data-locations="listItem" data-filter-attr="8000,8001">
```

HTML kopieren.
