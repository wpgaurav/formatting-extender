# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Plugin Does

Formatting Extender is a WordPress Block Editor plugin that adds inline formatting options (Badge, Highlight) to the RichText toolbar. Zero configuration, no database usage, no settings pages.

## Architecture

**PHP** (`formatting-extender.php`): Two hooks only:
- `enqueue_block_editor_assets` — enqueues JS/CSS for the editor
- `wp_footer` — inlines frontend CSS (duplicated from `css/styles.css`)

**JS** (`js/badge.js`, `js/highlight.js`): Each file registers a `registerFormatType` with a `RichTextToolbarButton` that toggles a `<span>` with a CSS class (`fe-badge`, `fe-highlight`).

**CSS** (`css/styles.css`): Editor styles. Frontend styles are duplicated as inline CSS in `wp_footer`.

Dependencies: `wp-blocks`, `wp-element`, `wp-components`, `wp-editor` (legacy — should migrate to `wp-block-editor`, `wp-rich-text`).

## Build & Release

```bash
# Create distribution ZIP (reads version from plugin header)
bash build.sh

# Release: tag a version matching the plugin header, create GitHub release
# GitHub Actions (.github/workflows/release.yml) handles:
#   1. Build + ZIP + checksums → GitHub release assets
#   2. Deploy to WordPress.org SVN (needs SVN_USERNAME/SVN_PASSWORD secrets)
```

No npm/webpack build — JS files are plain ES5 using `wp.` globals directly. No build step required for development.

## Modernization Reference

The Marketers Delight `block-enhancements` dropin (`/Users/gauravtiwari/Development/Antigravity/marketers-delight-local/md-dropins/block-enhancements/`) is the reference for modernizing this plugin:
- Uses `@wordpress/scripts` for bundling (`npm run build` / `npm run start`)
- Proper `registerFormatType` with popover UIs
- `wp_localize_script` for passing PHP data to JS
- `build/index.asset.php` for auto-generated dependencies
- Features: Icon Picker (`md/insert-icon`) and CSS Class Suggester (`md/add-class`)

## Key Improvement Areas

1. **Build system**: Add `@wordpress/scripts` — replace raw JS with proper JSX/ESNext build
2. **Dependencies**: `wp-editor` is deprecated; use `wp-block-editor` and `wp-rich-text`
3. **Frontend CSS**: Eliminate `wp_footer` inline duplication; use `wp_enqueue_style` with proper frontend enqueueing
4. **Customization**: Add color pickers for badge/highlight colors via `InspectorControls` or popover UI
5. **Block support**: Consider converting to block supports API or adding more format types

## WordPress Plugin Conventions

- Version constant: `FORMATTING_EXTENDER_VERSION`
- Text domain: `formatting-extender`
- CSS class prefix: `fe-`
- Format type namespace: `formatting-extender/`
- WordPress.org assets: `.wordpress-org/` directory
