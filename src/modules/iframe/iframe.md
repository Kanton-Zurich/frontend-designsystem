### Beschreibung
In einem iFrame (tech. «.mdl-iframe») kann ein externer Inhalt in einer Webseite angezeigt werden, ohne dass dieser technisch in der Webseite oder im CMS integriert werden muss.
 
 
### Integration
* HTML kopieren.
 
#### Folgende Angaben sind Pflicht:
* Die URL des externen Inhalts / der Applikation 
* Der Titel für das Modul. Dieses wird Nutzenden nicht angezeigt, sondern ist für Screenreader (Accessibility) wichtig (versteckter Titel).

#### Folgende Angaben sind fakultativ:
* Die Höhe des Fensters in Pixeln

(!) WICHTIG: Wenn keine Höhe angegeben wird geht das System davon aus, dass die Höhe des Fensters dynamisch gesetzt wird. Dafür sind ist es notwendig, dass die Client-Seite im Iframe folgendes Javascript mit einbindet:

https://github.com/davidjbradshaw/iframe-resizer/blob/master/js/iframeResizer.contentWindow.min.js

Andernfalls wird das Iframe nicht sinnvoll nutzbar sein
