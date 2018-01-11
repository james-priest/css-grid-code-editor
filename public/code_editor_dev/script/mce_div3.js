var myDivCodeEditor = {
    gridContainer: document.querySelector( '.grid-container' ),
    codeEditor: document.querySelector( '.div-code-editor' ),
    // constants: getConstants(),
    // reConstants: /(?<=:.*)((?<=[\s:])\d+|#[0-9A-Fa-f]{3,6}|\b(solid|dashed|dotted|grid)\b)/gm,
    reConstants: new RegExp('.*:\\s*|.*:|.*?{|[a-z]\\d+|\\w+\\(\\)|(\\d+|#[0-9A-Fa-f]{3,6}|\\b(' + getConstants() + ')(?![\\w-\\()]))', 'gm'),
    // reKeywords: /.*:\s*|.*:|(<\/span>)(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax|fr)(?=\W)/gm,
    reKeywords: new RegExp('.*:\\s*|.*:|(<\\/span>|\\d+)(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax|fr)(?=\\W|$)', 'gm'),
    currentDivLine: '',
    mouseClick: false,
    clickElem: '',
    clickPos: 0,
    init: function(preFill) {
        var thisGrid = this;

        //#region preFill & cursor
        // get code-editor, selection, & range
        var sel, range, textNode;
        thisGrid.codeEditor.focus();
        sel = window.getSelection();
        range = sel.getRangeAt( 0 );
        range.deleteContents();
        
        // loop through elements, append to docFragment, & insertNode into code-editor
        var el = document.createElement( 'div' );
        el.innerHTML = preFill;

        var frag = document.createDocumentFragment( 'div' ), node, lastNode;
        while ( ( node = el.firstChild ) ) {
            lastNode = frag.appendChild( node );
        }
        range.insertNode( frag );
        
        // set cursor on childNode 1, textNode 0, 2 spaces in
        if ( lastNode ) {
            textNode = thisGrid.codeEditor.childNodes[ 1 ];
            // range = range.cloneRange();

            range.setStart( textNode, 5 );
            range.collapse( true );

            sel.removeAllRanges();
            sel.addRange( range );

            // thisGrid.setCursor( thisGrid.codeEditor.childNodes[ 1 ].childNodes[ 0 ], 2 );
            // thisGrid.currentDivLine = thisGrid.getSelectedNode();
            thisGrid.currentDivLine = textNode.parentNode;
        }
       
        // --------------------------
        //#endregion
        
        thisGrid.codeEditor.oninput = function( evt ) {
            var selNode, working, prevValue;
            // selNode = thisGrid.getSelectedNode();
            var sel = window.getSelection();
            // var range = sel.getRangeAt( 0 );
            selNode = sel.anchorNode.parentElement;
            // selNode = thisGrid.currentDivLine; // containing div of the selected line
            
            console.log( '###############################################' );
            // console.log( evt );
            console.log( 'selNode:', selNode.nodeName + ',',  selNode.className + ',', 'nodeIndex: ' + Array.from(selNode.parentNode.children).indexOf(selNode) + ' of ' + selNode.parentNode.childNodes.length);
            console.log( evt.target.childNodes, '(div-code-editor.childNodes)' );
            console.log( evt );

            // working = selNode.textContent;
            working = selNode.innerHTML;
            prevValue = working;

            console.log( '-------------------' );
            // console.log( 'prevValue', prevValue );
            // console.log( 'working', working );

            // DONE: Call a function on string.replace & track prevNode & newNode 
            // if (working.includes(':')) {
            working = working.replace(thisGrid.reConstants, function(m, group1) {
                if (group1 !== undefined) {
                    return '<span class="mce-constant">' + group1 + '</span>';
                }
                return m;
            } );
            working = working.replace(thisGrid.reKeywords, function(m, group1, group2) {
                if (group1 !== undefined) {
                    return group1 + '<span class="mce-keyword">' + group2 + '</span>';
                }
                return m;
            } );
            // }

            // selNode.innerHTML = working;

            // console.log( '*** regex match and update innerHTML ***' );
            // console.log( 'prevValue', prevValue );
            console.log( 'selNode:', working );
            console.log( '-------------------' );
            
            if ( prevValue !== working ) {
                // console.log( 'new children' );
                // selNode.appendChild( document.createTextNode( '' ) ); // for semi-colon
                var el = document.createElement( 'div' );
                el.innerHTML = working;
                //TODO: HERE
            }

            
            // DONE: Set caret position
            // 1. use current sel.anchor.parent.children.lastChild
            // 2. length of innerText of last child

            // console.log( '1.', 'selNode', selNode );
            // console.log( '2a.', 'selNode.innerHTML', selNode.innerHTML );
            // console.log( '2b.', 'selNode.textContent', selNode.textContent );
            // console.log( '2c.', 'selNode.lastChild', selNode.lastChild );
            // console.log( '2c.', 'selNode.lastChild.nodeType', selNode.lastChild.nodeType );
            // console.log( '2c.', 'selNode.nodeType', selNode.nodeType );
            // console.log( '3.', 'selNode.childNodes', selNode.childNodes );
            // console.log( '4.', 'lastChild', selNode.lastChild );
            // console.log( '5.', 'lastChild.length', selNode.lastChild.textContent.length );
            // console.log( '6.', 'window.getSelection().getRangeAt(0)', window.getSelection().getRangeAt(0) );
            // console.log( '7.', 'window.getSelection()', window.getSelection() );
            // console.log( '8.', 'window.getSelection().anchorNode', window.getSelection().anchorNode );
            // console.log( '9.', 'window.getSelection().anchorNode.parentNode', window.getSelection().anchorNode.parentNode );
           
            /*
            var curElem, curPos;

            if ( thisGrid.mouseClick ) {
                thisGrid.mouseClick = false;
                // set the cursor ba
                curElem = thisGrid.clickElem.childNodes[ 0 ];
                switch (evt.inputType) {
                    case 'deleteContentBackward':
                        
                        if (thisGrid.clickPos === 2) {}    
                        curPos = thisGrid.clickPos - 1;
                        break;
                    case 'insertText':
                        curPos = thisGrid.clickPos + 1;
                        break;
                    default:
                        curPos = thisGrid.clickPos;    
                }
                thisGrid.setCursor( curElem, curPos );
            } else {
                // Do this when HTML has been inserted
                curElem = selNode.lastChild;
                curPos = 0;
                if ( selNode.lastChild.nodeType === 3 ) {
                    curPos = selNode.lastChild.textContent.length;
                } else {
                    curPos = selNode.lastChild.outerHTML.length;
                }
                thisGrid.setCursor( curElem, curPos );
            }
            */

            // set cursor
            // var range = window.getSelection().getRangeAt(0);
            // var selectedObj = window.getSelection();
            // var rangeCount = 0;
            // // var childNodes = selectedObj.anchorNode.parentNode.childNodes;
            // for (var i = 0; i < childNodes.length; i++) {
            //     if (childNodes[i] == selectedObj.anchorNode) {
            //         break;
            //     }
            //     if (childNodes[i].outerHTML)
            //         rangeCount += childNodes[i].outerHTML.length;
            //     else if (childNodes[i].nodeType == 3) {
            //         rangeCount += childNodes[i].textContent.length;
            //     }
            // }
            // var curElem = selNode.lastChild;
            // var curPos = selNode.lastChild.textContent.length;
            // thisGrid.setCursor(curElem, curPos);

            console.log( '' );
            thisGrid.applyStyle(evt);
        };

        thisGrid.codeEditor.onkeypress = function( evt ) {
            // console.log( 'onkeypress evt', evt );
            // <enter>
            /*
            if ( evt.keyCode === 13 || evt.which === 13 ) {
                sel = window.getSelection();
                range = sel.getRangeAt( 0 );
                console.log( range );
                // if EOL then newline
                // var newLineIndent = '  ';
                // thisGrid.insertNewLine( newLineIndent );
                // return false;
                // else chop end of line and pass it into function
            }*/
            // <ctrl>+/
            
        };

        thisGrid.codeEditor.onmouseup = function( evt ) {
            console.log( 'mouseClick true' );
            
            thisGrid.mouseClick = true;
            thisGrid.clickElem = thisGrid.getSelectedNode();
            thisGrid.clickPos = thisGrid.getCaretPosition();

            console.log( '  clickElem:     ', thisGrid.clickElem.nodeName + ',', thisGrid.clickElem.className + ',', '"' + thisGrid.clickElem.textContent + '"' );
            console.log( '  elem nodeType:', thisGrid.clickElem.nodeType );
            
            var selNode = thisGrid.currentDivLine; // containing div of the selected line
            console.log( '  currentDivLine:', selNode.nodeName + ',', selNode.className + ',','"' + selNode.textContent + '"' );

            // Do this when HTML has been inserted
            // var curElem = thisGrid.clickElem.childNodes[0];
            // var curPos = thisGrid.getCaretPosition();
            // thisGrid.setCursor( curElem, curPos );
        };
        // DONE: backspace - erase properly
        // TODO: onmouseup - set parent div for editing (right now its div-code-editor)
        // TODO: backspace - set proper curPos when deleting current line
        // TODO: paste - set proper curPos when pasting in a line
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
        // DONE: This changes rather than stay as the div line we are working on.
        // maybe create a property to track this
        if ( window.getSelection ) {
            var sel = window.getSelection();
            return sel.anchorNode.parentNode;
        }
    },
    insertNewLine: function( text ) {
        var prevNode, newNode;
        prevNode = this.currentDivLine;

        console.log( '--------' );
        console.log( 'new line' );
        console.log( 'prevNode:', prevNode.nodeName + ',', prevNode.className + ',', 'nodeIndex: ' + Array.from( prevNode.parentNode.children ).indexOf( prevNode ) + ' of ' + prevNode.parentNode.childNodes.length );

        newNode = document.createElement( 'div' );
        newNode.className = 'mce-line';
        newNode.appendChild( document.createTextNode( text ) );
        
        prevNode.parentNode.insertBefore( newNode, prevNode.nextSibling );
        
        this.currentDivLine = newNode.childNodes[ 0 ].parentNode;        
        this.setCursor( newNode.childNodes[0], 2 );
        
        var selNode = this.currentDivLine;
        console.log( 'selNode: ', selNode.nodeName + ',',  selNode.className + ',', 'nodeIndex: ' + Array.from(selNode.parentNode.children).indexOf(selNode) + ' of ' + selNode.parentNode.childNodes.length);
        
        
        console.log( '--------' );
    },
    applyStyle: function( evt ) {
        var css = evt.target.textContent;
        // console.log( css );
        var pattern = /([\w-]+:\s*[\w-#\s]+;?)/gm;
        var cssStatements = css.match( pattern );
        if ( cssStatements ) {
            this.gridContainer.setAttribute( 'style', cssStatements.join( ' ' ) );
        }
    },
    getCaretPosition: function() {
        if ( window.getSelection && window.getSelection().getRangeAt ) {
            var range = window.getSelection().getRangeAt( 0 );
            var selectedObj = window.getSelection();
            var rangeCount = 0;
            var childNodes = selectedObj.anchorNode.parentNode.childNodes;
            for ( var i = 0; i < childNodes.length; i++ ) {
                if ( childNodes[ i ] == selectedObj.anchorNode ) {
                    break;
                }
                if ( childNodes[ i ].outerHTML )
                    rangeCount += childNodes[ i ].outerHTML.length;
                else if ( childNodes[ i ].nodeType == 3 ) {
                    rangeCount += childNodes[ i ].textContent.length;
                }
            }
            return range.startOffset + rangeCount;
        }
        return -1;
    }
};