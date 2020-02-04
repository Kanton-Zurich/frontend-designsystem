<h2 class='atm-heading atm-heading--bordered'>Raster</h2>

<h3 class='atm-heading'>Desktop</h3>

Das Gestaltungsraster der Webseite ist auf einem 12-Spaltensystem aufgebaut. Das Raster ist zentriert (im Inhaltsbereich) und verfügt über einen variablen Einzug abhänging von der Viewport-Breite. Die Maximale Ausdehnung ist 1440px, danach sind nur noch die Hintergrundelemente auf die volle Breite hinausgezogen. Die Layoutmöglichkeiten in den Spalten ist in allen Variationen möglich. Die Mindestbreite für Gestaltungselemente beträgt zwei Spalten.

{{> "modules/image_figure/image_figure" rasterLargeImage }}

<h3 class='atm-heading'>Tablet</h3>

{{> "modules/image_figure/image_figure" rasterMediumImage }}

<h3 class='atm-heading'>Mobile</h3>

Mobile verwendet 6 Spalten.

{{> "modules/image_figure/image_figure" rasterSmallImage }}

<h2 class='atm-heading atm-heading--bordered'>Breakpoints</h2>

Das Setzen von Breakpoints ermöglicht eine flexible und automatische Anpassung des Layouts auf das jeweilige Anzeigegerät. Je nach Breakpoint variieren fixe und variable Werte. Dies lässt ein flexibles und responsives Gestaltungsraster zu.

{{> "modules/table/table" tableData }}

<h2 class='atm-heading atm-heading--bordered'>Abstände</h2>

Um einheitliche Abstände innerhalb einer Applikation zu gewährleisten, werden nachfolgende Grundgrössen definiert. In der Gestaltung und Umsetzung ist darauf zu achten jeweils diese Grunddefinitionen zu verwenden. Diese Grössen sind im Frontend als Variablen definiert.

{{> "modules/image_figure/image_figure" spacingsImage }}

<h2 class='atm-heading atm-heading--bordered'>Abstandskurven</h2>

Abstände zwischen Elementen wachsen mit der Grösse des Viewports. Wie sich einzelne Abstände über die verschiedenen Breakpoints hinweg verhalten ist in Abstandskurven definiert. Diese Kurven geben vor wie stark sich ein Abstand verändert. Eine Komponente hat also nicht einfach eine fixen Abstand zum nächsten, sondern wird einer dieser Abstandskurven zugewiesen und skaliert dann entsprechend auf den unterschiedlichen Geräten.

{{> "modules/image_figure/image_figure" curvesImage }}
