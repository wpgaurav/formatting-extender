( function( wp ) {
    var el = wp.element.createElement;
    var RichTextToolbarButton = wp.blockEditor.RichTextToolbarButton;
    var toggleFormat = wp.richText.toggleFormat;

    var highlightButton = function( props ) {
        return el(
            RichTextToolbarButton, {
                icon: 'superhero-alt',
                title: 'Highlight',
                onClick: function() {
                    props.onChange(
                        toggleFormat( props.value, {
                            type: 'formatting-extender/highlight'
                        })
                    );
                },
                isActive: props.isActive
            }
        );
    };

    wp.richText.registerFormatType(
        'formatting-extender/highlight', {
            title: 'Highlight',
            tagName: 'mark',
            className: null,
            attributes: {
                style: 'style'
            },
            edit: function( props ) {
                return el(
                    RichTextToolbarButton, {
                        icon: 'superhero-alt',
                        title: 'Highlight',
                        onClick: function() {
                            props.onChange(
                                toggleFormat( props.value, {
                                    type: 'formatting-extender/highlight',
                                    attributes: {
                                        style: 'background: linear-gradient(135deg, #fef08a 0%, #fde047 100%); padding: 0.1em 0.3em; border-radius: 3px; color: #1a1a1a; box-decoration-break: clone; -webkit-box-decoration-break: clone;'
                                    }
                                })
                            );
                        },
                        isActive: props.isActive
                    }
                );
            }
        }
    );
} )( window.wp );
