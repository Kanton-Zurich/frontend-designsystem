### Form Inputs
#### Beschreibung
Das Form Input Atom umfasst alle Variationen der erlaubten Form Inputs für das Kanton Zürich.

#### Floating Label
Um eine Input-Label "floaten" zu lassen muss man lediglisch die Klasse `atm-form_input--floated` dem umschliessenden DIV-Element hinzufügen.

```html
<div class="atm-form_input atm-form_input--floated" data-input>
	...
</div>
```

#### Das `type`-Attribut.
Zulässige Werte sind:
  - `text`
  - `number`
  - `tel`
  - `url`
  - `email`
  - `password`

#### Validierung
Die Validierung wird durch 2 Aspekt bestimmt:


1. Das `data-pattern`-Attribut für Input `type="text"`, `type="tel"` und `type="number"`. 
> Das Pattern für den Input Type **Url** und **Email** ist in dem formrules.class.ts File intern geregelt. Falls doch ein Pattern bei diesen Typen gestzt wurde wird dieses ignoriert.


Pattern Beispiele:
- `data-pattern="^([a-zA-Z]){3,6}$"` Ein Wort mit mindestens 3 und maximal 6 Buchstaben  
- `data-pattern="^[0-9]+$"` Eine Zahl (0-9) die mindestens einstellige ist.


2. Das `required`-Attribut 
