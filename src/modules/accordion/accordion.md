
---
---
## Accordion (v1)
### 1. Beschreibung
Im Accordion können Inhalte verborgen werden, die nicht auf den ersten Blick ersichtlich sein müssen. Es wird auf- und zugeklappt. Accordions eignen sich für Inhalte, die nicht immer oder nicht für jeden Nutzer relevant sind, wie etwa Details, Beispiele oder erläuternde Informationen. 

Mit Accordions können Inhalte übersichtlich gegliedert werden, da im geschlossenen Zustand nur der Titel ersichtlich ist. Accordions sind interaktiv und erfordern einen Einsatz vom Nutzer: Um den Inhalt zu sehen, muss er den Titel lesen, verstehen und anklicken. Diese Hürde sollte gerechtfertigt sein, beispielsweise durch die bessere Übersichtlichkeit einer Seite dank eines Accordions.

### 2. Integration
<ul>
<li>HTML kopieren.

<li>Um <b>URL-Reflection</b> (open/close-state) einzurichten, setzen Sie einfach das optionale accordionPanelID-Konfigurationsattribut oder direkt die ID auf dem Button-Element (Beispiel: person_detail page).
</ul>

---

## Accordion (v2)
### 1. Beschreibung

Im Accordion können Inhalte **verborgen** werden, die nicht auf den ersten Blick ersichtlich sein müssen. Es wird **auf- und zugeklappt**. Accordions eignen sich für Inhalte, die nicht immer oder nicht für jeden Nutzer relevant sind, wie etwa Details, Beispiele oder erläuternde Informationen. 

Mit Accordions können Inhalte übersichtlich gegliedert werden, da im geschlossenen Zustand nur der Titel ersichtlich ist. Accordions sind interaktiv und erfordern einen Einsatz vom Nutzer: Um den Inhalt zu sehen, muss er den Titel lesen, verstehen und anklicken. Diese Hürde sollte gerechtfertigt sein, beispielsweise durch die bessere Übersichtlichkeit einer Seite dank eines Accordions.


### 2. Empfehlung zur Einhaltung von CI/CD
<ul>
<li>Inhalte, die in ihrer Abfolge wichtig sind, sollten im Zweifelsfall nicht in Accordions, sondern im Fliesstext dargestellt werden. Dort sollte die Struktur mit Überschriften aufgezeigt werden.
<li>Kernbotschaften oder wichtige Informationen gehören nicht in Accordions.
<li>Accordions dürfen nicht missbraucht werden, um unwichtige, irrelevante Inhalte zu verstecken. Wenn etwas irrelevant ist, gehört es nicht auf die Seite.
<li>Der Inhalt einer Seite beginnt nie mit einem Accordion.
<li>Accordions können keine weiteren Accordions enthalten
</ul>

### 3. Empfehlung zur Einhaltung der Barrierefreiheit (Accessibility)
- Accordion-Titel können als H2, H3 oder H4 gesetzt und in die Ankernavigation eingebunden werden (stets Hierarchie der Titel einhalten)

### 4. Aufbau des Moduls
Folgende Inhaltselemente können in ein Accordion eingefügt werden:
<ul>
<li>Text
<li>Tabellen
<li>Bilder
<li>Bildergalerie
<li>Video
<li>Downloadliste
<li>Linkliste
<li>Service Liste
<li>Infobox
<li>Personen Teaser
<li>Publikationsteaser
</ul>

### 5. Integration

<li>HTML kopieren.

<li>Um <b>URL-Reflection</b> (open/close-state) einzurichten, setzen Sie einfach das optionale accordionPanelID-Konfigurationsattribut oder direkt die ID auf dem Button-Element (Beispiel: person_detail page).
