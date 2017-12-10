var myGrid = {
    // codeEditor: document.querySelector( '.code-editor' ),
    codeEditor: document.querySelector( '#css-code' ),
    init: function() {
        var myGrid = this;
        myGrid.codeEditor.selectionStart = 20;
        // document.querySelector( '#css-code' ).addEventListener( 'keypress', function( evt ) {
        //     myGrid.captureKey( evt );
        // });
        // document.querySelector( '.code-editor' ).onkeypress = function( evt ) {
        myGrid.codeEditor.onkeypress = function( evt ) {
            var val = this.value;
            if ( evt.keyCode === 13 || evt.which === 13 ) {
                // myGrid.indentEnterKey('\u000A\u0020\u0020');
                // myGrid.indentEnterKey('\u03A9');

                var start, end;
                if ( typeof this.selectionStart === "number" && typeof this.selectionEnd === "number" ) {
                    start = this.selectionStart;
                    end = this.selectionEnd;
                    this.value = val.slice( 0, start ) + '\u000A\u0020\u0020' + val.slice( end );
                    
                    // move the caret
                    this.selectionStart = this.selectionEnd = start + 3;
                }

                return false;
            }
            myGrid.captureKey( evt );
        };
    },
    indentEnterKey: function( text ) {
        console.log( 'indented' );
        // var sel, range, textNode;
        // if ( window.getSelection ) {
        //     sel = window.getSelection();
        //     if ( sel.getRangeAt && sel.rangeCount ) {
        //         range = sel.getRangeAt( 0 );
        //         range.deleteContents();
        //         textNode = document.createTextNode( text );
        //         range.insertNode( textNode );

        //         // move caret to end of the newly inserted text node
        //         range.setStart( textNode, textNode.length );
        //         range.setEnd( textNode, textNode.length );
        //         sel.removeAllRanges();
        //         sel.addRange( range );
        //     } else if ( document.selection && document.selection.createRange ) {
        //         range = document.selection.createRange();
        //         range.pasteHTML( text );
        //     }
        // }
    },
    captureKey: function( evt ) {
        // console.log( 'args', evt );
        var gridContainer = document.querySelector( '.grid-container' );
        // var css = document.querySelector( '#css-code' ).value;
        // console.log( this.codeEditor );
        // var css = this.codeEditor.textContent;
        var css = this.codeEditor.value;
        console.log( 'css', css );
        this.filterKey( evt );
        // return false;
        
        var pattern = /([\w-]+:\s*[\w-#\s]+;?$)/gm;
        var cssStatements = '';
        if ( cssStatements = css.match( pattern ) ) {
            console.log( 'match', cssStatements );
            gridContainer.setAttribute( 'style', cssStatements.join( ' ' ) );
        }
    },
    filterKey: function( evt ) {
        if ( evt.keyCode === 13 || evt.which === 13 ) {
            console.log( "Enter" );
            return false;
        }
    }
};

window.onload = myGrid.init();