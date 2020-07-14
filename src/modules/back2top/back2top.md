### Beschreibung 
Das «Back2Top»-Modul (tech. «.mdl-back2top») dient als Sprunglink für lange Seiten. Nutzende können, ohne lange scrollen zu müssen, an den Seitenanfang springen.

Der entsprechende Back2Top-Button ist grundsätzlich nicht sichtbar. Er erscheint erst dann am unteren rechten Seitenrand, wenn sich die Nutzenden in einem unteren Bereich der Seite befinden und dann ein kleines Stück nach oben scrollen.

Wird der Button angeklickt, so springen die Nutzenden an den Seitenanfang und der Button verschwindet wieder.
Wird der Button ignoriert und die Nutzenden scrollen nach oben, so wird der Button kurz vor dem Seitenheader ausgeblendet.
Wird der Button ignoriert und die Nutzenden scrollen wieder nach unten, so wird der Button ausgeblendet.

Die Verwendung ist immer angebracht.
Der Button darf weder den Footer noch den Language Switch verdecken.

### Integration
 * HTML kopieren.
 * Der Back2Top erhält ein TypeScript, das überprüft wenn die Voraussetzungen erfüllt sind (700px nach unten und dann 300px nach oben). Die Animationen sollen wenn möglich über CSS gesteuert werden. Das StickyBehaviour soll via TypeScript gelöst werden.
#### !!! WICHTIG !!!
 * Back2Top Links auf den Seiten: Wenn es keinen LanguageSwitcher gibt, dann sollte die Property 'preserveLangSwitch: false ' gesetzt werden. Sonst rutscht der Pfeil nach oben.


