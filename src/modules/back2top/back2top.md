

## Back2Top (v1)
### 1. Beschreibung 
![alt text](RackMultipart20200504-4-5g7es1_html_1b2a750b748e76d1.png "Back2Top Icon")

Als User möchte ich auf langen Seiten mit einem Klick ganz nach oben zum Seitenanfang gelangen, damit ich möglichst wenig scrollen muss. Dafür nutze ich das Back2Top Element.

Das Back To Top Icon erscheint erst, wenn der User lange Wege scrollt. Vorher ist er nicht sichtbar.

---

## Back2Top (v2)
### 1. Beschreibung 
![alt text](RackMultipart20200504-4-5g7es1_html_1b2a750b748e76d1.png "Back2Top Icon")

Das Back To Top Icon erscheint erst, wenn der User lange Wege scrollt. Vorher ist er nicht sichtbar. Ein Klick darauf, führt ihn an den Seitenanfang.
### 2. Nutzen des Moduls für den Leser (Story)
Als User möchte ich auf langen Seiten mit einem Klick ganz nach oben zum Seitenanfang gelangen, damit ich möglichst wenig scrollen muss.
### 3. Wann ist die Verwendung des Moduls angebracht?
Die Verwendung ist immer angebracht.

Beispiele einer korrekten Verwendung:
 
- [Direktion der Justiz und des Innern](https://zh.ch/de/direktion-der-justiz-und-des-innern.html)
- [Staatsanwaltschaft](www.zh.ch/de/direktion-der-justiz-und-des-innern/staatsanwaltschaft.html)

### 4. Aufbau des Moduls
Das Modul besteht aus einem klickbaren Icon.
### 5. CI &amp; CD
Der Button darf weder den Footer noch den Language Switch verdecken.

### 6. Integration
 HTML kopieren. 
 Der Back2Top erhält ein TypeScript, welches überprüft wenn die Voraussetzungen erfüllt sind (700px nach unten und dann 300px nach oben). Die Animationen sollen wenn möglich über CSS gesteuert werden. Das sticky behaviour soll via TypeScript gelöst werden. (=Confluence)
### !!! WICHTIG !!!
 Back2Top Links auf den Seiten: Wenn es keinen LanguageSwitcher gibt, dann sollte die Property 'preserveLangSwitch: false ' gesetzt werden. Sonst rutscht der Pfeil nach oben


