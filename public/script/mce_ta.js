var myTACodeEditor = {
    gridContainer: document.querySelector( '.grid-container' ),
    codeEditor: document.querySelector( '.ta-code-editor' ),
    init: function(preFill) {
        var thisGrid = this;
        thisGrid.codeEditor.defaultValue = preFill;
        thisGrid.codeEditor.selectionStart = thisGrid.codeEditor.selectionEnd = 20;
        thisGrid.codeEditor.oninput = function( evt ) {
            thisGrid.applyStyle(evt);
        };
        thisGrid.codeEditor.onkeypress = function( evt ) {
            var val = this.value;
            if ( evt.keyCode === 13 || evt.which === 13 ) {
                var newLineIndent = '\u000A\u0020\u0020';
                var start, end;
                if ( typeof this.selectionStart === 'number' && typeof this.selectionEnd === 'number' ) {
                    start = this.selectionStart;
                    end = this.selectionEnd;
                    this.value = val.slice( 0, start ) + newLineIndent + val.slice( end );
                    
                    // move the caret
                    this.selectionStart = this.selectionEnd = start + 3;
                }
                return false;
            }
        };
    },
    applyStyle: function( evt ) {
        var css = evt.target.value;
        var pattern = /([\w-]+:\s*[\w-#\s]+;?$)/gm;
        var cssStatements = css.match( pattern );
        if ( cssStatements ) {
            this.gridContainer.setAttribute( 'style', cssStatements.join( ' ' ) );
        }
    }
};