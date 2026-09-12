# Formatting Extender

A lightweight WordPress plugin that extends the Block Editor formatting toolbar with inline controls like badges and highlights.

[![WordPress Plugin Version](https://img.shields.io/wordpress/plugin/v/formatting-extender)](https://wordpress.org/plugins/formatting-extender/)
[![WordPress Plugin Rating](https://img.shields.io/wordpress/plugin/stars/formatting-extender)](https://wordpress.org/plugins/formatting-extender/)
[![License](https://img.shields.io/badge/license-GPL--2.0%2B-blue.svg)](https://www.gnu.org/licenses/gpl-2.0.html) [![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-FFDD00?style=flat&logo=buymeacoffee&logoColor=black)](https://buymeacoffee.com/gauravtiwari)

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

## Support This Project

Formatting Extender adds Badge and Highlight formats to the WordPress Block Editor toolbar with nothing to configure, and it is free and open source. I keep it light by loading its assets only inside the block editor, and every release I tag on GitHub goes out to WordPress.org.

If it saved you from writing a custom CSS class every time a post needed a badge or a highlight, you can buy me a coffee.

<a href="https://buymeacoffee.com/gauravtiwari"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy me a coffee" height="50"></a>

I appreciate a star on the repo, and even more an issue with your WordPress version, the block you were in and what happened when you applied the format.

## License

GPL-2.0+ — see [LICENSE.txt](LICENSE.txt)
