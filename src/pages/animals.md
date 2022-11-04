---
title: Animals
---

{% include '_head.njk' %}

<h1>{{ title }}</h1>
<ul>
    {% for animal in mammals.animalList -%}
    <li>{{ animal }}</li>
    {% endfor -%}
</ul>
{% include '_foot.njk' %}
