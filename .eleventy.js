module.exports = function (eleventyConfig) {
	// Also watch for changes in these folders in dev mode
	eleventyConfig.addWatchTarget('./src/scss/');
	eleventyConfig.addWatchTarget('./src/js/');

	// Copy contents from `./src/src/..` to `docs/assets/...`
	eleventyConfig.addPassthroughCopy({ './src/fonts': './assets/fonts' });
	eleventyConfig.addPassthroughCopy({ './src/icons': './assets/icons' });
	eleventyConfig.addPassthroughCopy({ './src/images': './assets/images' });
	eleventyConfig.addPassthroughCopy({ './src/videos': './assets/videos' });

	return {
		// Set Nunjucks as default
		dataTemplateEngine: 'njk',
		markdownTemplateEngine: 'njk',
		htmlTemplateEngine: 'njk',
		templateFormats: ['njk', 'md'],
		dir: {
			// Custom paths for
			input: 'src/pages',
			output: 'docs',
			includes: 'src/_includes/',
		},
	};
};
