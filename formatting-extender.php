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
 * Version:           2.1.0
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

define( 'FORMATTING_EXTENDER_VERSION', '2.1.0' );

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
        '/expression\s*\(/i',           // IE expression
        '/javascript\s*:/i',            // JavaScript protocol
        '/vbscript\s*:/i',              // VBScript protocol
        '/behavior\s*:/i',              // IE behavior
        '/-moz-binding/i',              // Firefox XBL binding
        '/@import/i',                   // CSS import (could load external)
        '/@charset/i',                  // Charset declaration
        '/url\s*\(\s*["\']?\s*data:/i', // Data URLs in url()
        '/url\s*\(\s*["\']?\s*javascript:/i', // JavaScript in url()
        '/\\\\[0-9a-f]/i',              // Escaped characters that could bypass filters
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
    $hash = abs( crc32( $css ) );
    return dechex( strlen( $css ) ) . dechex( $hash );
}

/**
 * Extract custom CSS from block content and generate frontend styles.
 *
 * @since 2.1.0
 * @param string $content The post content.
 * @return string Modified content with custom CSS applied.
 */
function formatting_extender_render_custom_css( $content ) {
    if ( empty( $content ) || is_admin() ) {
        return $content;
    }

    // Parse blocks from content
    $blocks = parse_blocks( $content );
    if ( empty( $blocks ) ) {
        return $content;
    }

    $custom_styles = array();
    formatting_extender_collect_block_css( $blocks, $custom_styles );

    if ( empty( $custom_styles ) ) {
        return $content;
    }

    // Build optimized CSS output
    $css_output = '';
    foreach ( $custom_styles as $block_id => $css ) {
        $sanitized_css = formatting_extender_sanitize_css( $css );
        if ( empty( $sanitized_css ) || strpos( $sanitized_css, 'removed for security' ) !== false ) {
            continue;
        }

        // Replace selector placeholder with actual selector
        $selector = '[data-fe-block-id="' . esc_attr( $block_id ) . '"]';
        $scoped_css = str_replace( '{{SELECTOR}}', $selector, $sanitized_css );
        $scoped_css = str_replace( '{{selector}}', $selector, $scoped_css );

        $css_output .= $scoped_css . "\n";
    }

    if ( ! empty( $css_output ) ) {
        // Add styles to footer for better performance (non-blocking)
        add_action( 'wp_footer', function() use ( $css_output ) {
            echo '<style id="fe-custom-block-css">' . "\n" . $css_output . '</style>' . "\n";
        }, 100 );
    }

    return $content;
}

/**
 * Recursively collect custom CSS from blocks and inner blocks.
 *
 * @since 2.1.0
 * @param array $blocks Array of block data.
 * @param array $custom_styles Reference to collected styles array.
 */
function formatting_extender_collect_block_css( $blocks, &$custom_styles ) {
    foreach ( $blocks as $block ) {
        if ( ! empty( $block['attrs']['feCustomCSS'] ) ) {
            $css = $block['attrs']['feCustomCSS'];
            $block_id = formatting_extender_generate_block_id( $css );
            $custom_styles[ $block_id ] = $css;
        }

        // Process inner blocks recursively
        if ( ! empty( $block['innerBlocks'] ) ) {
            formatting_extender_collect_block_css( $block['innerBlocks'], $custom_styles );
        }
    }
}
add_filter( 'the_content', 'formatting_extender_render_custom_css', 5 );

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
