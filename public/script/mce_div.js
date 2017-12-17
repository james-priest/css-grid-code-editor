var myDivCodeEditor = {
    gridContainer: document.querySelector( '.grid-container' ),
    codeEditor: document.querySelector( '.div-code-editor' ),
    constants: getConstants(),
    // reConstants: /(?<=:.*)((?<=[\s:])\d+|#[0-9A-Fa-f]{3,6}|\b(solid|dashed|dotted|grid)\b)/gm,
    reConstants: new RegExp('.*:\\s*|.*:|.*?{|[a-z]\\d+|\\w+\\(\\)|(\\d+|#[0-9A-Fa-f]{3,6}|\\b(' + getConstants() + ')(?![\\w-]))', 'gm'),
    reKeywords: /.*:\s*|.*:|(<\/span>)(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax|fr)(?=\W)/gm,
    init: function(preFill) {
        var thisGrid = this;
        thisGrid.codeEditor.innerHTML = preFill;
        thisGrid.codeEditor.focus();
        
        // console.log( 'childElementCount', this.codeEditor.childElementCount );
        // console.log( 'childNodes', this.codeEditor.childNodes[1].childNodes[0] );
        // console.log( 'children', this.codeEditor.children );
        // console.log( thisGrid.constants );
        console.log( thisGrid.reConstants );
        
        thisGrid.setCursor( this.codeEditor.childNodes[ 1 ].childNodes[0], 2 );

        thisGrid.codeEditor.oninput = function( evt ) {
            // filter current word
            // console.log( evt );
            var selNode, working, newNode;
            selNode = thisGrid.getSelectedNode();
            // working = selNode.textContent;
            working = selNode.innerHTML;

            console.log( 'sel', selNode );
            console.log( 'textContent', working );

            // keywords
            // working = working.replace( /(?<=\d)(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax|fr|s)(?=\W)/gm, '<span class="mce-keyword">$&</span>' );
            // constants
            // working = working.replace( /(?<=:.*)((?<=[\s:])\d+|\#[0-9A-Fa-f]{3,6}|\b(solid|dashed|dotted|grid)\b)/gm, '<span class="mce-constant">$&</span>' );
            // working = working.replace( /(?<=:.*)(\d+|#[0-9A-Fa-f]{3,6}|\b(solid|dashed|dotted|grid)\b)/gm, '<span class="mce-constant">$&</span>' );

            working = working.replace(thisGrid.reConstants, function(m, group1) {
                if (group1 !== undefined) {
                    return '<span class="mce-constant">' + group1 + '</span>';
                }
                return m;
            } );
            working = working.replace(thisGrid.reKeywords, function(m, group1, group2) {
                if (group1 !== undefined) {
                    // console.log(group1 + '<span>' + group2 + '</span>');
                    return group1 + '<span class="mce-keyword">' + group2 + '</span>';
                }
                return m;
            });

            // TODO: Call a function on the replace & track prevNode & newNode 
            
            // if ( working.includes( '<span' ) ) {
            //     newNode = selNode.childNodes[1]
            //     // thisGrid.setCursor( newNode.childNodes[0], newNode.childNodes[0].length );
            // }
            selNode.innerHTML = working;
            // console.log( selNode.lastChild );
            // console.log( selNode.children );

            // set cursor
            // console.log( selNode.innerHTML.length );
            // newNode = selNode.childNodes[1]
            // thisGrid.setCursor( newNode.childNodes[0], newNode.childNodes[0].length );
            thisGrid.setCursor( selNode.childNodes[0], selNode.childNodes[0].length )

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