### Beschreibung
Dieses Modul dient der Darstellung von Tabellen. Nutzende können Daten in Tabellenform besser vergleichen.


### Integration

HTML kopieren.

#### Spezialfälle

Wenn sowohl in der Tabelle als auch innerhalb der Tabellenunterschrift eine hochgestellte Formatierung vorkommt, die dieselbe Zahl enthält, dann soll aus der Tabellenunterschrift die Zeile der Fussnote (nach ```</sup>``` bis zum nächsten ```<br>```, ```</p>``` oder Ende der Tabellenunterschrift) in ein ```<span class="visuallyhidden">\1</span>``` der hochgestellten Zahl innherhalb der Tabelle angehängt werden.