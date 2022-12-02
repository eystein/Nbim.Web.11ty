# Static HTML library for NBIM

This project uses Eleventy with Markdown and Nunjucks to create static HTML pages for BV Network to implement in Optimizely.

The rendered pages are output in the `docs/` folder which is shown as github pages.

CSS and JavaScript are compiled into the `static/` folder which gets served as a GitHub/Node package. 

## Old versions

The previous version of this project was made by Netlife, and is available on [Nbim.Web.Proto](https://github.com/BVNetwork/Nbim.Web.Proto). And an *even older* version is at [Nbim.Web.Legacy](https://github.com/BVNetwork/Nbim.Web.Legacy). 

Nbim.Web.Proto can be viewed at [https://nbim-proto-2018.firebaseapp.com/alle-sider.html](https://nbim-proto-2018.firebaseapp.com/alle-sider.html). We do not have access to Firebase.

## Dev & build tools

### Eleventy

Eleventy, a.k.a 11ty, is a static site builder. It handles serving the site on localhost, and building the `docs/` folder.

View the [.eleventy.js](.eleventy.js) file for the Eleventy config.

Eleventy documentation: [https://www.11ty.dev/docs/](https://www.11ty.dev/docs/)

### CSS 

The CSS is written in Sass, and compiled by Sass Node package.

### JavaScript

Straight up JavaScript files, which are minified and combined by WebPack. This is the only job Webpack has in this project, for now.

### Markdown and Nunjucks

The root of the project are the Markdown files within [src/pages/](src/pages/). All the contents are formatted as YAML within the Markdown frontmatter. 

The Markdown files use Nunjucks to convert into HTML files. All of Nunjucks is localed within [src/_includes/](src/_includes/). Each markdown Page has a corresponding Nunjucks layout file within `src/_includes/layouts/`. 

 Nunjucks templating documentation: [https://mozilla.github.io/nunjucks/templating.html](https://mozilla.github.io/nunjucks/templating.html). 

## Convert from Handlebars to Nunjucks

This project is being converted from Metalsmith to Eleventy for futureproofing. 

A how-to for converting is here: [How to move from Metalsmith with Handlebars into Eleventy with Nunjucks.](how-to.md).

## Local install

Install node modules.

```
npm install
```

Run local dev server with live reload.
```
npm run dev
```


## Developers

- Eystein Mack Alnæs
- Knut Sorknes
- Hanne Edfelt