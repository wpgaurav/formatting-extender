# Formatting Extender improvement plan

Implementation update: the concrete improvements below are implemented for 3.0.1. See `docs/RELEASE-3.0.1.md` for actual scope and verification. Optional developer filters remain deferred until an integration needs them. The remainder of this file preserves the original planning snapshot.

Planning snapshot: September 27, 2026. Repository: `wpgaurav/formatting-extender`, branch `main`, commit `3d934b1bc70c292574635da43fa3b189c6f9e555`, plugin version `3.0.0`.

This is a proposed implementation sequence. No runtime changes, release, or deployment are included in this planning pass.

## Direction

Keep Formatting Extender a small, zero-configuration inline-formatting plugin. Make Badge, Highlight, and CSS Class reliable, reversible, accessible, and consistent between editing and published content. Then add theme-aware presentation controls. Preserve existing saved markup and avoid a settings dashboard, database tables, frontend JavaScript, or a general-purpose CSS editor.

The existing modernization work is already done: JSX, `@wordpress/scripts`, current package imports, generated asset dependencies, and frontend stylesheet enqueueing. `CLAUDE.md` describes the older architecture and should not drive duplicate work. No roadmap, automated test suite, open GitHub issues, or open PRs were found.

## Baseline verification

| Check | Result |
| --- | --- |
| `npm ci --ignore-scripts --no-audit --no-fund` | Passed; dependency deprecation warnings |
| `npm run build` | Passed; generated JS is 4,659 bytes, editor CSS 1,003 bytes |
| `wp-scripts lint-js src` | Passed; current rules do not establish translation or functional coverage |
| `php -l` on all three source PHP files | Passed on local PHP 8.5.10 |
| `bash -n build.sh` and `bash build.sh` | Passed; local installable ZIP assembled and inspected |
| `npm audit --json` | Reported 71 dependency advisories: 4 low, 29 moderate, 36 high, 2 critical; requires build-tool triage, not a finding of 71 shipped plugin vulnerabilities |
| Generated dependency manifest | Includes `react-jsx-runtime`, `wp-data`, and `wp-primitives` |
| WordPress editor/browser testing | Not performed; no WordPress runtime is included in this checkout |
| GitHub release metadata | Latest listed stable release is `v3.0.0`; WordPress.org installation/deployment state not verified |

Local Node is 26.8.2; the release workflow uses Node 20. A local build pass does not prove the CI environment or declared minimum WordPress/PHP versions work. Generated dependencies, build output, and the local ZIP are ignored files, not proposed source changes.

## Milestone 1: Compatibility and release reliability

Treat this as release-blocking maintenance. Suggested patch scope: 3.0.1, subject to the compatibility decision below.

### 1. Correct the WordPress compatibility contract

