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
 * Description:       This plugin extends the Block Editor formatting toolbar by adding new inline formatting controls like badge, highlights etc. and more.
 * Version:           1.0.3
 * Author:            Gaurav Tiwari
 * Author URI:        https://gauravtiwari.org
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       formatting-extender
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}
define( 'FORMATTING_EXTENDER_VERSION', '1.0.3' );

//  Functions
function formatting_extender_classes() {
	// Load the compiled blocks into the editor.
	wp_enqueue_script(
		'fe-highlight-js',
		plugins_url('/js/highlight.js', __FILE__),
		array( 'wp-blocks', 'wp-element', 'wp-components', 'wp-editor' ),
		'1.0.2',
		true
	);
	wp_enqueue_script(
		'fe-badge-js',
		plugins_url('/js/badge.js',  __FILE__),
		array( 'wp-blocks', 'wp-element', 'wp-components', 'wp-editor' ),
		'1.0.2',
		true
	);

        // Load the compiled styles into the editor
        wp_enqueue_style(
		'fe-extend-css',
		plugins_url('/css/styles.css', __FILE__),
		array( 'wp-edit-blocks' )
	);

}
add_action('enqueue_block_editor_assets', 'formatting_extender_classes');
function formatting_extender_frontend(){?>
<style>
	.fe-badge{background-color: #3333aa;border-radius: 2px;color: #ffffff;margin-left: 4px;font-size: 13px;padding: 3px 5px 3px 4px;position: relative;text-transform: uppercase;}a.fe-badge{ border: 0; }.fe-highlight{background:rgb(247, 220, 72);padding:0 3px; color:#111111}
</style>
<?php }
add_action('wp_footer', 'formatting_extender_frontend');