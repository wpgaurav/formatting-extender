import { useState, useCallback, useRef, useEffect } from '@wordpress/element';
import { BlockControls } from '@wordpress/block-editor';
import {
	ToolbarGroup,
	ToolbarButton,
	Popover,
	TextControl,
	Button,
} from '@wordpress/components';
import { applyFormat } from '@wordpress/rich-text';
import { useSelect, useDispatch } from '@wordpress/data';
import { styles } from '@wordpress/icons';

function getLastWord( input ) {
	const trimmed = input.trimEnd();
	const lastSpace = trimmed.lastIndexOf( ' ' );
	return lastSpace === -1 ? trimmed : trimmed.substring( lastSpace + 1 );
}

function useDebouncedSuggestions( input, delay = 1000 ) {
	const [ suggestions, setSuggestions ] = useState( [] );
	const timerRef = useRef( null );

	useEffect( () => {
		if ( timerRef.current ) {
			clearTimeout( timerRef.current );
		}

		const query = getLastWord( input ).toLowerCase();
		if ( ! query ) {
			setSuggestions( [] );
			return;
		}

		timerRef.current = setTimeout( () => {
			const classes = window.formattingExtender?.classes;
			if ( ! classes ) {
				setSuggestions( [] );
				return;
			}

			const matches = [];
			for ( const category in classes ) {
				for ( const cls of classes[ category ] ) {
					if ( cls.toLowerCase().includes( query ) ) {
						matches.push( { name: cls, category } );
					}
				}
				if ( matches.length >= 12 ) {
					break;
				}
			}
			setSuggestions( matches.slice( 0, 12 ) );
		}, delay );

		return () => {
			if ( timerRef.current ) {
				clearTimeout( timerRef.current );
			}
		};
	}, [ input, delay ] );

	return suggestions;
}

export function AddClass( { isActive, value, onChange } ) {
	const [ isOpen, setIsOpen ] = useState( false );
	const [ className, setClassName ] = useState( '' );
	const [ selectedIndex, setSelectedIndex ] = useState( -1 );
	const suggestions = useDebouncedSuggestions( className );

	const selectedBlock = useSelect(
		( select ) => select( 'core/block-editor' ).getSelectedBlock(),
		[]
	);

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' );

	const hasSelection = value.start !== value.end;

	const insertSuggestion = useCallback(
		( cls ) => {
			const lastSpace = className.trimEnd().lastIndexOf( ' ' );
			const prefix =
				lastSpace === -1 ? '' : className.substring( 0, lastSpace + 1 );
			setClassName( prefix + cls + ' ' );
			setSelectedIndex( -1 );
		},
		[ className ]
	);

	const applyClass = useCallback( () => {
		const trimmed = className.trim();
		if ( ! trimmed ) {
			return;
		}

		if ( hasSelection ) {
			onChange(
				applyFormat( value, {
					type: 'formatting-extender/add-class',
					attributes: {
						className: trimmed,
					},
				} )
			);
		} else if ( selectedBlock ) {
			const existing = selectedBlock.attributes.className || '';
			const newClasses = existing
				? `${ existing } ${ trimmed }`
				: trimmed;
			updateBlockAttributes( selectedBlock.clientId, {
				className: newClasses,
			} );
		}

		setClassName( '' );
		setSelectedIndex( -1 );
		setIsOpen( false );
	}, [
		className,
		hasSelection,
		value,
		onChange,
		selectedBlock,
		updateBlockAttributes,
	] );

	const onKeyDown = useCallback(
		( e ) => {
			if ( suggestions.length > 0 ) {
				if ( e.key === 'ArrowDown' ) {
					e.preventDefault();
					setSelectedIndex( ( prev ) =>
						prev < suggestions.length - 1 ? prev + 1 : 0
					);
					return;
				}
				if ( e.key === 'ArrowUp' ) {
					e.preventDefault();
					setSelectedIndex( ( prev ) =>
						prev > 0 ? prev - 1 : suggestions.length - 1
					);
					return;
				}
				if (
					( e.key === 'Tab' || e.key === 'Enter' ) &&
					selectedIndex >= 0
				) {
					e.preventDefault();
					insertSuggestion( suggestions[ selectedIndex ].name );
					return;
				}
				if ( e.key === 'Escape' ) {
					setSelectedIndex( -1 );
					return;
				}
			}
			if ( e.key === 'Enter' ) {
				e.preventDefault();
				applyClass();
			}
		},
		[ suggestions, selectedIndex, insertSuggestion, applyClass ]
	);

	return (
		<BlockControls group="other">
			<ToolbarGroup>
				<ToolbarButton
					icon={ styles }
					label="Add CSS Class"
					onClick={ () => setIsOpen( ( prev ) => ! prev ) }
					isPressed={ isOpen || isActive }
				/>
				{ isOpen && (
					<Popover
						className="fe-add-class-popover"
						placement="bottom-start"
						onClose={ () => {
							setIsOpen( false );
							setClassName( '' );
							setSelectedIndex( -1 );
						} }
					>
						<div className="fe-add-class-form">
							<TextControl
								label={
									hasSelection
										? 'Wrap selection with class'
										: 'Add class to block'
								}
								value={ className }
								onChange={ ( val ) => {
									setClassName( val );
									setSelectedIndex( -1 );
								} }
								placeholder="e.g. highlight-text"
								__nextHasNoMarginBottom
								onKeyDown={ onKeyDown }
								autoComplete="off"
							/>
							{ suggestions.length > 0 && (
								<ul
									className="fe-class-suggestions"
									role="listbox"
								>
									{ suggestions.map( ( item, i ) => (
										<li
											role="option"
											aria-selected={
												i === selectedIndex
											}
											key={ item.name }
											className={ `fe-class-suggestion${
												i === selectedIndex
													? ' is-selected'
													: ''
											}` }
											onMouseDown={ ( e ) => {
												e.preventDefault();
												insertSuggestion( item.name );
											} }
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
							) }
							<Button
								variant="primary"
								onClick={ () => applyClass() }
								disabled={ ! className.trim() }
							>
								Apply
							</Button>
						</div>
					</Popover>
				) }
			</ToolbarGroup>
		</BlockControls>
	);
}
