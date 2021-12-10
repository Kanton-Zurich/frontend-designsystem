### Enthaltene Atome und Module
* [Modul: Tabelle (Table)](../../modules/table/table.html)


### Integration

#### Formularfelder
* "name"-Attribute müssen den Suchfeldern entsprechen
```<input class="atm-form_input__input" id="aktueller_beruf" placeholder="Aktuelle Berufsebezichnung" name="aktueller_beruf" value="" type="text" data-floating>```

#### Variante A: Tabelle (Steuerbuch)
##### Tabellenfelder 
* Datenfelder müssen im Header der Spalte festgelegt werden: Attribute "data-column-name"
```<button aria-live="polite" data-table="sortable" data-order="enum" data-column-index="0" data-column-name="zstb_nr">```
Tabelle a priori Sortierung "data-sort-column" "data-sort-direction"
```<div class="mdl-table mdl-table--fullwidth" data-init="table" data-redraw="true" data-static data-sort-column="zstb-nummer" data-sort-direction="asc" >```

#### Variante B: Generische Suchresultate (RRB)
##### Sucheresultate
* Resultate a priori Sortierung "data-sort-column" "data-sort-direction"
```  <div class="mdl-flex-data__results-generic" data-sort-direction="desc" data-sort-column="relevance"></div>```

#### Allgemeine Attribute
* Template für die Ausgabe der Anzahl resultate 
```data-result-count-title="%1 Treffer zu ihrer Abfrage"```
Data source "data-source"
```<div class="mdl-flex-data" data-init="flexData" data-source="../../mocks/modules/flex_data/flex_data.json">```
Page count in pagination data-pagecount="30"


