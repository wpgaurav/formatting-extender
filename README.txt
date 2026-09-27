=== Formatting Extender ===
Contributors: gauravtiwari
Donate link: https://buymeacoffee.com/gauravtiwari
Tags: gutenberg, block-editor, formatting, badge, highlight
Requires at least: 6.6
Tested up to: 7.1
Requires PHP: 7.4
Stable tag: 3.0.1
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Apply CSS classes to selected text or whole blocks, with class suggestions, inline badges, highlights, and theme-palette colors.

== Description ==

Formatting Extender brings your site's CSS classes into the WordPress Block Editor. Apply a class to a few words or a whole block, reuse classes suggested by your theme, and add inline badges or highlights without switching to the code editor.

= What you can do =

* **Style selected text or a block:** choose the scope, inspect existing classes, edit them, or clear them. Repeated class names are removed automatically.
* **Find your theme's classes:** developers can supply categorized suggestions through the `formatting_extender_css_classes` filter. Use the arrow keys to browse suggestions and Enter to choose one.
* **Add inline badges:** give short labels such as New, Updated, or Important their own background without creating another block.
* **Highlight useful details:** emphasize a phrase while keeping it in the surrounding paragraph, heading, list item, or button text.
* **Choose colors:** use your theme's palette or custom text and background colors. Badge presets include Neutral, Info, Success, and Warning, with a preview, contrast feedback, and a reset control.
* **Keep existing formatting:** custom class edits preserve links, bold text, and other formats. Existing badge, highlight, and custom-class content needs no migration.

There is no settings page, account requirement, or separate dashboard. The editing JavaScript loads only in the Block Editor. A small shared stylesheet displays the built-in badge and highlight styles on the frontend and inside the editor canvas.

Formatting Extender assigns class names; your theme or another plugin supplies their CSS. Built-in badges and highlights work immediately. Developers can adjust their defaults through documented CSS variables.

Development happens in the open on [GitHub](https://github.com/wpgaurav/formatting-extender), where bug reports and pull requests are welcome.

= Links =

* [Formatting Extender Home](https://gauravtiwari.org/product/formatting-extender/) - features, screenshots, and usage examples.
* [Changelog](https://github.com/wpgaurav/formatting-extender/releases) - release notes and downloadable packages.
* [Feature Requests and Bug Reports](https://github.com/wpgaurav/formatting-extender/issues) - report a problem or suggest an improvement.
* [WordPress.org Support](https://wordpress.org/support/plugin/formatting-extender/) - get help with the plugin.
* [Community](https://gauravtiwari.org/portal/) - ask questions and share your WordPress work.
* [More WordPress Plugins](https://gauravtiwari.org/wordpress-plugins/) - other plugins by Gaurav Tiwari.

== Installation ==

1. In WordPress, open Plugins > Add New, search for Formatting Extender, and install it. You can also upload the release ZIP.
2. Activate Formatting Extender through the Plugins screen.
3. Open a post or page in the Block Editor and select the text you want to format.
4. Open the toolbar's More menu to apply Badge or Highlight. Open CSS classes in the block toolbar to apply your own classes to selected text or the block.
5. After applying a badge or highlight, open its appearance control in the block toolbar to choose or reset colors.

== Frequently Asked Questions ==

= Does this plugin create CSS for my classes? =

No. Your theme or another plugin must provide those styles in both the editor and on the frontend. Built-in badges and highlights include their own styles.

= Where do class suggestions come from? =

Your theme or an integration plugin can supply categorized class names through the `formatting_extender_css_classes` PHP filter. Formatting Extender does not scan your stylesheets automatically. See the [developer documentation](https://github.com/wpgaurav/formatting-extender#suggest-classes) for an example.

= Can I edit or remove existing classes? =

Yes. Select text, or place the caret inside an existing custom-class span, then open CSS classes to inspect, edit, or clear it. Choose Block to edit the selected block's custom-class field. Mixed text selections replace only their custom classes; links and other formatting stay intact. Clearing block classes clears that block's complete custom-class field.

= Can I change badge and highlight colors? =

Yes. Apply the format, then open Badge appearance or Highlight appearance in the block toolbar. Choose theme colors or custom colors, preview the result, and apply or reset. Badge presets offer Neutral, Info, Success, and Warning colors. Check contrast in your theme when leaving a color unset.

= Does it work with the Classic Editor or page builders? =

The controls are designed for the WordPress Block Editor. They are not added to the Classic Editor or a page builder's separate editing interface. Saved formatting can still display wherever the resulting WordPress content is rendered.

= Does it work in the Site Editor? =

The plugin loads its controls and shared styles in the Block Editor, including the Site Editor. Available formatting depends on the selected block and its editing permissions. It does not unlock restricted blocks.

= What happens when I deactivate the plugin? =

Your text and saved classes remain. The plugin's default badge and highlight stylesheet stops loading. Explicit inline colors remain in saved content, and custom classes continue to use whatever CSS your theme provides.

= Is there a paid version or an account requirement? =

No. Formatting Extender is free and open source. No account, license key, or external service is required.

== Screenshots ==

1. Apply CSS classes to selected text with categorized suggestions supplied by the theme.
2. Inline badges, highlights, custom text classes, and a paragraph styled with a block class. The theme supplies the purple text and note styles.
3. Apply a CSS class to an entire paragraph from the block toolbar.

== External Services ==

Formatting Extender does not contact external services or collect telemetry. Formatting and class suggestions run locally in the editor, and the plugin's styles are served from your WordPress installation.

== Upgrade Notice ==

= 3.0.1 =
Requires WordPress 6.6 or later. Adds class editing and removal, color controls, and consistent editor styling. Existing saved formatting is preserved; no content migration is needed.

== Changelog ==

The complete release history is available on the [Formatting Extender changelog](https://github.com/wpgaurav/formatting-extender/releases).

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
