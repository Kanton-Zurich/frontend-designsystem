### Beschreibung
Cookies können dazu genutzt werden, wiederkehrende Nutzende zu identifizieren und Ihnen so eine personalisierte Nutzererfahrung zu bieten. Über das Modul Cookie Controls (tech: «.mdl-coookie_controls») können Nutzende Einstellungen zu dieser Personalisierung treffen oder auch die Speicherung von Cookies abwählen. Die Kontrolle über den Datenaustausch mit Webseiten ist ein Mehrwert den Webseiten mit diesem Modul anbieten können.

#### einige Nutzungsbeispiele
<ol>
<li> Die Einstellung zur angezeigten Sprachversion einer Seite: Möchten Nutzende eine Seite in einer bestimmten Sprache angezeigt bekommen oder auch nicht, so kann sich das über die Cookie Controls regeln lassen.
<li> Bei eingebetteten Videos ist darauf hinzuweisen, dass die externe Quellseite (z.B. youtube) Cookies einsetzen kann. Über die Cookie Controls können Nutzende diesem Verhalten dauerhaft zustimmen oder verneinen.
</ol>
 
### Integration
HTML kopieren.
Cookienamen werden über die Id's der Input Element gesetzt und wenn ein Cookie per default auf true gesetzt sein soll muss das Attribut «checked» gesetzt sein.
Das Modul wird per JavaScript initialisiert und setzt bei einem Wechsel des Zustands einer Checkbox den entsprechenden Cookie-Parameter:
> name=value
Um die üblichen Schwierigkeiten beim Auslesen und Setzen der Cookie-Werte zu vermeiden, verwenden wir https://www.npmjs.com/package/js-cookie.
