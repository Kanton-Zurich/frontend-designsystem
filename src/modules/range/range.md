### Beschreibung
Der Regler (tech. «.mdl-range») ist wie auch der Radiobutton oder die Select-Box ein interaktives Modul mit dem Nutzende eine Eingabe in einem Formular tätigen können. Die Nutzung als Filter ist auch vorstellbar. Der einstellbare Wert ist im Gegensatz zu vielen anderen Formularelementen jedoch unpräzise. Deshalb funktioniert das Range-Modul auch am effektivsten, wenn keine exakten Werte verlangt sind.  

Typische Anwendungsfälle sind Skalenwerte, aus denen Nutzende eine Auswahl eingrenzen möchten. In Onlineshops sind dies typischerweise Preise oder Grössen, in Reiseportalen Entfernungen oder Zeitspannen.

Auch geläufig ist die der Begriff «Silder».  Im Rahmen dieses LSG wird «Slider» jedoch als optionale Bezeichnung für Carousel, Bildergalerie, Bilderslider verstanden. 


### Integration
This module uses the noUiSlider-Plugin (https://refreshless.com/nouislider/). All relevant configurations are mapped 
to the data attributes of the mdl-range__slider(DIV). 

#### The following list should give you a brief overview:

- **data-minvalue** (Value: Number as String)  
The possible selectable minimum value.

- **data-maxvalue** (Value: Number as String)  
The possible selectable maximum value.

- **data-handleoneposition** (Value: Number as String)  
The initial position of the first handle to control the range slider.

- **data-handletwoposition** (Value: Number as String)  
If set the range slider gets a second handle to control and sets the position to the given value.

- **data-rangesteps** (Value: Number as String)  
The value represents a fix amount which the handles will move.

- **data-tooltipsuffix** (Value: Char/String)  
A string that will be attached at the end of the tooltip text.

- **data-tooltipdecimals** (Value: Number as String)  
This number indicates how many decimals will be after the zero dot.

- **data-tooltipthousand** (Value: Char/String)
This symbol will be used to seperate thousands e.g. 10000 will become 10‘000.

#### Configuring Tickmark/ Pips: 
(for further informations see https://refreshless.com/nouislider/pips/)
- data-tickmarkmode (This mode is relevant for how the tickmarks/pips will be placed.)


* HTML kopieren.
