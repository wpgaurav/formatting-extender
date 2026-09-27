import { __ } from '@wordpress/i18n';
import { registerFormatType } from '@wordpress/rich-text';
import { HighlightButton } from './HighlightButton';

registerFormatType( 'formatting-extender/highlight', {
	title: __( 'Highlight', 'formatting-extender' ),
	tagName: 'span',
	className: 'fe-highlight',
	attributes: { style: 'style' },
	edit: HighlightButton,
} );
