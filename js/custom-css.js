( function( wp ) {
    var el = wp.element.createElement;
    var Fragment = wp.element.Fragment;
    var useState = wp.element.useState;
    var useEffect = wp.element.useEffect;
    var InspectorControls = wp.blockEditor.InspectorControls;
    var PanelBody = wp.components.PanelBody;
    var TextareaControl = wp.components.TextareaControl;
    var Notice = wp.components.Notice;
    var createHigherOrderComponent = wp.compose.createHigherOrderComponent;
    var addFilter = wp.hooks.addFilter;

    // Add customCSS attribute to all blocks
    function addCustomCSSAttribute( settings ) {
        if ( typeof settings.attributes !== 'undefined' ) {
            settings.attributes = Object.assign( settings.attributes, {
                feCustomCSS: {
                    type: 'string',
                    default: ''
                }
            } );
        }
        return settings;
    }

    addFilter(
        'blocks.registerBlockType',
        'formatting-extender/custom-css-attribute',
        addCustomCSSAttribute
    );

    // Create the sidebar panel component
    var CustomCSSPanel = createHigherOrderComponent( function( BlockEdit ) {
        return function( props ) {
            if ( ! props.isSelected ) {
                return el( BlockEdit, props );
            }

            var clientId = props.clientId;
            var attributes = props.attributes;
            var setAttributes = props.setAttributes;
            var customCSS = attributes.feCustomCSS || '';

            // Generate unique selector for this block
            var blockSelector = '.wp-block[data-fe-block-id="' + clientId.substring( 0, 8 ) + '"]';
            var frontendSelector = '[data-fe-block-id="' + clientId.substring( 0, 8 ) + '"]';

            // State for CSS validation
            var validationState = useState( { isValid: true, message: '' } );
            var validation = validationState[0];
            var setValidation = validationState[1];

            // Validate CSS (basic security check)
            function validateCSS( css ) {
                if ( ! css || css.trim() === '' ) {
                    return { isValid: true, message: '' };
                }

                // Check for potentially dangerous patterns
                var dangerousPatterns = [
                    /expression\s*\(/i,
                    /javascript\s*:/i,
                    /behavior\s*:/i,
                    /-moz-binding/i,
                    /@import/i,
                    /@charset/i,
                    /url\s*\(\s*["']?\s*data:/i
                ];

                for ( var i = 0; i < dangerousPatterns.length; i++ ) {
                    if ( dangerousPatterns[i].test( css ) ) {
                        return {
                            isValid: false,
                            message: 'Potentially unsafe CSS detected. Avoid using expressions, JavaScript, or external resources.'
                        };
                    }
                }

                // Check for balanced braces
                var openBraces = ( css.match( /\{/g ) || [] ).length;
                var closeBraces = ( css.match( /\}/g ) || [] ).length;
                if ( openBraces !== closeBraces ) {
                    return {
                        isValid: false,
                        message: 'Unbalanced braces detected. Please check your CSS syntax.'
                    };
                }

                return { isValid: true, message: '' };
            }

            function onCSSChange( newCSS ) {
                var result = validateCSS( newCSS );
                setValidation( result );

                if ( result.isValid ) {
                    setAttributes( { feCustomCSS: newCSS } );
                }
            }

            // Apply CSS in editor preview
            useEffect( function() {
                if ( ! customCSS || ! validation.isValid ) {
                    // Remove any existing style
                    var existingStyle = document.getElementById( 'fe-custom-css-' + clientId.substring( 0, 8 ) );
                    if ( existingStyle ) {
                        existingStyle.remove();
                    }
                    return;
                }

                var styleId = 'fe-custom-css-' + clientId.substring( 0, 8 );
                var styleEl = document.getElementById( styleId );

                if ( ! styleEl ) {
                    styleEl = document.createElement( 'style' );
                    styleEl.id = styleId;
                    document.head.appendChild( styleEl );
                }

                // Scope CSS to this block in editor
                var scopedCSS = customCSS.replace( /\{\{SELECTOR\}\}/g, blockSelector );
                // Also support {{selector}} lowercase
                scopedCSS = scopedCSS.replace( /\{\{selector\}\}/g, blockSelector );

                styleEl.textContent = scopedCSS;

                // Cleanup on unmount
                return function() {
                    var el = document.getElementById( styleId );
                    if ( el ) {
                        el.remove();
                    }
                };
            }, [ customCSS, clientId, validation.isValid ] );

            return el(
                Fragment,
                {},
                el( BlockEdit, props ),
                el(
                    InspectorControls,
                    {},
                    el(
                        PanelBody,
                        {
                            title: 'Custom CSS',
                            initialOpen: false,
                            className: 'fe-custom-css-panel'
                        },
                        el(
                            'div',
                            {
                                style: {
                                    marginBottom: '12px',
                                    padding: '8px 12px',
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: '4px',
                                    fontFamily: 'monospace',
                                    fontSize: '11px',
                                    wordBreak: 'break-all'
                                }
                            },
                            el( 'strong', { style: { display: 'block', marginBottom: '4px', fontSize: '11px' } }, 'Block Selector:' ),
                            el( 'code', { style: { color: '#1e40af' } }, '{{SELECTOR}}' )
                        ),
                        el(
                            'p',
                            {
                                style: {
                                    fontSize: '12px',
                                    color: '#666',
                                    marginBottom: '12px'
                                }
                            },
                            'Use {{SELECTOR}} as placeholder for the block selector. Example:'
                        ),
                        el(
                            'pre',
                            {
                                style: {
                                    fontSize: '11px',
                                    backgroundColor: '#1e293b',
                                    color: '#e2e8f0',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    marginBottom: '12px',
                                    overflow: 'auto',
                                    whiteSpace: 'pre-wrap'
                                }
                            },
                            '{{SELECTOR}} {\n  background: #f5f5f5;\n  padding: 20px;\n}\n\n{{SELECTOR}} p {\n  color: #333;\n}'
                        ),
                        ! validation.isValid && el(
                            Notice,
                            {
                                status: 'error',
                                isDismissible: false,
                                style: { marginBottom: '12px' }
                            },
                            validation.message
                        ),
                        el(
                            TextareaControl,
                            {
                                label: 'CSS Code',
                                help: 'CSS will be scoped to this block only.',
                                value: customCSS,
                                onChange: onCSSChange,
                                rows: 8,
                                placeholder: '{{SELECTOR}} {\n  /* Your CSS here */\n}',
                                style: {
                                    fontFamily: 'monospace',
                                    fontSize: '12px'
                                }
                            }
                        )
                    )
                )
            );
        };
    }, 'withCustomCSSPanel' );

    addFilter(
        'editor.BlockEdit',
        'formatting-extender/custom-css-panel',
        CustomCSSPanel
    );

    // Add data attribute to block wrapper for frontend targeting
    function addBlockDataAttribute( extraProps, blockType, attributes ) {
        if ( attributes.feCustomCSS && attributes.feCustomCSS.trim() !== '' ) {
            // Generate consistent ID from block's unique identifier
            var blockId = attributes.feCustomCSS.length.toString( 16 ) +
                          Math.abs( hashCode( attributes.feCustomCSS ) ).toString( 16 ).substring( 0, 6 );
            extraProps['data-fe-block-id'] = blockId;
        }
        return extraProps;
    }

    // Simple hash function for consistent ID generation
    function hashCode( str ) {
        var hash = 0;
        for ( var i = 0; i < str.length; i++ ) {
            var char = str.charCodeAt( i );
            hash = ( ( hash << 5 ) - hash ) + char;
            hash = hash & hash;
        }
        return hash;
    }

    addFilter(
        'blocks.getSaveContent.extraProps',
        'formatting-extender/add-block-data-attribute',
        addBlockDataAttribute
    );

} )( window.wp );
