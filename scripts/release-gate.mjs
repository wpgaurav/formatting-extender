export function isStableRelease( tag, prerelease ) {
	return prerelease === false && /^v?\d+\.\d+\.\d+$/.test( tag );
}
if ( process.argv[ 1 ]?.endsWith( 'release-gate.mjs' ) ) {
	const [ tag, prerelease ] = process.argv.slice( 2 );
	console.log( `stable=${ isStableRelease( tag, prerelease !== 'false' ) }` );
}
