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
 * Description:       Extends the Block Editor with inline formatting controls (badges, highlights) and per-block custom CSS. Uses inline styles for performance.
 * Version:           2.2.2
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

define( 'FORMATTING_EXTENDER_VERSION', '2.2.2' );

/**
 * Sanitize CSS to prevent XSS and other security issues.
 *
 * @since 2.1.0
 * @param string $css Raw CSS input.
 * @return string Sanitized CSS.
 */
function formatting_extender_sanitize_css( $css ) {
    if ( empty( $css ) ) {
        return '';
    }

    // Remove null bytes
    $css = str_replace( "\0", '', $css );

    // Dangerous patterns that could lead to XSS or security issues
    $dangerous_patterns = array(
        '/expression\s*\(/i',
        '/javascript\s*:/i',
        '/vbscript\s*:/i',
        '/behavior\s*:/i',
        '/-moz-binding/i',
        '/@import/i',
        '/@charset/i',
        '/url\s*\(\s*["\']?\s*data:/i',
        '/url\s*\(\s*["\']?\s*javascript:/i',
        '/\\\\[0-9a-f]/i',
    );

    foreach ( $dangerous_patterns as $pattern ) {
        if ( preg_match( $pattern, $css ) ) {
            return '/* CSS removed for security reasons */';
        }
    }

    // Strip HTML tags
    $css = wp_strip_all_tags( $css );

    // Remove any remaining script-like content
    $css = preg_replace( '/<[^>]*>/', '', $css );

    return $css;
}

/**
 * Generate a consistent block ID hash from CSS content.
 *
 * @since 2.1.0
 * @param string $css The CSS content.
 * @return string Block ID hash.
 */
function formatting_extender_generate_block_id( $css ) {
    return 'fe-' . substr( md5( $css ), 0, 8 );
}

/**
 * Global storage for custom CSS to output.
 */
global $formatting_extender_styles;
$formatting_extender_styles = array();

/**
 * Add data attribute to blocks with custom CSS and collect styles.
 *
 * @since 2.2.0
 * @param string $block_content The block content.
 * @param array  $block         The block data.
 * @return string Modified block content.
 */
function formatting_extender_render_block( $block_content, $block ) {
    global $formatting_extender_styles;

    // Check if block has custom CSS
    if ( empty( $block['attrs']['feCustomCSS'] ) ) {
        return $block_content;
    }

    $css = $block['attrs']['feCustomCSS'];
    $block_id = formatting_extender_generate_block_id( $css );

    // Collect CSS for later output
    if ( ! isset( $formatting_extender_styles[ $block_id ] ) ) {
        $sanitized_css = formatting_extender_sanitize_css( $css );
        if ( ! empty( $sanitized_css ) && strpos( $sanitized_css, 'removed for security' ) === false ) {
            $selector = '[data-fe-block-id="' . esc_attr( $block_id ) . '"]';
            $scoped_css = str_replace( '%root%', $selector, $sanitized_css );
            $scoped_css = str_replace( '%ROOT%', $selector, $scoped_css );
            $formatting_extender_styles[ $block_id ] = $scoped_css;
        }
    }

    // Add data attribute to the block's first HTML tag
    if ( ! empty( $block_content ) ) {
        // Handle tags with existing attributes (e.g., <p class="foo">)
        $block_content = preg_replace(
            '/^(<[a-z][a-z0-9]*)([\s>])/i',
            '$1 data-fe-block-id="' . esc_attr( $block_id ) . '"$2',
            $block_content,
            1
        );
    }

    return $block_content;
}
add_filter( 'render_block', 'formatting_extender_render_block', 10, 2 );

/**
 * Output collected custom CSS in the footer.
 *
 * @since 2.2.0
 */
function formatting_extender_output_styles() {
    global $formatting_extender_styles;

    if ( empty( $formatting_extender_styles ) ) {
        return;
    }

    $css_output = implode( "\n", $formatting_extender_styles );
    echo '<style id="fe-custom-block-css">' . "\n" . $css_output . "\n" . '</style>' . "\n";
}
add_action( 'wp_footer', 'formatting_extender_output_styles', 100 );

/**
 * Enqueue block editor assets for formatting controls.
 *
 * @since 1.0.0
 * @since 2.0.0 Updated to use wp-block-editor dependency, removed CSS dependency.
 * @since 2.1.0 Added custom CSS panel script.
 */
function formatting_extender_enqueue_editor_assets() {
    $asset_version = FORMATTING_EXTENDER_VERSION;

    // Highlight format
    wp_enqueue_script(
        'formatting-extender-highlight',
        plugins_url( 'js/highlight.js', __FILE__ ),
        array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-rich-text' ),
        $asset_version,
        true
    );

    // Badge format
    wp_enqueue_script(
        'formatting-extender-badge',
        plugins_url( 'js/badge.js', __FILE__ ),
        array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-rich-text' ),
        $asset_version,
        true
    );

    // Custom CSS panel
    wp_enqueue_script(
        'formatting-extender-custom-css',
        plugins_url( 'js/custom-css.js', __FILE__ ),
        array(
            'wp-blocks',
            'wp-element',
            'wp-block-editor',
            'wp-components',
            'wp-compose',
            'wp-hooks',
        ),
        $asset_version,
        true
    );
}
add_action( 'enqueue_block_editor_assets', 'formatting_extender_enqueue_editor_assets' );
