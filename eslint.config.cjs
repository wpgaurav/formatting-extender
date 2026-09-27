const wordpress = require( '@wordpress/eslint-plugin' );
module.exports = [
	...wordpress.configs.recommended,
	{
		files: [ 'src/**/*.{js,mjs}' ],
		settings: {
			// WordPress supplies these runtime externals; the asset manifest declares them.
			'import/core-modules': [ '@wordpress/element', '@wordpress/block-editor', '@wordpress/blocks', '@wordpress/components', '@wordpress/rich-text', '@wordpress/data', '@wordpress/compose', '@wordpress/i18n', '@wordpress/icons' ],
		},
	},
];
