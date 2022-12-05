const path = require('path');

// For the static site
const siteConfig = {
	mode: 'production',
	name: 'siteConfig',
	entry: {
		main: './src/js/main.js',
		print: './src/js/print.js',
		edit: './src/js/edit.js',
		sync: './src/js/sync.js',
	},
	output: {
		filename: 'assets/js/11ty-[name].js',
		path: path.resolve(__dirname, './docs'),
		publicPath: '/docs/',
	},
}

// For the NPM package
const packageConfig = {
	mode: 'production',
	name: 'packageConfig',
	entry: {
		main: './src/js/main.js',
		print: './src/js/print.js',
		edit: './src/js/edit.js',
		sync: './src/js/sync.js',
	},
	output: {
		filename: 'js/11ty-[name].js',
		path: path.resolve(__dirname, './static'),
		publicPath: '/static/',
	},
};

module.exports = [siteConfig, packageConfig]
