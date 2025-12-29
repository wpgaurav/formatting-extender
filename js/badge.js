( function( wp ) {
    var el = wp.element.createElement;
    var RichTextToolbarButton = wp.blockEditor.RichTextToolbarButton;
    var toggleFormat = wp.richText.toggleFormat;

    wp.richText.registerFormatType(
        'formatting-extender/badge', {
            title: 'Badge',
            tagName: 'span',
            className: null,
            attributes: {
                style: 'style'
            },
            edit: function( props ) {
                return el(
                    RichTextToolbarButton, {
                        icon: 'tag',
                        title: 'Badge',
                        onClick: function() {
                            props.onChange(
                                toggleFormat( props.value, {
                                    type: 'formatting-extender/badge',
                                    attributes: {
                                        style: 'background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); border-radius: 4px; color: #ffffff; margin-left: 4px; font-size: 0.8em; font-weight: 600; padding: 0.2em 0.5em; text-transform: uppercase; letter-spacing: 0.03em; display: inline-block; line-height: 1.4; vertical-align: middle; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);'
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
