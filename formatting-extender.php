<?php
/**
 * Plugin Name:       Formatting Extender
 * Plugin URI:        https://gauravtiwari.org/snippet/formatting-extender/
 * Description:       Extends the Block Editor with badges, highlights, and editable CSS classes.
 * Version:           3.0.1
 * Author:            Gaurav Tiwari
 * Author URI:        https://gauravtiwari.org
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       formatting-extender
 * Requires at least: 6.6
 * Requires PHP:      7.4
 *
 * @package Formatting_Extender
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'FORMATTING_EXTENDER_VERSION', '3.0.1' );
define( 'FORMATTING_EXTENDER_PATH', plugin_dir_path( __FILE__ ) );
define( 'FORMATTING_EXTENDER_URL', plugin_dir_url( __FILE__ ) );

add_action( 'enqueue_block_editor_assets', 'formatting_extender_editor_assets' );
add_action( 'enqueue_block_assets', 'formatting_extender_frontend_styles' );
add_action( 'admin_notices', 'formatting_extender_build_notice' );

/** Determine whether the installed editor assets are complete. */
function formatting_extender_has_build() {
	foreach ( array( 'build/index.js', 'build/index.asset.php', 'build/index.css', 'css/styles.css' ) as $file ) {
		if ( ! is_readable( FORMATTING_EXTENDER_PATH . $file ) ) {
			return false;
		}
	}
	return true;
}

/** Explain incomplete source installations to administrators. */
function formatting_extender_build_notice() {
	if ( current_user_can( 'activate_plugins' ) && ! formatting_extender_has_build() ) {
		echo '<div class="notice notice-error"><p>' . esc_html__( 'Formatting Extender is missing its built assets. Install the release ZIP, or run npm ci and npm run build in the plugin source directory.', 'formatting-extender' ) . '</p></div>';
	}
}

/**
 * Normalize a developer-provided category => class tokens catalog.
 *
 * @param mixed $catalog Suggested classes grouped by category.
 * @return array Valid unique tokens, preserving utility class punctuation.
 */
function formatting_extender_normalize_classes( $catalog ) {
	$result = array();
	$seen   = array();
	if ( ! is_array( $catalog ) ) {
		return $result;
	}
	foreach ( $catalog as $category => $classes ) {
		if ( ! is_array( $classes ) ) {
			continue;
		}
		$category = sanitize_text_field( (string) $category );
		foreach ( $classes as $class ) {
			if ( ! is_string( $class ) || '' === $class || preg_match( '/[\x00-\x20\x7f<>"\x27]/', $class ) || isset( $seen[ $class ] ) ) {
				continue;
			}
			$seen[ $class ]        = true;
			$result[ $category ][] = $class;
		}
	}
	return $result;
}

/** Enqueue controls in the editor UI, separate from content styles. */
function formatting_extender_editor_assets() {
	if ( ! formatting_extender_has_build() ) {
		return;
	}
	$asset = require FORMATTING_EXTENDER_PATH . 'build/index.asset.php';
	if ( ! is_array( $asset ) || ! isset( $asset['dependencies'], $asset['version'] ) || ! is_array( $asset['dependencies'] ) ) {
		return;
	}
	wp_enqueue_script( 'formatting-extender', FORMATTING_EXTENDER_URL . 'build/index.js', $asset['dependencies'], $asset['version'], true );
	wp_set_script_translations( 'formatting-extender', 'formatting-extender' );
	wp_enqueue_style( 'formatting-extender-editor', FORMATTING_EXTENDER_URL . 'build/index.css', array( 'wp-components' ), $asset['version'] );
	wp_style_add_data( 'formatting-extender-editor', 'rtl', 'replace' );

	/** Filters the category => array of CSS class tokens available as suggestions. */
	$classes = formatting_extender_normalize_classes( apply_filters( 'formatting_extender_css_classes', array() ) );
	wp_add_inline_script(
		'formatting-extender',
		'window.formattingExtender = ' . wp_json_encode( array( 'classes' => $classes ), JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT ) . ';',
		'before'
	);
}

/** Share the same format styles with the frontend and editor canvas. */
function formatting_extender_frontend_styles() {
	if ( is_readable( FORMATTING_EXTENDER_PATH . 'css/styles.css' ) ) {
		wp_enqueue_style( 'formatting-extender', FORMATTING_EXTENDER_URL . 'css/styles.css', array(), FORMATTING_EXTENDER_VERSION );
	}
}
