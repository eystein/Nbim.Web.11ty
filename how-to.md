# How to move from Metalsmith with Handlebars into Eleventy with Nunjucks.

## Markdown 
The markdown files are what 11ty consider the Page to be displayed. It gets it's layout by pointing to a Nunjucks file. It gets rendered as a `index.html` file within a folder by the name of the file, so that the URLs are clean (without the .html file-ending.)

### Move markdown to markdown 
- Copy markdown file from nbim.web.proto repo, from inside src>html>content, into src>pages in 11ty repo.
- Note: Everything in the markdown is in YAML format in the frontmatter. YAML doesn't accept tabs, so make sure to use spaces.
- Change `layout` file-type from .html to .njk
- Replace dashes in IDs into underscores. `section-top-organising-imgUrl` -> `section_top_organising_imgUrl`.
- Replace filepaths from `../../` to `/assets/`.
  
## Layout
11ty looks for layouts and partials within the `_includes` folder by default. Each markdown page has a corresponding Nunjucks layout file. 

All the layout files refer to `_layout.njk` for the master layout. 

### Change Handlebars to Nunjucks 
- Copy Handlebars layout from src>html>layouts>example.html into src>_includes>_layouts>example.njk
- Replace `{{#extend "_layout"}}` (Handlebars) with `{% extends "../_layouts/_layout.njk" %}` (Nunjucks).
- Replace `{{#content "main"}}` (Handlebars) with `{% block main %}` (Nunjucks).
- At the bottom:
  - replace `{{/content}}` with `{% endblock %}`.
  - delete 
  ```
  {{#content "footer"}}
    {{> base/footer }}
  {{/content}}
  {{/extend}}
  ```
### Change Handlebars partials to Nunjucks macros
Handlebars allows for variables to parsed into partials, but in Nunjucks we have to use Macros for the same functionality. 

#### Handlebars - before
```hbs
{{> sections/section-top
  imgAltText=section-top-organising-imgAltText
  imgUrl=section-top-organising-imgUrl
  headline=section-top-organising-headline
  breadcrumbs=section-top-organising-breadcrumbs
}}
```

#### Nunjucks - after

The structure is the same, but the Macro needs to be imported before it is used. The property value points to the ID in the markdown file, so the dashes changes to underscores. If the partial name has a dash in it, remove it and use camelCase instead.

```njk
{% from "sections/section-top.njk" import sectionTop %}
{{
  sectionTop({
    imgAltText: section_top_organising_imgAltText,
    imgUrl: section_top_organising_imgUrl,
    headline: section_top_organising_headline,
    breadcrumbs: section_top_organising_breadcrumbs
  })    
}}
```

## Partials, a.k.a. Macros

The Macros are Nunjucks files stored in the partials folder, and organised by type; base, section etc. (This could be better organised using Atomic Design, but the time...)

A Macro is essensially a function that we pass parameters into.

```njk
{%- macro macroName(params) -%}

{%- endmacro -%}
```

### Change Handlebars markup into Nunjucks markup

Examples are with Handlebars on the first line, Nunjucks on the second line.

```
{{{ variable }}}
{{ params.variable | safe }}
```

```
{{#if variable }}
{% if params.variable %}

other code

{{/if}}
{% endif %}
```

```
{{#unless variable}}
{% if not params.variable %}

other code

{{/unless}}
{% endif %}
```

When referring to variables within a loop, the variable will be under "item" rather than "params". 
```
{{#each items}}
{% for item in params.items %}

<li>{{ item.town | safe }}</li>

{{/each}}
{% endfor %}
```

```
{{#ifCond phone-nr 'or' fax-nr }}
{% if params.phone-nr or params.fax-nr %}
```

Select the first item in a loop. Used in `contact.njk` macro.
```
{{#if @first}} selected{{/if}}
{{ 'selected' if subject.first }}
```

Sometimes there are inline partials as well. They work the same way as regular macros, but without the import, since it's in the same file.
```
{{#*inline "dl"}}
  some handlebars code
{{/inline}}

{% macro dl(params) %}
  some nunjucks code
{% endmacro %}
```

## URLs in Eleventy with Github pages

All URLs need the Eleventy `url` filter. Eleventy expects to be in the root folder, but thanks to the `pathPrefix` setting in the  [.eleventy.js](.eleventy.js) config, we can adjust for this. However this syntax is then need for URL:

```njk
{# With variable from markdown #}
{{ params.img | url }}

{# Using a string #}
{{ '/assets/images/some-image.png' | url }}

{# Example with a link #}
<a
  href={{ params.urlDownload | url }}
  class="button button--download-secondary"
>
```



Use this anywhere a URL is used, such as:
- links
- images
- video
- script
- css 