### Beschreibung

Datumsfelder (tech. «.mdl-datepicker»), auch Datumsauswahl genannt, werden immer dann eingesetzt wenn Nutzende ein bestimmtes Datum auswählen sollen. Typische Anwendungsfälle sind Inhaltsfilter (z.B. Publikationen nach Datum anzeigen) sowie auch Formulare (z.B. Geburtstag eingeben). 

### Integration

The datepicker module has a few relevant aspects in terms of configurations via the data attributes:

- data-datetimeformat 
1. "time" -  plain timepicker variant
2. "date" -  plain datepicker variant
3. "date-range" -  datepicker for selecting a range(from/to)
4. "date-time" -  datepicker for selecting a plain date combined with a time

- data-localization
1. unset = default = english
2. "de" for german
3. "fr" for french
4. "it" for italian

- data-mindate

If set, it initialized the plugin with the give date as minimum selectable date

- data-maxdate

If set, it initialized the plugin with the give date as maximum selectable date

HTML kopieren.
