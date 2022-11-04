module.exports = function (eleventyConfig) {
	// Also watch for changes in these folders in dev mode
	eleventyConfig.addWatchTarget('./src/scss/');
	eleventyConfig.addWatchTarget('./src/js/');

	// Copy contents from `./src/..` to `docs/...`
	// Keeps the same directory structure
	eleventyConfig.addPassthroughCopy('./src/fonts');
	eleventyConfig.addPassthroughCopy('./src/icons');
	eleventyConfig.addPassthroughCopy('./src/images');
	eleventyConfig.addPassthroughCopy('./src/videos');

	return {
		// Set Nunjucks as default
		dataTemplateEngine: 'njk',
		markdownTemplateEngine: 'njk',
		htmlTemplateEngine: 'njk',
		templateFormats: ['njk', 'md'],
		dir: {
			// Custom paths for
			input: 'src/content',
			output: 'docs',
			includes: 'src/_includes/',
		},
	};
};
