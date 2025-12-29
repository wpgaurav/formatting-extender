<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://gauravtiwari.org
 * @since             1.0.0
 * @package           Formatting_Extender
 *
 * @wordpress-plugin
 * Plugin Name:       Formatting Extender
 * Plugin URI:        https://gauravtiwari.org/snippet/formatting-extender/
 * Description:       Extends the Block Editor formatting toolbar with inline formatting controls like badges and highlights. Uses inline styles for better performance.
 * Version:           2.0.0
 * Author:            Gaurav Tiwari
 * Author URI:        https://gauravtiwari.org
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       formatting-extender
 * Requires at least: 5.8
 * Tested up to:      6.9
 * Requires PHP:      7.4
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}

define( 'FORMATTING_EXTENDER_VERSION', '2.0.0' );

/**
 * Enqueue block editor assets for formatting controls.
 *
 * @since 1.0.0
 * @since 2.0.0 Updated to use wp-block-editor dependency, removed CSS dependency.
 */
function formatting_extender_enqueue_editor_assets() {
    $asset_version = FORMATTING_EXTENDER_VERSION;

    wp_enqueue_script(
        'formatting-extender-highlight',
        plugins_url( 'js/highlight.js', __FILE__ ),
        array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-rich-text' ),
        $asset_version,
        true
    );

    wp_enqueue_script(
        'formatting-extender-badge',
        plugins_url( 'js/badge.js', __FILE__ ),
        array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-rich-text' ),
        $asset_version,
        true
    );
}
add_action( 'enqueue_block_editor_assets', 'formatting_extender_enqueue_editor_assets' );
