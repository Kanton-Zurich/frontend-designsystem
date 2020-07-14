### Beschreibung
 
Der Zuständigkeitsfinder (tech. «.mdl-jurisdiciton-finder») ist eine Applikation. Geben Nutzende eine Postleitzahl ein, so liefert der Zuständigkeitsfinder einen passenden, für dieses Gebiet zuständige, Kontakt und zeigt die Adresse auf einer Karte an.  
 
#### Enthaltene Atome und Module
* ATM: Paragraph
* ATM: Button
* ATM: Form Input
* MDL: Standorte
 
### Integration
 
* Wichtig! Bei der Integration muss auf den den Resultat Items im Standorte-Modul ein Filterkriterium gesetzt werden. Dieses kann durch Kommas separiert mehrere Werte enthalten. Diese Filterkriterien entsprechen den PLZ - Werten.
Wie in folgendem Beispiel:
```html
<a class="atm-linklist_item   atm-linklist_item--location" tabindex="0" data-locations="listItem" data-filter-attr="8000,8001">
```
* HTML kopieren.

