export const CLASS_FORMAT = 'formatting-extender/add-class';
const WHITESPACE = /[\t\n\f\r ]+/;

export function normalizeClasses( input ) {
	return [
		...new Set(
			String( input || '' )
				.split( WHITESPACE )
				.filter( Boolean )
		),
	].join( ' ' );
}

export function findSuggestions( input, catalog, limit = 12 ) {
	const token = input.split( WHITESPACE ).pop().toLowerCase();
	if ( ! token || ! catalog || typeof catalog !== 'object' ) {
		return [];
	}
	const used = new Set( input.split( WHITESPACE ).slice( 0, -1 ) );
	const results = [];
	for ( const [ category, classes ] of Object.entries( catalog ) ) {
		if ( ! Array.isArray( classes ) ) {
			continue;
		}
		for ( const name of classes ) {
			if (
				typeof name !== 'string' ||
				! name ||
				WHITESPACE.test( name ) ||
				used.has( name )
			) {
				continue;
			}
			if ( name.toLowerCase().includes( token ) ) {
				results.push( { name, category } );
				used.add( name );
				if ( results.length === limit ) {
					return results;
				}
			}
		}
	}
	return results;
}

export function completeToken( input, token ) {
	return input.replace( /[^\t\n\f\r ]*$/, token + ' ' );
}

/**
 * Expand a caret only through the current contiguous, identically attributed format.
 *
 * @param {Object} value  RichText value.
 * @param {string} type   Registered format name.
 * @param {Object} active Format active at the caret.
 * @return {Object|null} Editable range, or null when no text can be edited.
 */
export function formatRange( value, type, active ) {
	if (
		! Number.isInteger( value.start ) ||
		! Number.isInteger( value.end )
	) {
		return null;
	}
	if ( value.start !== value.end ) {
		return { start: value.start, end: value.end };
	}
	if ( ! active ) {
		return null;
	}
	const signature = JSON.stringify( active.attributes || {} );
	const matches = ( index ) =>
		( value.formats[ index ] || [] ).some(
			( format ) =>
				format.type === type &&
				JSON.stringify( format.attributes || {} ) === signature
		);
	let start = value.start;
	let end = value.end;
	while ( start > 0 && matches( start - 1 ) ) {
		start--;
	}
	while ( end < value.text.length && matches( end ) ) {
		end++;
	}
	return start < end ? { start, end } : null;
}

export function selectionClasses( value, range ) {
	if ( ! range ) {
		return { classes: '', mixed: false };
	}
	const variants = new Set();
	for ( let i = range.start; i < range.end; i++ ) {
		const format = ( value.formats[ i ] || [] ).find(
			( item ) => item.type === CLASS_FORMAT
		);
		variants.add( normalizeClasses( format?.attributes?.className ) );
	}
	return {
		classes: variants.size === 1 ? [ ...variants ][ 0 ] : '',
		mixed: variants.size > 1,
	};
}

export function parseColors( style = '' ) {
	const colors = {};
	for ( const declaration of style.split( ';' ) ) {
		const [ property, ...parts ] = declaration.split( ':' );
		if ( [ 'color', 'background-color' ].includes( property.trim() ) ) {
			colors[ property.trim() ] = parts.join( ':' ).trim();
		}
	}
	return colors;
}

export function colorStyle( foreground, background ) {
	// Palette values may be CSS variables or modern colors; reject declaration injection.
	const safe = ( color ) =>
		typeof color === 'string' && ! /[;{}<>]/.test( color )
			? color.trim()
			: '';
	return [
		safe( foreground ) && `color:${ safe( foreground ) }`,
		safe( background ) && `background-color:${ safe( background ) }`,
	]
		.filter( Boolean )
		.join( ';' );
}

export function contrastRatio( foreground, background ) {
	const luminance = ( color ) => {
		if ( ! /^#(?:[\da-f]{3}|[\da-f]{6})$/i.test( color || '' ) ) {
			return null;
		}
		const hex =
			color.length === 4
				? color
						.slice( 1 )
						.split( '' )
						.map( ( c ) => c + c )
						.join( '' )
				: color.slice( 1 );
		const rgb = [ 0, 2, 4 ]
			.map( ( i ) => parseInt( hex.slice( i, i + 2 ), 16 ) / 255 )
			.map( ( c ) =>
				c <= 0.04045 ? c / 12.92 : ( ( c + 0.055 ) / 1.055 ) ** 2.4
			);
		return rgb[ 0 ] * 0.2126 + rgb[ 1 ] * 0.7152 + rgb[ 2 ] * 0.0722;
	};
	const a = luminance( foreground );
	const b = luminance( background );
	return a === null || b === null
		? null
		: ( Math.max( a, b ) + 0.05 ) / ( Math.min( a, b ) + 0.05 );
}
