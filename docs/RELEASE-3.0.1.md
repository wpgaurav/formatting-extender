# Formatting Extender 3.0.1 release preparation

Prepared September 27, 2026. This is a tested release candidate, not a published release. No release tag or WordPress.org deployment has been created.

## Changes

- Share badge/highlight CSS between the editor iframe and frontend; retain existing format classes and default appearance.
- Inspect, replace, deduplicate, and clear inline or block CSS classes. Caret editing expands only the active span, and mixed selections preserve links and other formats.
- Replace delayed/stale suggestions with immediate validated matching, keyboard controls, linked combobox/listbox ARIA semantics, and result announcements.
- Add theme-palette/custom foreground/background colors, badge presets, reset, and explicit contrast feedback. Colors survive author-level sanitization.
- Translate user-facing strings and register script translations; document the class filter and theme CSS variables.
- Correct the WordPress minimum to 6.6. Detect incomplete builds before enqueueing assets and show an administrator diagnostic.
- Upgrade the build toolchain, migrate ESLint to flat configuration, and resolve the audited development dependency advisories. Narrow overrides cover serialize-javascript 7.0.5, sockjs's uuid 11.1.1, and express's qs 6.16.0. Required CommonJS APIs were smoke-tested; build/lint pass after a clean install.
- Assemble packages through one fresh-build, allowlisted, deterministic-metadata path. Include license, lowercase readme, generated manifest, and styles. Validate all release versions.
- Add branch/PR checks. Stable release deployment consumes the verified ZIP's extracted files; prereleases cannot deploy to WordPress.org.

## Local verification

- Clean dependency installation, JavaScript lint, 6 focused Node test groups, PHP syntax, production build, and 3 package regression tests pass.
- `npm audit` reports **0 vulnerabilities** for the final lockfile at preparation time.
- Studio MCP integration checks pass on WordPress **7.1.2** and **6.6**, including every generated runtime dependency, translations, class-catalog normalization, missing-manifest handling, and author-role save sanitization.
- Latest-version Studio site: `Formatting Extender QA`, `http://localhost:8929`, native PHP 8.4. Minimum-version Studio site: `Formatting Extender WP66 QA`, `http://localhost:8931`, pinned WordPress 6.6, web PHP 8.2.33. Studio WP-CLI itself uses PHP 8.4.25.
- Chrome UI: keyboard suggestions; existing-class inspection; caret editing; token deduplication; clear; text/block scope; block undo/redo; mixed selections preserving links/bold; badge presets; highlight theme-palette colors; color reset; save/reload on both WordPress versions.
- Twenty Twenty-Five and Twenty Twenty-One: formatted content and controls render in the Post Editor. Site Editor iframe loads and renders shared format styles. No plugin JavaScript errors observed.
- Desktop/mobile frontend computed-style inspection confirms default and custom badge/highlight colors. RTL editor verification loads `build/index-rtl.css`; temporary locale changes were restored.
- Studio block validation: **8/8 blocks valid**, no serialization fixes needed after browser saves.
- WordPress Plugin Check 2.1.0: **no errors found**.
- The installed plugin files are compared byte-for-byte with the final ZIP on both dedicated Studio sites.

The in-app browser left WordPress's blob-based editor iframe blank. Chrome rendered the same page correctly, so editor UI evidence uses Chrome. One WordPress global-styles iframe warning was observed; no Formatting Extender error accompanied it.

## Review evidence

Local screenshots are kept in ignored `artifacts/`: `badge-appearance.png`, `site-editor.png`, `mobile-editor.png`, and `rtl-editor.png`. The dedicated test sites remain available. The QA catalog MU-plugin and fixture pages belong only to those sites and are not in the release ZIP.

Automated checks do not replace a manual assistive-technology audit. Keyboard behavior and ARIA relationships were checked; VoiceOver/NVDA sessions were not run. Full WordPress runtime testing on PHP 7.4 is not available in this Studio installation; CI checks package PHP syntax on 7.4. No production site or WordPress.org installation has been changed.

## Package

`dist/formatting-extender-3.0.1.zip` and `dist/formatting-extender-3.0.1.zip.sha256` are the local deliverables. The checksum file is authoritative; the final package hash will also be recorded in the handoff. Build with `bash build.sh v3.0.1`.

## Publication steps

1. Review and merge the release-preparation PR after CI succeeds.
2. Publish tag/release `v3.0.1` from the reviewed commit when release is authorized.
3. Confirm the release workflow and SVN deployment, GitHub asset/checksum, WordPress.org version/readme, and a clean download/install before announcing availability.

Ordinary pushes run checks only. The existing public 3.0.0 release remains unchanged.
