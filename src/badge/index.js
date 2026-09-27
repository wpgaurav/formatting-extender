import { __ } from '@wordpress/i18n';
import { registerFormatType } from '@wordpress/rich-text';
import { BadgeButton } from './BadgeButton';

registerFormatType( 'formatting-extender/badge', {
	title: __( 'Badge', 'formatting-extender' ),
	tagName: 'span',
	className: 'fe-badge',
	attributes: { style: 'style' },
	edit: BadgeButton,
} );
