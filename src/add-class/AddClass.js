import { useState, useRef, useEffect } from '@wordpress/element';
import { BlockControls } from '@wordpress/block-editor';
import { hasBlockSupport } from '@wordpress/blocks';
import {
	ToolbarGroup,
	ToolbarButton,
	Popover,
	TextControl,
	Button,
	SelectControl,
	Notice,
} from '@wordpress/components';
import {
	applyFormat,
	removeFormat,
	getActiveFormat,
} from '@wordpress/rich-text';
import { useSelect, useDispatch } from '@wordpress/data';
import { useInstanceId } from '@wordpress/compose';
import { __, sprintf, _n } from '@wordpress/i18n';
import { styles } from '@wordpress/icons';
import {
	CLASS_FORMAT,
	normalizeClasses,
	findSuggestions,
	completeToken,
	formatRange,
	selectionClasses,
} from '../shared/formatting.mjs';

export function AddClass( { isActive, value, onChange } ) {
	const [ target, setTarget ] = useState( null );
	const [ scope, setScope ] = useState( 'text' );
	const [ className, setClassName ] = useState( '' );
	const [ selectedIndex, setSelectedIndex ] = useState( -1 );
	const [ dismissed, setDismissed ] = useState( false );
	const inputRef = useRef();
	const listId = `fe-classes-${ useInstanceId( AddClass ) }`;
	const { selectedBlock, editingMode } = useSelect( ( select ) => {
		const editor = select( 'core/block-editor' );
		const block = editor.getSelectedBlock();
		return {
			selectedBlock: block,
			editingMode: block
				? editor.getBlockEditingMode( block.clientId )
				: 'disabled',
		};
	}, [] );
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' );
	const canEditBlock =
		selectedBlock &&
		hasBlockSupport( selectedBlock.name, 'customClassName', true ) &&
		editingMode === 'default';
	const suggestions = dismissed
		? []
		: findSuggestions( className, window.formattingExtender?.classes );
	const activeSuggestion = suggestions[ selectedIndex ];
	const activeName = activeSuggestion?.name;

	useEffect( () => {
		setTarget( null );
	}, [ selectedBlock?.clientId ] );

	useEffect( () => {
		if ( activeName ) {
			inputRef.current?.ownerDocument
				.getElementById( `${ listId }-${ selectedIndex }` )
				?.scrollIntoView( { block: 'nearest' } );
		}
	}, [ activeName, listId, selectedIndex ] );

	const close = () => setTarget( null );
	const changeInput = ( next ) => {
		setClassName( next );
		setSelectedIndex( -1 );
		setDismissed( false );
	};
	const open = () => {
		if ( target ) {
			close();
			return;
		}
		const range = formatRange(
			value,
			CLASS_FORMAT,
			getActiveFormat( value, CLASS_FORMAT )
		);
		const current = selectionClasses( value, range );
		setTarget( {
			value,
			range,
			blockId: selectedBlock?.clientId,
			...current,
		} );
		setScope( range ? 'text' : 'block' );
		changeInput(
			range ? current.classes : selectedBlock?.attributes.className || ''
		);
		setDismissed( true );
	};
	const changeScope = ( next ) => {
		setScope( next );
		changeInput(
			next === 'text'
				? target.classes
				: selectedBlock?.attributes.className || ''
		);
		setDismissed( true );
	};
	const apply = ( clear = false ) => {
		if (
			! target ||
			target.blockId !== selectedBlock?.clientId ||
			target.value.text !== value.text
		) {
			close();
			return;
		}
		const classes = clear ? '' : normalizeClasses( className );
		if ( scope === 'text' && target.range ) {
			const { start, end } = target.range;
			onChange(
				classes
					? applyFormat(
							target.value,
							{
								type: CLASS_FORMAT,
								attributes: { className: classes },
							},
							start,
							end
						)
					: removeFormat( target.value, CLASS_FORMAT, start, end )
			);
		} else if ( canEditBlock ) {
			updateBlockAttributes( selectedBlock.clientId, {
				className: classes || undefined,
			} );
		}
		close();
	};
	const insertSuggestion = ( name ) =>
		changeInput( completeToken( className, name ) );
	const onKeyDown = ( event ) => {
		if ( event.key === 'Escape' ) {
			event.preventDefault();
			event.stopPropagation();
			if ( suggestions.length ) {
				setDismissed( true );
				setSelectedIndex( -1 );
			} else {
				close();
			}
			return;
		}
		if (
			suggestions.length &&
			[ 'ArrowDown', 'ArrowUp' ].includes( event.key )
		) {
			event.preventDefault();
			setSelectedIndex(
				event.key === 'ArrowDown'
					? ( selectedIndex + 1 ) % suggestions.length
					: ( selectedIndex <= 0
							? suggestions.length
							: selectedIndex ) - 1
			);
		} else if ( event.key === 'Enter' ) {
			event.preventDefault();
			if ( activeSuggestion ) {
				insertSuggestion( activeSuggestion.name );
			} else {
				apply();
			}
		} else if ( event.key === 'Tab' ) {
			// Tab retains normal focus navigation instead of trapping users in suggestions.
			setDismissed( true );
			setSelectedIndex( -1 );
		}
	};

	if ( editingMode !== 'default' ) {
		return null;
	}
	return (
		<BlockControls group="other">
			<ToolbarGroup>
				<ToolbarButton
					icon={ styles }
					label={ __( 'CSS classes', 'formatting-extender' ) }
					onClick={ open }
					isPressed={ !! target || isActive }
				/>
				{ target && (
					<Popover
						className="fe-format-popover"
						placement="bottom-start"
						shift
						resize={ false }
						onClose={ close }
						focusOnMount="firstElement"
					>
						<div className="fe-format-form">
							<SelectControl
								label={ __(
									'Apply to',
									'formatting-extender'
								) }
								value={ scope }
								onChange={ changeScope }
								options={ [
									{
										label: __(
											'Selected text',
											'formatting-extender'
										),
										value: 'text',
										disabled: ! target.range,
									},
									{
										label: __(
											'Block',
											'formatting-extender'
										),
										value: 'block',
										disabled: ! canEditBlock,
									},
								] }
								__nextHasNoMarginBottom
							/>
							{ scope === 'text' && target.mixed && (
								<Notice status="info" isDismissible={ false }>
									{ __(
										'This selection has different classes. Applying replaces its custom classes; other formatting stays intact.',
										'formatting-extender'
									) }
								</Notice>
							) }
							<TextControl
								ref={ inputRef }
								label={ __(
									'CSS classes',
									'formatting-extender'
								) }
								help={ __(
									'Separate classes with spaces. Your theme must provide their styles.',
									'formatting-extender'
								) }
								value={ className }
								onChange={ changeInput }
								placeholder={ __(
									'e.g. highlight-text',
									'formatting-extender'
								) }
								onKeyDown={ onKeyDown }
								autoComplete="off"
								role="combobox"
								aria-autocomplete="list"
								aria-expanded={ suggestions.length > 0 }
								aria-controls={ listId }
								aria-activedescendant={
									activeSuggestion
										? `${ listId }-${ selectedIndex }`
										: undefined
								}
								__nextHasNoMarginBottom
							/>
							<ul
								id={ listId }
								className="fe-class-suggestions"
								role="listbox"
								aria-label={ __(
									'Suggested classes',
									'formatting-extender'
								) }
								hidden={ ! suggestions.length }
							>
								{ suggestions.map( ( item, i ) => (
									<li
										id={ `${ listId }-${ i }` }
										role="option"
										onKeyDown={ ( event ) => {
											if ( event.key === 'Enter' ) {
												event.preventDefault();
												insertSuggestion( item.name );
											}
										} }
										aria-selected={ i === selectedIndex }
										key={ item.name }
										className={ `fe-class-suggestion${ i === selectedIndex ? ' is-selected' : '' }` }
										onMouseDown={ ( event ) =>
											event.preventDefault()
										}
										onClick={ () =>
											insertSuggestion( item.name )
										}
										onMouseEnter={ () =>
											setSelectedIndex( i )
										}
									>
										<span className="fe-class-suggestion-name">
											{ item.name }
										</span>
										<span className="fe-class-suggestion-category">
											{ item.category }
										</span>
									</li>
								) ) }
							</ul>
							<div
								className="screen-reader-text"
								role="status"
								aria-live="polite"
							>
								{ suggestions.length
									? sprintf(
											/* translators: %d: number of matching CSS classes. */
											_n(
												'%d suggestion available.',
												'%d suggestions available.',
												suggestions.length,
												'formatting-extender'
											),
											suggestions.length
										)
									: '' }
							</div>
							<div className="fe-format-actions">
								<Button
									variant="primary"
									onClick={ () => apply() }
									disabled={
										scope === 'block' && ! canEditBlock
									}
								>
									{ __( 'Apply', 'formatting-extender' ) }
								</Button>
								<Button
									variant="secondary"
									onClick={ () => apply( true ) }
									disabled={
										scope === 'block' && ! canEditBlock
									}
								>
									{ __(
										'Clear classes',
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
