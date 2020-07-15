### Beschreibung

Mit dem Modul Tabelle (tech. «.mdl-table») können Daten tabellarisch dargestellt werden.
Nutzende können Daten in Tabellenform besser vergleichen. <br>
Die Darstellungsvarianten sind mannigfaltig (siehe Vorschau).

#### Enthaltene Atome und Module
* <a href="../../atoms/headings/headings.html">ATM: Heading</a>
* <a href="../../atoms/figcaption/figcaption.html">ATM: FigCaption (Legende)</a>


### Integration

* HTML kopieren.

#### Spezialfälle

Wenn sowohl in der Tabelle als auch innerhalb der Tabellenunterschrift eine hochgestellte Formatierung vorkommt, die dieselbe Zahl enthält, dann soll aus der Tabellenunterschrift die Zeile der Fussnote (nach ```</sup>``` bis zum nächsten ```<br>```, ```</p>``` oder Ende der Tabellenunterschrift) in ein ```<span class="visuallyhidden">\1</span>``` der hochgestellten Zahl innherhalb der Tabelle angehängt werden.