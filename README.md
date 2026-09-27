# Formatting Extender

A lightweight WordPress plugin for badges, highlights, and custom CSS classes in the Block Editor. Requires WordPress 6.6+ and PHP 7.4+.

[![WordPress Plugin Version](https://img.shields.io/wordpress/plugin/v/formatting-extender)](https://wordpress.org/plugins/formatting-extender/)
[![License](https://img.shields.io/badge/license-GPL--2.0%2B-blue.svg)](https://www.gnu.org/licenses/gpl-2.0.html)

## Features

- **Badge and Highlight:** one-click formatting with the existing defaults.
- **Appearance controls:** theme colors, custom colors, four badge presets, contrast feedback, and reset. Apply a format first, then open its appearance control in the block toolbar.
- **CSS classes:** inspect, edit, deduplicate, or clear classes on selected text or the selected block. The control expands a caret inside an existing custom span to that span; mixed selections explicitly replace custom classes only.
- **Accessible suggestions:** immediate local matching, arrow-key navigation, Enter to choose, Tab for normal focus navigation, and Escape to dismiss suggestions or close the popover.
- No settings page or database tables. JavaScript loads only in the editor; one small content stylesheet is shared with the frontend and editor canvas.

Custom classes need CSS supplied by your theme or another plugin. They are not a CSS generator. Clearing block classes edits the block's complete custom-class field; clearing text classes removes only the Formatting Extender class format.

## Install

Install the WordPress.org plugin or upload the ZIP from a GitHub release. Source archives do not contain compiled assets; developers must build first. Existing `.fe-badge`, `.fe-highlight`, and `.fe-styled` content is preserved without migration.

## Suggest classes

Add this to your theme or a small integration plugin:

```php
add_filter( 'formatting_extender_css_classes', function ( $classes ) {
    $classes['Typography'] = array( 'text-accent', 'text-small', 'md:text-sm' );
    return $classes;
} );
```

The catalog is a category-to-array-of-string-tokens map. Invalid entries and duplicate suggestions are ignored. Utility punctuation is preserved. Supply the corresponding CSS on both editor and frontend, for example with `enqueue_block_assets` on supported WordPress versions.

## Theme overrides

Set these properties in a stylesheet loaded on both surfaces. Defaults retain the old appearance. Explicit colors saved through the appearance control take precedence.

```css
:root {
    --fe-badge-background: #3333aa;
    --fe-badge-color: #fff;
    --fe-badge-font-size: 13px;
    --fe-badge-text-transform: uppercase;
    --fe-highlight-background: #f7dc48;
    --fe-highlight-color: #111;
}
```

Use `--fe-badge-font-size: 0.85em` to follow surrounding typography. Theme variables can override defaults, so verify contrast in your actual theme when leaving a color unset. Preset labels are editing conveniences; write meaningful badge text instead of relying on color alone.

## Development

Use Node 24.15+ (24.x) or Node 26+, Python 3.9+, and PHP CLI.

```bash
npm ci
npm run start
npm run lint:js
npm test
bash build.sh
python3 -m unittest discover -s tests -p '*_test.py'
```

`build.sh` always rebuilds and validates required assets and version metadata. It produces `dist/formatting-extender-<version>.zip` and its SHA-256 checksum. Packaging uses an explicit file allowlist and deterministic ZIP metadata. `tests/studio-check.php` is an integration check for a dedicated local Studio site with the ZIP installed; it temporarily removes/restores the manifest to test incomplete installations.

## Releases

1. Update the PHP header/constant, package/lockfile versions, readme stable tag, and changelog together.
2. Run local checks, install the exact ZIP on Studio, and complete editor/frontend QA and Plugin Check.
3. Review the release evidence in `docs/RELEASE-3.0.1.md` before publishing.
4. Publish a matching stable GitHub tag/release only when ready. The workflow validates source, creates the ZIP, then deploys the same extracted file set to WordPress.org.

Prerelease events or non-stable version tags cannot deploy to WordPress.org. Ordinary branch pushes run checks only. Do not describe a prepared local package as a public release.

## Support this project

Formatting Extender is free and open source. If it saves you repetitive formatting work, [buy me a coffee](https://buymeacoffee.com/gauravtiwari) or [report an issue](https://github.com/wpgaurav/formatting-extender/issues) with your WordPress version, block, and reproduction steps.

## License

GPL-2.0-or-later. See [LICENSE.txt](LICENSE.txt).
