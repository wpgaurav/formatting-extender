=== Formatting Extender ===
Contributors: gauravtiwari
Donate link: https://gauravtiwari.org/donate/
Tags: gutenberg, block-editor, formatting, highlight, badge, custom-css
Requires at least: 5.8
Tested up to: 6.9
Stable tag: 2.1.0
Requires PHP: 7.4
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Extends the Block Editor with inline formatting controls and per-block custom CSS functionality.

== Description ==

Formatting Extender enhances the WordPress Block Editor with powerful formatting and styling capabilities:

= Inline Formatting =

* **Highlight** - Apply a beautiful yellow gradient highlight to selected text
* **Badge** - Transform selected text into a stylish badge with a modern indigo gradient

= Per-Block Custom CSS =

Add custom CSS to any block directly from the sidebar! Each block gets its own "Custom CSS" panel where you can write scoped styles.

**How it works:**

1. Select any block in the editor
2. Open the "Custom CSS" panel in the sidebar
3. Write CSS using `{{SELECTOR}}` as the block selector placeholder
4. Your CSS is automatically scoped to that specific block

**Example:**

`{{SELECTOR}} {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 8px;
}

{{SELECTOR}} p {
  color: white;
}`

= Key Features =

* Lightweight and fast - minimal footprint
* Modern gradient designs for formatting options
* Per-block custom CSS with live preview in editor
* Secure CSS sanitization to prevent XSS attacks
* Full compatibility with WordPress 6.9
* Uses semantic HTML (`<mark>` for highlights)
* Single consolidated style output for optimal performance
* Works with all themes

== Installation ==

1. Upload the plugin folder to the `/wp-content/plugins/` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. No configuration required - start using the formatting options and custom CSS panel immediately.

== Frequently Asked Questions ==

= How do I use the formatting options? =

Select text in the Block Editor, click the dropdown arrow in the toolbar, and choose either "Highlight" or "Badge" from the formatting options.

= How do I add custom CSS to a block? =

Select any block, then look for the "Custom CSS" panel in the right sidebar. Use `{{SELECTOR}}` as a placeholder that will be replaced with the actual block selector.

= Is the custom CSS secure? =

Yes! All CSS is sanitized on the server-side to prevent XSS attacks. Dangerous patterns like JavaScript expressions, external imports, and data URLs are automatically blocked.

= Will this work with my theme? =

Yes! The plugin uses inline styles and scoped selectors, so it works consistently across all WordPress themes.

= Does custom CSS affect performance? =

The plugin is optimized for performance. All custom CSS is collected and output as a single style block in the footer, ensuring non-blocking page loads.

== Screenshots ==

1. Select text and click on the down arrow on the Toolbar
2. With formatting actions applied
3. Custom CSS panel in the block sidebar

== Changelog ==

= 2.1.0 =
* New: Per-block custom CSS panel in the sidebar
* New: Use {{SELECTOR}} placeholder for scoped block styling
* New: Live CSS preview in the editor
* New: Secure CSS sanitization (blocks XSS, JavaScript, imports)
* New: Client-side CSS validation with helpful error messages
* Performance: Single consolidated style output in footer
* Security: Comprehensive dangerous pattern detection

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

= 2.1.0 =
New feature: Add custom CSS to any block! Includes security improvements and performance optimizations.

= 2.0.0 =
Major update with WordPress 6.9 compatibility, improved design, and inline styles. Existing highlighted/badged content will continue to work.
