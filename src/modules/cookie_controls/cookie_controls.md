### Integration

* Cookienamen werden über die ID’s der Input Elemente gesetzt und wenn ein Cookie per default auf true gesetzt sein soll, muss das Attribut «checked» gesetzt sein.
* Das Modul wird per JavaScript initialisiert und setzt bei einem Wechsel des Zustands einer Checkbox den entsprechenden Cookie-Parameter:
> name=value
Um die üblichen Schwierigkeiten beim Auslesen und Setzen der Cookie-Werte zu vermeiden, verwenden wir https://www.npmjs.com/package/js-cookie.
