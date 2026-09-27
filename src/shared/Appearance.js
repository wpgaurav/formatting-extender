import { useState } from '@wordpress/element';
import { BlockControls } from '@wordpress/block-editor';
import {
	ToolbarGroup,
	ToolbarButton,
	Popover,
	ColorPalette,
	Button,
	SelectControl,
} from '@wordpress/components';
import { applyFormat, getActiveFormat } from '@wordpress/rich-text';
import { useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import { color } from '@wordpress/icons';
import {
	formatRange,
	parseColors,
	colorStyle,
	contrastRatio,
} from './formatting.mjs';

export function Appearance( { type, value, onChange, label, badge = false } ) {
	const [ target, setTarget ] = useState( null );
	const [ foreground, setForeground ] = useState();
	const [ background, setBackground ] = useState();
	const [ preset, setPreset ] = useState( '' );
	const { colors, blockId, mode } = useSelect( ( select ) => {
		const editor = select( 'core/block-editor' );
		const id = editor.getSelectedBlockClientId();
		return {
			colors: editor.getSettings().colors,
			blockId: id,
			mode: id ? editor.getBlockEditingMode( id ) : 'disabled',
		};
	}, [] );
	const defaults = badge
		? { foreground: '#ffffff', background: '#3333aa' }
		: { foreground: '#111111', background: '#f7dc48' };
	const presets = {
		neutral: [ '#ffffff', '#333333' ],
		info: [ '#ffffff', '#164e8c' ],
		success: [ '#ffffff', '#17643b' ],
		warning: [ '#482400', '#ffdd77' ],
	};
	const close = () => setTarget( null );
	const open = () => {
		if ( target ) {
			close();
			return;
		}
		const active = getActiveFormat( value, type );
		const range = formatRange( value, type, active );
		if ( ! range ) {
			return;
		}
		const existing = parseColors( active?.attributes?.style );
		setForeground( existing.color );
		setBackground( existing[ 'background-color' ] );
		setPreset( '' );
		setTarget( { value, range, blockId } );
	};
	const apply = ( reset = false ) => {
		if (
			target.blockId === blockId &&
			target.value.text === value.text &&
			mode === 'default'
		) {
			const style = reset ? '' : colorStyle( foreground, background );
			onChange(
				applyFormat(
					target.value,
					{ type, ...( style ? { attributes: { style } } : {} ) },
					target.range.start,
					target.range.end
				)
			);
		}
		close();
	};
	if ( mode !== 'default' ) {
		return null;
	}
	const ratio = contrastRatio( foreground, background );
	return (
		<BlockControls group="other">
			<ToolbarGroup>
				<ToolbarButton
					icon={ color }
					label={ label }
					onClick={ open }
					isPressed={ !! target }
				/>
				{ target && target.blockId === blockId && (
					<Popover
						className="fe-format-popover"
						placement="bottom-start"
						shift
						resize={ false }
						onClose={ close }
						focusOnMount="firstElement"
					>
						<div className="fe-format-form">
							<strong>{ label }</strong>
							{ badge && (
								<SelectControl
									label={ __(
										'Badge preset',
										'formatting-extender'
									) }
									value={ preset }
									options={ [
										{
											label: __(
												'Custom / current',
												'formatting-extender'
											),
											value: '',
										},
										{
											label: __(
												'Neutral',
												'formatting-extender'
											),
											value: 'neutral',
										},
										{
											label: __(
												'Info',
												'formatting-extender'
											),
											value: 'info',
										},
										{
											label: __(
												'Success',
												'formatting-extender'
											),
											value: 'success',
										},
										{
											label: __(
												'Warning',
												'formatting-extender'
											),
											value: 'warning',
										},
									] }
									onChange={ ( next ) => {
										setPreset( next );
										if ( presets[ next ] ) {
											setForeground(
												presets[ next ][ 0 ]
											);
											setBackground(
												presets[ next ][ 1 ]
											);
										}
									} }
									__nextHasNoMarginBottom
								/>
							) }
							<fieldset>
								<legend>
									{ __(
										'Text color',
										'formatting-extender'
									) }
								</legend>
								<ColorPalette
									colors={ colors }
									value={ foreground }
									onChange={ ( next ) => {
										setForeground( next );
										setPreset( '' );
									} }
								/>
							</fieldset>
							<fieldset>
								<legend>
									{ __(
										'Background color',
										'formatting-extender'
									) }
								</legend>
								<ColorPalette
									colors={ colors }
									value={ background }
									onChange={ ( next ) => {
										setBackground( next );
										setPreset( '' );
									} }
								/>
							</fieldset>
							<p
								className="fe-color-preview"
								style={ {
									color: foreground || defaults.foreground,
									backgroundColor:
										background || defaults.background,
								} }
							>
								{ __( 'Preview text', 'formatting-extender' ) }
							</p>
							<p role="status">
								{ ratio === null
									? __(
											'Preview uses default colors when unset. Check contrast in your theme.',
											'formatting-extender'
										)
									: sprintf(
											/* translators: 1: numerical contrast ratio, 2: contrast assessment. */
											__(
												'Contrast %1$s:1. %2$s',
												'formatting-extender'
											),
											ratio.toFixed( 2 ),
											ratio >= 4.5
												? __(
														'Meets normal-text contrast.',
														'formatting-extender'
													)
												: __(
														'Choose colors with at least 4.5:1 contrast.',
														'formatting-extender'
													)
										) }
							</p>
							<div className="fe-format-actions">
								<Button
									variant="primary"
									onClick={ () => apply() }
								>
									{ __(
										'Apply colors',
										'formatting-extender'
									) }
								</Button>
								<Button
									variant="secondary"
									onClick={ () => apply( true ) }
								>
									{ __(
										'Reset colors',
										'formatting-extender'
									) }
								</Button>
								<Button variant="tertiary" onClick={ close }>
									{ __( 'Cancel', 'formatting-extender' ) }
								</Button>
							</div>
						</div>
					</Popover>
				) }
			</ToolbarGroup>
		</BlockControls>
	);
}
