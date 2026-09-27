# Formatting Extender development context

Read `README.md`, `IMPROVEMENT-PLAN.md`, and the current release evidence before changes. The historical plan describes the pre-3.0.1 baseline; implementation/release evidence takes precedence.

## Architecture

- `formatting-extender.php` loads generated script dependencies, translations, and editor UI styles with `enqueue_block_editor_assets`. Missing assets fail cleanly with an administrator notice.
- `enqueue_block_assets` shares `css/styles.css` with the frontend and editor iframe.
- `src/badge/` and `src/highlight/` register existing span formats. Optional inline color attributes are backward compatible.
- `src/add-class/` implements explicit selection/block class editing. `src/shared/formatting.mjs` contains pure token/range/color helpers. `src/shared/Appearance.js` supplies color controls.
- Class suggestions use the `formatting_extender_css_classes` PHP filter and validated JSON data. No database tables or settings page.

## Checks and packaging

Run `npm run lint:js`, `npm test`, `bash build.sh`, and `python3 -m unittest discover -s tests -p '*_test.py'`. `scripts/package.py` is the only package assembler and always builds fresh assets. Output lives in ignored `dist/`; browser evidence lives in ignored `artifacts/`.

Test the extracted package in Studio, including save/reload, frontend and iframe styles, keyboard control, WordPress minimum/current versions, and Plugin Check. Do not change unrelated Studio sites.

## Release boundaries

Version: `FORMATTING_EXTENDER_VERSION`; namespace/text domain: `formatting-extender`; CSS prefix: `fe-`. Keep package/header/constant/lockfile/stable-tag versions synchronized. Do not rename existing saved format classes or migrate stored content silently.

Branch pushes run CI only. Published stable releases may deploy to WordPress.org; prereleases must never deploy. Release preparation does not authorize publication. The deploy job consumes the verified ZIP and must not independently rebuild it.
