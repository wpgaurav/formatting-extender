import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeClasses, findSuggestions, completeToken, formatRange, selectionClasses, colorStyle, parseColors, contrastRatio, CLASS_FORMAT } from '../src/shared/formatting.mjs';
import { isStableRelease } from '../scripts/release-gate.mjs';

test( 'class tokens deduplicate all HTML whitespace without damaging utility syntax', () => {
	assert.equal( normalizeClasses( ' one\tone\ntwo\r\nmd:text-sm w-[2px] ' ), 'one two md:text-sm w-[2px]' );
} );
test( 'suggestions handle completed tokens, malformed data, duplicates, and result limits', () => {
	const catalog = { bad: false, A: [ 'one', 'one', null, 1, 'one-two', 'two' ], B: [ 'one', 'only' ] };
	assert.deepEqual( findSuggestions( 'one ', catalog ), [] );
	assert.deepEqual( findSuggestions( 'one\to', catalog ).map( ( x ) => x.name ), [ 'one-two', 'two', 'only' ] );
	assert.equal( findSuggestions( 'o', catalog, 2 ).length, 2 );
	assert.deepEqual( findSuggestions( 'o', null ), [] );
	assert.equal( completeToken( 'one\ttw', 'two' ), 'one\ttwo ' );
} );
test( 'caret expands only the current identical format, not adjacent differing classes', () => {
	const a = { type: CLASS_FORMAT, attributes: { className: 'a' } };
	const b = { type: CLASS_FORMAT, attributes: { className: 'b' } };
	const value = { text: 'abcd', start: 1, end: 1, formats: [ [ a ], [ a ], [ b ], [ b ] ] };
	assert.deepEqual( formatRange( value, CLASS_FORMAT, a ), { start: 0, end: 2 } );
	assert.deepEqual( selectionClasses( value, { start: 0, end: 4 } ), { classes: '', mixed: true } );
	assert.deepEqual( selectionClasses( value, { start: 0, end: 2 } ), { classes: 'a', mixed: false } );
	assert.equal( formatRange( { ...value, start: undefined }, CLASS_FORMAT, a ), null );
	assert.equal( formatRange( value, CLASS_FORMAT, undefined ), null );
} );
test( 'colors serialize safely and report contrast only for supported explicit values', () => {
	assert.equal( colorStyle( '#fff', '#000' ), 'color:#fff;background-color:#000' );
	assert.equal( colorStyle( 'red;display:none', '#000' ), 'background-color:#000' );
	assert.deepEqual( parseColors( 'color:var(--my-color);background-color:#fff' ), { color: 'var(--my-color)', 'background-color': '#fff' } );
	assert.equal( contrastRatio( '#fff', '#000' ), 21 );
	assert.equal( contrastRatio( '#fff', '#ffffff' ), 1 );
	assert.equal( contrastRatio( 'var(--theme)', '#fff' ), null );
} );
test( 'only stable published versions can deploy', () => {
	assert.equal( isStableRelease( 'v3.0.1', false ), true );
	assert.equal( isStableRelease( '3.0.1', false ), true );
	for ( const [ tag, prerelease ] of [ [ 'v3.0.1', true ], [ 'v3.0.1-beta.1', false ], [ 'main', false ], [ '3.0.1', undefined ] ] ) {
		assert.equal( isStableRelease( tag, prerelease ), false );
	}
} );

test( 'patched build dependencies retain the CommonJS APIs their callers use', async () => {
	const { createRequire } = await import( 'node:module' );
	const require = createRequire( import.meta.url );
	const copyRequire = createRequire( require.resolve( 'copy-webpack-plugin' ) );
	const sockRequire = createRequire( require.resolve( 'sockjs' ) );
	const expressRequire = createRequire( require.resolve( 'express' ) );
	assert.match( copyRequire( 'serialize-javascript' )( { pattern: /test/g } ), /RegExp/ );
	assert.match( sockRequire( 'uuid' ).v4(), /^[\da-f-]{36}$/ );
	assert.deepEqual( { ...expressRequire( 'qs' ).parse( 'key=value' ) }, { key: 'value' } );
} );
