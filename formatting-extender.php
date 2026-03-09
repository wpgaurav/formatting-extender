<?php
/**
 * @link              https://gauravtiwari.org
 * @since             1.0.0
 * @package           Formatting_Extender
 *
 * @wordpress-plugin
 * Plugin Name:       Formatting Extender
 * Plugin URI:        https://gauravtiwari.org/snippet/formatting-extender/
 * Description:       Extends the Block Editor formatting toolbar with inline controls: badge, highlight, and more.
 * Version:           3.0.0
 * Author:            Gaurav Tiwari
 * Author URI:        https://gauravtiwari.org
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       formatting-extender
 * Requires at least: 6.0
 * Requires PHP:      7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'FORMATTING_EXTENDER_VERSION', '3.0.0' );
define( 'FORMATTING_EXTENDER_PATH', plugin_dir_path( __FILE__ ) );
define( 'FORMATTING_EXTENDER_URL', plugin_dir_url( __FILE__ ) );

add_action( 'enqueue_block_editor_assets', 'formatting_extender_editor_assets' );
add_action( 'wp_enqueue_scripts', 'formatting_extender_frontend_styles' );

function formatting_extender_editor_assets() {
	$asset_file = FORMATTING_EXTENDER_PATH . 'build/index.asset.php';
	$asset      = file_exists( $asset_file )
		? require $asset_file
		: array(
			'dependencies' => array( 'wp-element', 'wp-components', 'wp-block-editor', 'wp-rich-text' ),
			'version'      => filemtime( FORMATTING_EXTENDER_PATH . 'build/index.js' ),
		);

	wp_enqueue_script(
		'formatting-extender',
		FORMATTING_EXTENDER_URL . 'build/index.js',
		$asset['dependencies'],
		$asset['version'],
		true
	);

	$css_file = FORMATTING_EXTENDER_PATH . 'build/index.css';
	if ( file_exists( $css_file ) ) {
		wp_enqueue_style(
			'formatting-extender-editor',
			FORMATTING_EXTENDER_URL . 'build/index.css',
			array( 'wp-components' ),
			$asset['version']
		);
	}

	$classes = apply_filters( 'formatting_extender_css_classes', array() );
	if ( ! empty( $classes ) ) {
		wp_localize_script( 'formatting-extender', 'formattingExtender', array(
			'classes' => $classes,
		) );
	}
}

function formatting_extender_frontend_styles() {
	wp_enqueue_style(
		'formatting-extender',
		FORMATTING_EXTENDER_URL . 'css/styles.css',
		array(),
		FORMATTING_EXTENDER_VERSION
	);
}
