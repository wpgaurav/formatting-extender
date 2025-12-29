( function( wp ) {

    var badgeButton = function( props ) {
        return wp.element.createElement(
        wp.editor.RichTextToolbarButton, {
            icon: 'tag', 
            title: ' Badge', 
            onClick: function() {
                props.onChange( 
                    wp.richText.toggleFormat(props.value, {
                        type: 'formatting-extender/badge'
                    }) 
                );
            }
        }
    );
       
    }

    // wp.richText.unregisterFormatType('core/underline');
    wp.richText.registerFormatType(
        'formatting-extender/badge', {
            title: 'Badge',
            tagName: 'span',
            className: 'fe-badge',
            edit: badgeButton,
        }
    );
} )( window.wp );