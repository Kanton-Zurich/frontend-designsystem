### 1. Beschreibung back2top
 ![](RackMultipart20200504-4-5g7es1_html_1b2a750b748e76d1.png)
Das Back To Top Icon erscheint erst, wenn der User lange Wege scrollt. Vorher ist er nicht sichtbar. Ein Klick darauf, führt ihn an den Seitenanfang.
### 2. Zweck und Nutzen des Moduls für den Leser (Story)
Als User möchte ich mit einem Klick ganz nach oben scrollen können, damit ich auf langen Seiten nicht zu viel Zeit beim Scrollen verliere.
### 3. Wo wird das Modul eingesetzt?
Auf allen Seitentypen
### 4. Wann ist die Verwendung des Moduls angebracht, wann nicht?
Die Verwendung ist immer angebracht.
### 5. Aufbau der Komponente (des Moduls)
Das Modul besteht aus einem klickbaren Icon.
### 6. Regeln zur Einhaltung der Barrierefreiheit (Accessibility)
### 7. Regeln zur Einhaltung redaktioneller Vorgaben (Usability)
### 8. Regeln zur Einhaltung von CI &amp; CD
### 9. Use Cases
### 10. Dos / Donts
Der Button darf weder den Footer noch den Language Switch verdecken.
### 11. Integration
 HTML kopieren. 
 Der Back2Top erhält ein TypeScript, welches überprüft wenn die Voraussetzungen erfüllt sind (700px nach unten und dann 300px nach oben). Die Animationen sollen wenn möglich über CSS gesteuert werden. Das sticky behaviour soll via TypeScript gelöst werden. (=Confluence)
### !!! WICHTIG !!!
 Back2Top Links auf den Seiten: Wenn es keinen LanguageSwitcher gibt, dann sollte die Property 'preserveLangSwitch: false ' gesetzt werden. Sonst rutscht der Pfeil nach oben


