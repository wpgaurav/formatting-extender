import { useCallback } from '@wordpress/element';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { toggleFormat } from '@wordpress/rich-text';
import { tag } from '@wordpress/icons';

const FORMAT_TYPE = 'formatting-extender/badge';

export function BadgeButton( { isActive, value, onChange } ) {
	const onToggle = useCallback( () => {
		onChange( toggleFormat( value, { type: FORMAT_TYPE } ) );
	}, [ value, onChange ] );

	return (
		<RichTextToolbarButton
			icon={ tag }
			title="Badge"
			onClick={ onToggle }
			isActive={ isActive }
		/>
	);
}
