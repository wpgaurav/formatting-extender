import { registerFormatType } from '@wordpress/rich-text';
import { AddClass } from './AddClass';

registerFormatType( 'formatting-extender/add-class', {
	title: 'Add CSS Class',
	tagName: 'span',
	className: 'fe-styled',
	attributes: {
		className: 'class',
	},
	edit: AddClass,
} );