**Evidence:** `formatting-extender.php:17` and `README.txt` advertise WordPress 6.0. The actual build produces a `react-jsx-runtime` dependency, introduced in WordPress 6.6. This is a confirmed dependency/metadata mismatch; failure on an older installation has not been browser-reproduced. WordPress documents the build-tool change in [JSX in WordPress 6.6](https://make.wordpress.org/core/2024/06/06/jsx-in-wordpress-6-6/).

**Recommendation:** retain the modern build and declare a minimum of at least 6.6, after checking every emitted dependency and UI API on that version. If supporting 6.0 remains a product requirement, explicitly configure a compatible JSX transform and audit all other APIs instead. Do not claim 6.6 compatibility solely because the JSX dependency is available there.

**Done when:** a clean packaged installation works on the selected minimum and the current stable WordPress version; header/readme requirements agree; all emitted script handles resolve. Update `Tested up to` only after testing.

### 2. Share content styles across the frontend and editor iframe

**Evidence:** badge/highlight rules are duplicated in `src/editor.css` and `css/styles.css`. The editor stylesheet is loaded through `enqueue_block_editor_assets` and lacks the compatibility selectors described in the WordPress documentation. This creates a strong iframe styling risk requiring live reproduction.

**Work:** keep popover/control CSS editor-only; make badge/highlight rules one shared stylesheet loaded for content through the supported asset hook. Follow [WordPress editor asset guidance](https://developer.wordpress.org/block-editor/how-to-guides/enqueueing-assets-in-the-editor/) and the minimum version selected above. Preserve existing `.fe-badge` and `.fe-highlight` output.

**Done when:** Post Editor, Site Editor, and published content show the same formats in a block theme and a classic theme. Verify narrow viewports, RTL, links, and wrapped selections. No frontend JavaScript is introduced. Keep the tiny shared CSS globally available initially; conditional loading must not miss Query Loops, templates, or synced patterns.

### 3. Make packages reproducible and deployment deliberate

**Evidence:** `.github/workflows/release.yml` deploys after `release: published` without checking `release.prerelease`. The deploy job rebuilds separately from the GitHub ZIP. `build.sh` builds only when `build/index.js` is absent, so it can package stale code. Local and CI packaging use different inclusion rules; both omit `LICENSE.txt`. CI checks only the plugin header against the tag.

**Work:**

- Gate WordPress.org deployment on a stable version and a non-prerelease event. Allow prerelease ZIPs without SVN deployment.
- Use one package assembly/validation path locally and in CI; build from clean source and deploy the same verified file set used for the release ZIP.
- Require JS, dependency manifest, shared CSS, editor CSS, plugin entry point, readme, and license. Fail on missing required files rather than skipping them.
- Compare tag, PHP header, PHP version constant, package version, lockfile root version, and readme stable tag for stable releases.
- Exclude development configuration from distributions. Retain SHA-256 verification and validate extracted package contents.
- Add pull-request checks for lint, build, PHP syntax, focused tests, and package validation. Select and pin a supported Node version after checking toolchain requirements.
- Review dependency advisories and update the build toolchain/lockfile in a separate, testable change. The audit proposes a major `@wordpress/scripts` upgrade; do not run a forced automatic fix. Dependencies are declared as development-only and `node_modules` is excluded from distribution, but inspect emitted bundles and CI exposure before dismissing any advisory. Refresh stale browser compatibility data with the tooling update.

**Done when:** a stale/missing asset fails packaging; a mismatched version fails validation; prereleases cannot enter the SVN deploy job; local/CI package file manifests agree. Test workflow decisions without publishing a real release.

### 4. Fail cleanly if built files are missing

**Evidence:** `formatting-extender.php:38` calls `filemtime()` on `build/index.js` when the asset manifest is missing. A source-only installation can therefore emit a warning and request a missing script. The fallback dependency list also omits dependencies emitted by the actual build.

**Work:** require readable build files before enqueueing. Show a capability-scoped admin diagnostic for an incomplete installation; do not guess dependency metadata or leak local filesystem paths in public output.

**Done when:** a source checkout without assets produces neither PHP warnings nor broken script requests; a valid distribution loads normally.

## Milestone 2: Complete the CSS Class tool

Suggested minor scope: 3.1.0. Primary implementation area: `src/add-class/`.

### 5. Add inspection, editing, and removal

**Evidence:** the input always starts empty; inline application uses `applyFormat` with no removal path; block classes are appended without deduplication (`AddClass.js:92-115`). Applying `one` to a block already containing `one` yields `one one`.

**Work:** display current classes; normalize whitespace and deduplicate tokens; support adding/removing individual tokens and an explicit clear action for this format. Preserve unrelated formats, links, and block classes. Distinguish selection scope from block scope visibly, and define behavior for mixed selections. Respect block `customClassName` support and editing locks before changing block attributes. Verify selection/focus restoration and undo/redo. The block support contract is documented [here](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/).

Do not silently strip utility syntax such as `md:text-sm`; class tokens and CSS selectors have different escaping requirements. Avoid bulk content migrations or changing the existing `fe-styled` format marker.

**Done when:** existing formatted text can be reopened, edited, cleared, saved, and reloaded without invalid blocks or lost markup; repeated application is idempotent; unsupported/locked blocks are handled explicitly.

### 6. Repair autocomplete behavior and accessibility

**Evidence:** matching waits one second; old suggestions remain during that wait; `getLastWord('one ')` returns `one`, and tab-separated tokens are not separated. `suggestions[selectedIndex].name` has no bounds guard when asynchronous results change. The input has no explicit combobox/listbox relationship or active-descendant wiring. Filter data is assumed to contain arrays of strings.

**Work:** use immediate local filtering for small catalogs, or a short measured debounce for larger ones. Clear stale results, reset/clamp the active index when results change, tokenize all HTML whitespace, and stop re-querying completed tokens. Normalize/filter catalog data at its PHP boundary and guard the client. Deduplicate suggestions across categories. Use a suitable WordPress control or complete combobox semantics, stable IDs, focus handling, result announcements, and predictable Enter/Tab/Escape behavior.

**Done when:** keyboard-only and screen-reader operation works; rapidly changing/shrinking suggestions cannot throw; empty, malformed, duplicate, and large catalogs behave predictably. Add focused regression tests for these state transitions, including hovering an old result before the debounce completes.

### 7. Translate UI and document integration

Wrap labels, format titles, placeholders, and actions in `@wordpress/i18n`; register script translations with [`wp_set_script_translations`](https://developer.wordpress.org/reference/functions/wp_set_script_translations/). Add a documented PHP filter example, accepted catalog shape, and a clear explanation that assigning a class does not create its CSS. Explain how a theme/plugin supplies matching styles to the editor and frontend.

Update README feature lists to include CSS Class and correct the claim that all assets load only in the editor. Rewrite stale `CLAUDE.md` architecture/build instructions. Refresh screenshots only after the real UI is verified.

## Milestone 3: Theme-aware presentation

Suggested next minor scope: 3.2.0, after the reliability milestones.

- **Badge and highlight color controls:** use the theme palette first, retain the existing one-click defaults, offer reset, and provide contrast feedback. Persist colors using stable markup that survives save/reload and author-role sanitization; test before selecting the final serialization scheme.
- **Small badge preset set:** optional Neutral, Info, Success, and Warning appearances with text labels. Color must not be the only cue. Keep the initial set small and overridable by theme CSS variables.
- **Typography integration:** allow badges to follow surrounding typography through documented variables; preserve current defaults for existing content to avoid surprising visual changes.
- **Developer controls:** consider filters to disable individual formats and supply preset catalogs, following a demonstrated integration need.

Defer icon libraries, arbitrary CSS entry, a settings dashboard, cloud accounts, additional near-duplicate core formats, and a rewrite as custom blocks. Inline text formatting remains the product's useful boundary.

## Validation and delivery order

Implement compatibility/style fixes first, then release/package checks, then the class tool, then translations/docs, then presentation features. Attach meaningful tests to each behavioral change rather than building a large generic test framework in advance.

Use a local WordPress environment for integration/browser checks. Cover the declared minimum plus current stable WordPress, a classic and block theme, Post and Site Editors, paragraph/heading/list/button RichText, linked text, mixed/nested formats, collapsed selection, block classes, undo/redo, save/reload, and frontend rendering. Cover RTL, keyboard operation, supported PHP versions, and an author account where new attributes may be sanitized. Run WordPress Plugin Check against the actual extracted ZIP before release.

Release gate: older badge/highlight/custom-class content remains readable and editable; all required checks pass; runtime dependencies match metadata; the exact verified artifact is the one published. Production and WordPress.org verification belong to a separately authorized release task.
