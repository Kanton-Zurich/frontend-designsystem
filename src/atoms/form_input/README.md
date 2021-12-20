### Form Inputs
#### Beschreibung
Das Form Input Atom umfasst alle Variationen der erlaubten Form Inputs für den Kanton Zürich.

#### Floating Label
Um ein Input-Label «floaten» zu lassen muss man lediglich die Klasse `atm-form_input--floated` dem umschliessenden DIV-Element hinzufügen.

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
Die Validierung wird durch 2 Aspekts bestimmt:


1. Das `data-pattern`-Attribut für Input `type="text"`, `type="tel"` und `type="number"`. 
> Das Pattern für den Input Type **Url** und **Email** ist in dem formrules.class.ts File intern geregelt. Falls doch ein Pattern bei diesen Typen gestzt wurde, wird dieses ignoriert.


Pattern Beispiele:
- `data-pattern="^([a-zA-Z]){3,6}$"` Ein Wort mit mindestens 3 und maximal 6 Buchstaben  
- `data-pattern="^[0-9]+$"` Eine Zahl (0-9) die mindestens einstellig ist.


2. Das `required`-Attribut 

#### Input Masking

Ausschliesslich Eingabefelder vom Type 'text' können mit einer Inputmaskierung versehen werden. Folgende Maskierungsarten werden unterstützt:

- Währung mit und ohne Kommastellen
- Generische Masken die immer die gleiche Länge haben müssen


##### Abhängige Felder (Autofill)
(!) Achtung: Die folgende Funktionalität kann nur innerhalb eines Formulars verwendet werden und funktioniert nicht global.

Durch das `data-autofill="id"` Attribut kann ein Textfeld funktional von einem anderen Textfeld abhängig gemacht werden. Dadurch wird der Eingabewert vom Textfeld welches im Attribut referenziert wurde fortlaufend übernommen.
Sobald jedoch eine manuelle Eingabe auf dem Textfeld mit dem Autofill-Attribut stattgefunden hat, wird die Eingabe des referenzierten Textfeldes nicht mehr übernommen.

Beispiel:
`<input class="atm-form_input__input" id="e_mail"  name="e_mail" value="" type="email" required>`
`<input class="atm-form_input__input"  value="" type="email" data-autofill="e_mail">`

Dies funktioniert nur bei textbasierten Eingabefeldern


##### Währungen

Attribute:

- `data-input-mask="currency"`
Währung mit zwei Kommastellen Beispiel: 10.00

Attribute:
- `data-input-mask="currency_flat"`
Währung ohne Kommastellen Beispiel: 100


##### Generische Masken

Generische Masken benötigen zwei Attribute welche abgestimmt werden müssen:

`data-input-mask="\d\d"`

###### Input Maskennotation
Eine Input Maske bentötigt eine Notation welche das erlaubte Eingabezeichen und falls nötig bei Zwischenzeichen einen Autofill macht. Die Zeichen müssen in Regex-Notation gemacht werden

`{regex}` oder `{regex}[{regex}{autofill}]` 

Beispiel für eine Zeitangabe HH:MM

`\d\d:[\d:]\d\d`  Dabei ist der ":" ein mit Autofill ausgestattetes Eingabezeichen

Weiter benötigen generische Masken einen Platzhalter um die Maskierung interaktiv zu machen

`data-mask-placeholder="HH:MM"`

###### Beispiele

- `data-input-mask="\d\d\.[\d.]\d\d\.[\d.]\d\d\d\d"`
- `data-mask-placeholder="TT.MM.JJJJ"`

- `data-input-mask="\d\d\.[\d.]\d\d\.[\d.]\d\d\d\d [\d - ]\-[\d- ] [\d ]\d\d\.[\d.]\d\d\.[\d.]\d\d\d\d"`
- `data-mask-placeholder="TT.MM.JJJJ - TT.MM.JJJJ"`


