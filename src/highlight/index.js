import { registerFormatType } from '@wordpress/rich-text';
import { HighlightButton } from './HighlightButton';

registerFormatType( 'formatting-extender/highlight', {
	title: 'Highlight',
	tagName: 'span',
	className: 'fe-highlight',
	edit: HighlightButton,
} );
