module.exports = function (eleventyConfig) {
	// Also watch for changes in these folders in dev mode
	eleventyConfig.addWatchTarget('./src/scss/');
	eleventyConfig.addWatchTarget('./src/js/');

	// Copy contents from `./src/src/..` to `./docs/assets/...`
	eleventyConfig.addPassthroughCopy({ './src/fonts': './assets/fonts' });
	eleventyConfig.addPassthroughCopy({ './src/icons': './assets/icons' });
	eleventyConfig.addPassthroughCopy({ './src/images': './assets/images' });
	eleventyConfig.addPassthroughCopy({ './src/videos': './assets/videos' });

	eleventyConfig.addFilter('testFilter', function (text) {
		return '***' + text + '***';
	});

	return {
		// Set Nunjucks as default
		dataTemplateEngine: 'njk',
		markdownTemplateEngine: 'njk',
		htmlTemplateEngine: 'njk',
		templateFormats: ['njk', 'md'],
		passthroughFileCopy: true,
		dir: {
			// Custom paths for in- and output
			input: 'src/pages',
			output: 'docs',
			// Specify where partials and layouts are
			// Path relative to Pages directory
			includes: '../../src/_includes/_partials',
			layouts: '../../src/_includes/_layouts',
			data: '../../src/_data',
		},
	};
};
