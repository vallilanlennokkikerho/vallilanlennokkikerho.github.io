---
layout: nil
sitemap: false
permalink: /llms-full.txt
---
# Vallilan lennokkikerho ry — koko sivuston sisältö tekstinä

> Vallilan lennokkikerho ry on helsinkiläinen radio-ohjattavien lennokkien (mallilentokoneiden) kerho. Talosaaren lennokkikenttä sijaitsee Talosaarentie 108, 00890 Helsinki, ja on avoin ympäri vuorokauden. Yhteys: vallilanlennokkikerho@gmail.com

{% for p in site.html_pages %}{% if p.title and p.permalink != "/404.html" and p.name != "README.md" and p.name != "kehitys..md" %}
## {{ p.title }}
{{ site.url }}{{ p.url }}

{{ p.content | strip_html | normalize_whitespace }}

{% endif %}{% endfor %}
