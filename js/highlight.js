( function( wp ) {

    var badgeButton = function( props ) {
        return wp.element.createElement(
        wp.editor.RichTextToolbarButton, {
            icon: 'superhero-alt', 
            title: ' Highlight', 
            onClick: function() {
                props.onChange( 
                    wp.richText.toggleFormat(props.value, {
                        type: 'formatting-extender/highlight'
                    }) 
                );
            }
        }
    );
       
    }

    // wp.richText.unregisterFormatType('core/underline');
    wp.richText.registerFormatType(
        'formatting-extender/highlight', {
            title: 'Highlight',
            tagName: 'span',
            className: 'fe-highlight',
            edit: badgeButton,
        }
    );
} )( window.wp );