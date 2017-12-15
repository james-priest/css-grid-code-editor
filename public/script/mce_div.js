var myDivCodeEditor = {
    gridContainer: document.querySelector( '.grid-container' ),
    codeEditor: document.querySelector( '.div-code-editor' ),
    init: function(preFill) {
        var thisGrid = this;
        thisGrid.codeEditor.innerHTML = preFill;
        thisGrid.codeEditor.focus();
        
        // console.log( 'childElementCount', this.codeEditor.childElementCount );
        // console.log( 'childNodes', this.codeEditor.childNodes[1].childNodes[0] );
        // console.log( 'children', this.codeEditor.children );
        
        thisGrid.setCursor( this.codeEditor.childNodes[ 1 ].childNodes[0], 2 );

        thisGrid.codeEditor.oninput = function( evt ) {
            // filter current word
            // console.log( evt );
            var selNode = thisGrid.getSelectedNode();
            // var sel = window.getSelection().anchorNode.parentNode.parentNode;
            console.log( 'sel', selNode );

            

            
            console.log( selNode.innerText );
            // if ( sel.contains( 'display' ) ) {
            //     console.log( 'got it' );
            // }
            // console.log( sel.textContent );
            var keyword = 'display';
            if ( selNode.innerText.trim() === keyword ) {
                console.log( 'got it' );

                var sel = window.getSelection();
                console.log( sel );


                // var newNode = document.createElement( 'span' );
                // newNode.className = 'mce-keyword';
                // newNode.appendChild( document.createTextNode( 'display' ) );

                // selNode.appendChild( newNode );
            }




            thisGrid.applyStyle(evt);
        };
        thisGrid.codeEditor.onkeypress = function( evt ) {
            // <enter>
            if ( evt.keyCode === 13 || evt.which === 13 ) {
                var newLineIndent = '  ';
                thisGrid.insertNewLine( newLineIndent );
                return false;
            }
            // <ctrl>+/
            
            
        };
    },
    setCursor: function(textNode, pos) {
        var range, sel;
        if ( window.getSelection ) {
            range = document.createRange();
            range.setStart( textNode, pos );
            range.setEnd( textNode, pos );
            sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange( range );
        }
    },
    getSelectedNode: function() {
        if ( window.getSelection ) {
            var sel = window.getSelection();
            return sel.anchorNode.parentNode;
        }
    },
    insertNewLine: function( text ) {
        var prevNode, newNode;
        // if ( window.getSelection ) {
        // sel = window.getSelection();
        // prevNode = sel.anchorNode.parentNode;
        prevNode = this.getSelectedNode();
        // if ( sel.getRangeAt && sel.rangeCount ) {
        newNode = document.createElement( 'div' );
        newNode.className = 'mce-line';
        newNode.appendChild( document.createTextNode( text ) );
        // textNode = document.createDocumentFragment().appendChild( text );
        // range.insertNode( newNode );
        // range.insertAdjacentHTML( 'afterend', newNode );
        // sel.anchorNode.insertAdjacentHTML( 'afterend', newNode );
        // sel.anchorNode.parentNode.appendChild( newNode );
        // prevNode.insertAdjacentHTML( 'afterend', '<div class="mce-line">  </div>' );

        prevNode.parentNode.insertBefore( newNode, prevNode.nextSibling );
        // this.setCursor( textNode, textNode.length );
        this.setCursor( newNode.childNodes[0], 2 );
        // }
        // }
    },
    applyStyle: function( evt ) {
        var css = evt.target.textContent;
        // console.log( css );
        var pattern = /([\w-]+:\s*[\w-#\s]+;?)/gm;
        var cssStatements = css.match( pattern );
        if ( cssStatements ) {
            this.gridContainer.setAttribute( 'style', cssStatements.join( ' ' ) );
        }
    }
};