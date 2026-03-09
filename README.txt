=== Formatting Extender ===
Contributors: gauravtiwari
Donate link: https://gauravtiwari.org/donate/
Tags: gutenberg, block-editor, formatting, badge, highlight
Requires at least: 6.0
Tested up to: 6.9.1
Stable tag: 2.0.0
Requires PHP: 7.4
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Extends the Block Editor formatting toolbar with inline controls: badge, highlight, and more.

== Description ==

Formatting Extender adds new inline formatting options to the WordPress Block Editor toolbar. Select any text and apply badge or highlight formatting with one click.

**Features:**

* **Badge** — Wraps text in an uppercase badge with colored background
* **Highlight** — Adds a yellow highlight behind text
* Zero configuration, no settings pages
* Lightweight — only loads in the block editor

== Installation ==

1. Upload the plugin folder to `/wp-content/plugins/` or install through the WordPress plugins screen.
2. Activate the plugin through the Plugins screen.
3. Select text in the Block Editor and use the toolbar dropdown for formatting options.

== Screenshots ==

1. Select text and click the down arrow on the toolbar to see formatting options.
2. Text with badge and highlight formatting applied.

== Changelog ==

= 2.0.0 =
* Modernized build system with @wordpress/scripts
* Migrated JS to ESNext/JSX with proper WordPress imports
* Replaced deprecated wp-editor dependency with wp-block-editor and wp-rich-text
* Frontend CSS now properly enqueued via wp_enqueue_scripts (removed wp_footer inline hack)
* Added proper WordPress icons for toolbar buttons
* Active state indicator on toolbar buttons
* Bumped minimum WordPress to 6.0, minimum PHP to 7.4

= 1.0.3 =
* Improvements

= 1.0.2 =
* WordPress 5.8 Compatibility

= 1.0.1 =
* Better and unique CSS classes to prevent conflicts.

= 1.0.0 =
* First version
