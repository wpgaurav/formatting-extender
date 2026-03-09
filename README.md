# Formatting Extender

A lightweight WordPress plugin that extends the Block Editor formatting toolbar with inline controls like badges and highlights.

[![WordPress Plugin Version](https://img.shields.io/wordpress/plugin/v/formatting-extender)](https://wordpress.org/plugins/formatting-extender/)
[![WordPress Plugin Rating](https://img.shields.io/wordpress/plugin/stars/formatting-extender)](https://wordpress.org/plugins/formatting-extender/)
[![License](https://img.shields.io/badge/license-GPL--2.0%2B-blue.svg)](https://www.gnu.org/licenses/gpl-2.0.html)

## Features

- **Badge** — uppercase badge with colored background
- **Highlight** — yellow highlight behind text
- No configuration required
- Lightweight — only loads assets in the block editor

## Installation

1. Upload the plugin folder to `/wp-content/plugins/` or install through the WordPress plugins screen
2. Activate through the Plugins screen
3. Select text in the Block Editor and use the toolbar dropdown for new formatting options

## Development

```bash
npm install
npm run start    # Watch mode for development
npm run build    # Production build
./build.sh       # Create distribution ZIP
```

## Releasing

1. Update version in `formatting-extender.php`, `package.json`, and `README.txt`
2. Run `npm run build`
3. Create a GitHub release with a tag matching the version (e.g., `2.0.0` or `v2.0.0`)
4. The release workflow automatically builds the ZIP and deploys to WordPress.org

## License

GPL-2.0+ — see [LICENSE.txt](LICENSE.txt)
