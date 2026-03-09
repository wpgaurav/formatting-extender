import { registerFormatType } from '@wordpress/rich-text';
import { BadgeButton } from './BadgeButton';

registerFormatType( 'formatting-extender/badge', {
	title: 'Badge',
	tagName: 'span',
	className: 'fe-badge',
	edit: BadgeButton,
} );
