=== Formatting Extender ===
Contributors: gauravtiwari
Donate link: https://gauravtiwari.org/donate/
Tags: gutenberg, block-editor, formatting, highlight, badge
Requires at least: 5.8
Tested up to: 6.9
Stable tag: 2.0.0
Requires PHP: 7.4
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Extends the Block Editor formatting toolbar with inline formatting controls like badges and highlights.

== Description ==

Formatting Extender adds two new inline formatting options to the WordPress Block Editor toolbar:

* **Highlight** - Apply a beautiful yellow gradient highlight to selected text
* **Badge** - Transform selected text into a stylish badge with a modern indigo gradient

The plugin uses inline styles for better performance and compatibility, eliminating the need for external CSS files.

= Features =

* Lightweight and fast - no external CSS dependencies
* Modern gradient designs for both highlight and badge formats
* Full compatibility with WordPress 6.9 and the latest Block Editor
* Uses semantic HTML (`<mark>` for highlights, `<span>` for badges)
* Styles are applied inline, ensuring consistent display across all themes

== Installation ==

1. Upload the plugin folder to the `/wp-content/plugins/` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. There is no additional configuration required. There will not be any menus or settings for this plugin.

== Frequently Asked Questions ==

= How do I use the formatting options? =

Select text in the Block Editor, click the dropdown arrow in the toolbar, and choose either "Highlight" or "Badge" from the formatting options.

= Will this work with my theme? =

Yes! The plugin uses inline styles, so it works consistently across all WordPress themes.

== Screenshots ==

1. Select text and click on the down arrow on the Toolbar
2. With Actions applied

== Changelog ==

= 2.0.0 =
* Major update for WordPress 6.9 compatibility
* Migrated from wp-editor to wp-block-editor API
* Replaced CSS classes with inline styles for better performance
* Improved design with modern gradient styling
* Highlight now uses semantic `<mark>` element
* Badge features new indigo gradient with subtle shadow
* Removed external CSS file dependency
* Added proper PHP version requirement (7.4+)
* Updated minimum WordPress requirement to 5.8
* Code cleanup and improved documentation

= 1.0.3 =
* Improvements

= 1.0.2 =
* WordPress 5.8 Compatibility

= 1.0.1 =
* Better and unique CSS classes to prevent conflict

= 1.0.0 =
* First version

== Upgrade Notice ==

= 2.0.0 =
Major update with WordPress 6.9 compatibility, improved design, and inline styles. Existing highlighted/badged content will continue to work.
