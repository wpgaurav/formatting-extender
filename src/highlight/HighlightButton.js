import { __ } from '@wordpress/i18n';
import { Appearance } from '../shared/Appearance';
import { useCallback } from '@wordpress/element';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { toggleFormat } from '@wordpress/rich-text';
import { textColor as highlightIcon } from '@wordpress/icons';

const FORMAT_TYPE = 'formatting-extender/highlight';

export function HighlightButton( { isActive, value, onChange } ) {
	const onToggle = useCallback( () => {
		onChange( toggleFormat( value, { type: FORMAT_TYPE } ) );
	}, [ value, onChange ] );

	return (
		<>
			<RichTextToolbarButton
				icon={ highlightIcon }
				title={ __( 'Highlight', 'formatting-extender' ) }
				onClick={ onToggle }
				isActive={ isActive }
			/>
			{ isActive && (
				<Appearance
					type={ FORMAT_TYPE }
					value={ value }
					onChange={ onChange }
					label={ __(
						'Highlight appearance',
						'formatting-extender'
					) }
				/>
			) }
		</>
	);
}
