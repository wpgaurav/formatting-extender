( function( wp ) {
    var el = wp.element.createElement;
    var Fragment = wp.element.Fragment;
    var useState = wp.element.useState;
    var useEffect = wp.element.useEffect;
    var useRef = wp.element.useRef;
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

            // Use clientId for editor preview (PHP uses different ID for frontend)
            var editorBlockSelector = '#block-' + clientId;

            // State for CSS validation (warning only, doesn't block saving)
            var validationState = useState( { hasWarning: false, message: '' } );
            var validation = validationState[0];
            var setValidation = validationState[1];

            // Ref for debounce timer
            var debounceRef = useRef( null );

            // Validate CSS (basic security check) - returns warning, doesn't block
            function validateCSS( css ) {
                if ( ! css || css.trim() === '' ) {
                    return { hasWarning: false, message: '' };
                }

                // Check for potentially dangerous patterns
                var dangerousPatterns = [
                    { pattern: /expression\s*\(/i, msg: 'CSS expressions are not allowed.' },
                    { pattern: /javascript\s*:/i, msg: 'JavaScript URLs are not allowed.' },
                    { pattern: /behavior\s*:/i, msg: 'IE behaviors are not allowed.' },
                    { pattern: /-moz-binding/i, msg: 'XBL bindings are not allowed.' },
                    { pattern: /@import/i, msg: '@import is not allowed.' },
                    { pattern: /@charset/i, msg: '@charset is not allowed.' },
                    { pattern: /url\s*\(\s*["']?\s*data:/i, msg: 'Data URLs are not allowed.' }
                ];

                for ( var i = 0; i < dangerousPatterns.length; i++ ) {
                    if ( dangerousPatterns[i].pattern.test( css ) ) {
                        return {
                            hasWarning: true,
                            message: dangerousPatterns[i].msg
                        };
                    }
                }

                // Check for balanced braces (warning only)
                var openBraces = ( css.match( /\{/g ) || [] ).length;
                var closeBraces = ( css.match( /\}/g ) || [] ).length;
                if ( openBraces !== closeBraces ) {
                    return {
                        hasWarning: true,
                        message: 'Unbalanced braces: ' + openBraces + ' opening, ' + closeBraces + ' closing.'
                    };
                }

                return { hasWarning: false, message: '' };
            }

            function onCSSChange( newCSS ) {
                // Always save the CSS immediately
                setAttributes( { feCustomCSS: newCSS } );

                // Clear any pending validation
                if ( debounceRef.current ) {
                    clearTimeout( debounceRef.current );
                }

                // Debounce validation - wait 800ms after user stops typing
                debounceRef.current = setTimeout( function() {
                    var result = validateCSS( newCSS );
                    setValidation( result );
                }, 800 );
            }

            // Cleanup debounce on unmount
            useEffect( function() {
                return function() {
                    if ( debounceRef.current ) {
                        clearTimeout( debounceRef.current );
                    }
                };
            }, [] );

            // Apply CSS in editor preview
            useEffect( function() {
                var styleId = 'fe-custom-css-' + clientId;

                if ( ! customCSS ) {
                    // Remove any existing style
                    var existingStyle = document.getElementById( styleId );
                    if ( existingStyle ) {
                        existingStyle.remove();
                    }
                    return;
                }

                var styleEl = document.getElementById( styleId );

                if ( ! styleEl ) {
                    styleEl = document.createElement( 'style' );
                    styleEl.id = styleId;
                    document.head.appendChild( styleEl );
                }

                // Scope CSS to this block in editor using block wrapper ID
                var scopedCSS = customCSS.replace( /%root%/g, editorBlockSelector );
                scopedCSS = scopedCSS.replace( /%ROOT%/g, editorBlockSelector );

                styleEl.textContent = scopedCSS;

                // Cleanup on unmount
                return function() {
                    var el = document.getElementById( styleId );
                    if ( el ) {
                        el.remove();
                    }
                };
            }, [ customCSS, clientId ] );

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
                            el( 'code', { style: { color: '#1e40af' } }, '%root%' )
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
                            'Use %root% as placeholder for the block selector. Example:'
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
                            '%root% {\n  background: #f5f5f5;\n  padding: 20px;\n}\n\n%root% p {\n  color: #333;\n}'
                        ),
                        validation.hasWarning && el(
                            Notice,
                            {
                                status: 'warning',
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
                                placeholder: '%root% {\n  /* Your CSS here */\n}',
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

} )( window.wp );
