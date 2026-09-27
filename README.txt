=== Formatting Extender ===
Contributors: gauravtiwari
Donate link: https://gauravtiwari.org/donate/
Tags: gutenberg, block-editor, formatting, badge, highlight
Requires at least: 6.6
Tested up to: 7.1
Stable tag: 3.0.1
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
* Editable CSS classes with keyboard-accessible suggestions
* Theme-palette colors and badge presets
* Editor-only JavaScript, with shared lightweight content CSS

== Installation ==

1. Upload the plugin folder to `/wp-content/plugins/` or install through the WordPress plugins screen.
2. Activate the plugin through the Plugins screen.
3. Select text in the Block Editor and use the toolbar dropdown for formatting options.

== Screenshots ==

1. Select text and click the down arrow on the toolbar to see formatting options.
2. Text with badge and highlight formatting applied.

== Frequently Asked Questions ==

= Does this plugin create CSS for my classes? =
No. Your theme or another plugin must provide those styles in the editor and on the frontend. Suggestions can be supplied with the formatting_extender_css_classes PHP filter.

= Can I edit or remove classes? =
Yes. Select text (or place the caret in an existing formatted span), open CSS classes, and edit or clear them. Choose Block to edit the selected block's custom classes. Mixed text selections explicitly replace only custom classes; other formatting is preserved.

= Can I change badge and highlight colors? =
Yes. Apply the format, then open Badge appearance or Highlight appearance in the block toolbar. Choose theme colors or custom colors, preview contrast, and apply or reset. Badge presets provide Neutral, Info, Success, and Warning colors.

= What happens when I deactivate the plugin? =
Text and saved classes remain. The plugin's default CSS is no longer loaded. Explicit inline colors remain in saved content.

== Changelog ==

= 3.0.1 =
* Fixed editor iframe styling by sharing content CSS with the frontend.
* Added editing, removal, deduplication, and explicit text/block scope for CSS classes.
* Improved class suggestions, keyboard navigation, accessibility, and malformed catalog handling.
* Added theme-palette colors, contrast feedback, badge presets, and color reset.
* Added translatable UI and documented theme CSS variables.
* Corrected the minimum WordPress version to 6.6 for the generated JSX runtime.
* Added clean handling of incomplete source installations.
* Updated build tooling and added regression checks, deterministic ZIP packaging, and stable-only deployment guards.


= 3.0.0 =
* Added CSS class adder tool to the formatting toolbar
* Apply CSS classes to selected text or entire blocks
* Extensible class suggestions via `formatting_extender_css_classes` filter
* Keyboard navigation and accessible ARIA roles for suggestions
* Added ESLint configuration for WordPress coding standards

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
