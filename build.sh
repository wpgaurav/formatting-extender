#!/bin/bash
#
# Build script for Formatting Extender plugin
# Creates a clean ZIP file ready for WordPress installation.
#
# Usage: ./build.sh
#

set -e

VERSION=$(grep -m1 "Version:" formatting-extender.php | awk '{print $NF}')
PLUGIN_SLUG="formatting-extender"
BUILD_DIR="build-release"
ZIP_NAME="${PLUGIN_SLUG}-${VERSION}.zip"

echo "=========================================="
echo "  Formatting Extender Build Script"
echo "=========================================="
echo ""
echo "Building ${PLUGIN_SLUG} v${VERSION}..."
echo ""

# Ensure JS is built
if [ ! -f "build/index.js" ]; then
	echo "Running npm build..."
	npm run build
fi

# Clean previous build
rm -rf "${BUILD_DIR}"
rm -f "${ZIP_NAME}"
mkdir -p "${BUILD_DIR}/${PLUGIN_SLUG}"

INCLUDE=(
	"build"
	"css"
	"formatting-extender.php"
	"index.php"
	"README.txt"
	"uninstall.php"
)

echo "Copying files..."
for item in "${INCLUDE[@]}"; do
	if [ -e "$item" ]; then
		cp -r "$item" "${BUILD_DIR}/${PLUGIN_SLUG}/"
		echo "  + $item"
	else
		echo "  - $item (not found, skipping)"
	fi
done

find "${BUILD_DIR}" -name ".DS_Store" -type f -delete 2>/dev/null || true
find "${BUILD_DIR}" -name "*.map" -type f -delete 2>/dev/null || true

cd "${BUILD_DIR}"
zip -rq "../${ZIP_NAME}" "${PLUGIN_SLUG}"
cd ..

rm -rf "${BUILD_DIR}"

SIZE=$(ls -lh "${ZIP_NAME}" | awk '{print $5}')
FILE_COUNT=$(unzip -l "${ZIP_NAME}" | tail -1 | awk '{print $2}')

echo ""
echo "=========================================="
echo "  Build Complete!"
echo "=========================================="
echo ""
echo "  Output:  ./${ZIP_NAME}"
echo "  Size:    ${SIZE}"
echo "  Files:   ${FILE_COUNT}"
echo ""

unzip -l "${ZIP_NAME}" | head -20
echo "  ..."
echo ""
