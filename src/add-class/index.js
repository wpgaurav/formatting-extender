import { __ } from '@wordpress/i18n';
import { registerFormatType } from '@wordpress/rich-text';
import { AddClass } from './AddClass';

registerFormatType( 'formatting-extender/add-class', {
	title: __( 'CSS classes', 'formatting-extender' ),
	tagName: 'span',
	className: 'fe-styled',
	attributes: {
		className: 'class',
	},
	edit: AddClass,
} );
