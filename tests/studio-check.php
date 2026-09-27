<?php
/** Run with Studio MCP: wp eval-file <copied path>. Requires the activated release ZIP. */
function fe_assert( $condition, $message ) {
 if ( ! $condition ) { throw new RuntimeException( $message ); }
 echo 'PASS: ' . $message . "\n";
}
fe_assert( '3.0.1' === FORMATTING_EXTENDER_VERSION, 'Installed version 3.0.1' );
fe_assert( formatting_extender_has_build(), 'Complete release assets' );
$asset = require FORMATTING_EXTENDER_PATH . 'build/index.asset.php';
$scripts = wp_scripts();
foreach ( $asset['dependencies'] as $handle ) {
 fe_assert( isset( $scripts->registered[ $handle ] ), 'Core provides dependency ' . $handle );
}
$catalog = formatting_extender_normalize_classes( array( 'A' => array( 'one', 'one', null, 'md:text-sm', 'bad token', '<tag>' ), 'B' => array( 'one', 'two' ), 'bad' => false ) );
fe_assert( array( 'A' => array( 'one', 'md:text-sm' ), 'B' => array( 'two' ) ) === $catalog, 'Catalog normalization preserves utilities and removes malformed/duplicate tokens' );
fe_assert( array() === formatting_extender_normalize_classes( 'bad' ), 'Malformed catalog is safe' );
formatting_extender_editor_assets();
fe_assert( wp_script_is( 'formatting-extender', 'enqueued' ), 'Editor script enqueued' );
fe_assert( 'formatting-extender' === $scripts->registered['formatting-extender']->textdomain, 'Script translations registered' );
formatting_extender_frontend_styles();
fe_assert( wp_style_is( 'formatting-extender', 'enqueued' ), 'Shared content CSS enqueued' );
$html = '<span class="fe-badge" style="color:#ffffff;background-color:#17643b">Success</span> <span class="fe-styled md:text-sm">Utility</span>';
fe_assert( false !== strpos( wp_kses_post( $html ), 'background-color:#17643b' ), 'Author-safe color serialization' );
fe_assert( false !== strpos( wp_kses_post( $html ), 'md:text-sm' ), 'Author-safe utility class serialization' );
$asset_path = FORMATTING_EXTENDER_PATH . 'build/index.asset.php';
rename( $asset_path, $asset_path . '.qa-backup' );
try {
 fe_assert( ! formatting_extender_has_build(), 'Incomplete installation detected' );
 wp_dequeue_script( 'formatting-extender' );
 formatting_extender_editor_assets();
 fe_assert( ! wp_script_is( 'formatting-extender', 'enqueued' ), 'Incomplete installation does not enqueue broken script' );
} finally {
 rename( $asset_path . '.qa-backup', $asset_path );
}
echo "STUDIO_CHECK_OK\n";
$author_id = username_exists( 'fe_qa_author' );
if ( ! $author_id ) {
 $author_id = wp_insert_user( array( 'user_login' => 'fe_qa_author', 'user_pass' => wp_generate_password( 32 ), 'role' => 'author' ) );
}
fe_assert( ! is_wp_error( $author_id ), 'QA author available' );
wp_set_current_user( $author_id );
kses_init();
$post_id = wp_insert_post( array( 'post_title' => 'FE author serialization QA', 'post_status' => 'draft', 'post_author' => $author_id, 'post_content' => '<!-- wp:paragraph --><p>' . $html . '</p><!-- /wp:paragraph -->' ), true );
fe_assert( ! is_wp_error( $post_id ), 'Author draft saved' );
$saved = get_post_field( 'post_content', $post_id );
fe_assert( false !== strpos( $saved, 'background-color:#17643b' ) && false !== strpos( $saved, 'md:text-sm' ), 'Author save preserves styles and utility classes' );
wp_trash_post( $post_id );
echo "AUTHOR_SAVE_OK\n";
