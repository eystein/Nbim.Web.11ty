const path = require('path');

module.exports = {
	mode: 'production',
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
};
