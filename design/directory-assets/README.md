# Directory branding

Created September 27, 2026 for Formatting Extender's WordPress.org listing.

The icon uses an ivory F with a yellow middle stroke on indigo. The banner pairs it with the product name and readable examples of badges, highlighting, and CSS classes. Standard and retina assets share the same composition.

## Sources and export

- `icon-master.png`: original built-in ImageGen output, 1254 square. Exported with macOS `sips` at 128 and 256 pixels without changing the composition.
- `banner.html`: editable banner source, 772 × 250 CSS pixels. Rendered with Chromium at device scales 1 and 2 and exported as PNG through CDP `Page.captureScreenshot`.
- Typography: Really Sans Large Black mapped to GTReallySans at CSS 800, and Finlandica Text. Local preview uses `fonts/ReallySansLarge-Black.otf`, `fonts/FinlandicaTextVF-latin.otf`, and the exported icon as `icon.png`. Licensed font files are not included in this repository.
- Final assets live in `.wordpress-org/`. The two icons are 128 × 128 and 256 × 256; banners are 772 × 250 and 1544 × 500.
- No plugin code, readme, release tag, ZIP, or screenshots are changed by this branding update.

## Image generation prompt

Built-in ImageGen was used for the icon; no API/CLI fallback was used. Banner text and layout are authored in HTML for exact typography and dimensions.

Use case: logo-brand. Create a finished square app icon for Formatting Extender, a WordPress inline text-formatting plugin. Exactly square 1024 by 1024 composition. Flat, crisp, exceptionally simple editorial typographic symbol, instantly legible at 128 pixels. Full-bleed solid deep indigo background (#3431a3), square canvas, no outer white margin and no rounded outer mask. Center a bold, custom geometric ivory capital F, with two thick horizontal arms and a sturdy vertical stem. Make the middle arm a warm yellow (#ffcf45) horizontal highlighter stroke extending a little beyond the white stem; its connection must still read unambiguously as one F letter. Balance the distinctive warm yellow bar with the ivory top arm. The F occupies about 58 percent of the square height, with generous even clear space. Precise aligned geometric edges, subtle tiny corner rounding only, completely flat 2D. No extra letters, no product name, no small text, no plus signs, no icons beyond the F, no gradients, no shadows, no bevel, no texture, no 3D, no mockup. This is the final logo asset, not a presentation sheet.

## Publication

Published directly to WordPress.org SVN assets in revision **3715454**, using credentials loaded from the local environment file and passed through standard input without caching. Only the four icon/banner files were committed.
