### Beschreibung

Social Media Stream mit asynchroner Ladefunktion

### Integration

Die Datenquelle ist mit einem Pattern definiert und kann frei konfiguriert werden. data-source
Maximalwert für die zu ladenden Daten werden über data-fetch-limit festgelegt. Fehlt dieses Attribut wird 3 als Defaultwert angenommen.

```html
<div class="mdl-social-media-stream" data-init="socialMediaStream" data-source="/mocks/modules/social_media_stream/social_media_stream_start_{start}_limit_{limit}.json" data-fetch-limit="3">
```



HTML kopieren.
