### Beschreibung
Navigieren Nutzende auf eine Seite in der Cookies gesetzt werden, so verlangt es der Datenschutz, dass die Nutzenden darüber informiert werden. Mit dem Modul “Cookie Einstellungen” (tech: “coookie_controls”) kann die entsprechende Information textlich und in einer visuell ansprechenden Form angezeigt werden.

Insbesondere bei eingebetteten Videos ist darauf hinzuweisen, dass die externe Quellseite (z.B. youtube) Cookies einsetzen kann.


### Integration

HTML kopieren.

Cookienamen werden über die Id's der Input Element gesetzt und wenn ein Cookie per default auf true gesetzt sein soll muss das Attribut "checked" gesetzt sein.

Das Modul wird per JavaScript initialisiert und setzt bei einem Wechsel des Zustands einer Checkbox den entsprechenden Cookie-Parameter:
> name=value
Um die üblichen Schwierigkeiten beim Auslesen und Setzen der Cookie-Werte zu vermeiden, verwenden wir https://www.npmjs.com/package/js-cookie.


