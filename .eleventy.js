module.exports = function (eleventyConfig) {
	eleventyConfig.addWatchTarget('./src/scss/');
	eleventyConfig.addWatchTarget('./src/js/');

	return {
		dataTemplateEngine: 'njk',
		markdownTemplateEngine: 'njk',
		htmlTemplateEngine: 'njk',
		templateFormats: ['njk', 'md'],
		dir: {
			input: 'src',
			output: 'docs',
		},
	};
};
