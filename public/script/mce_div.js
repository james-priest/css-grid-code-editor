var myDivCodeEditor = {
    gridContainer: document.querySelector( '.grid-container' ),
    codeEditor: document.querySelector( '.div-code-editor' ),
    // constants: getConstants(),
    // reConstants: /(?<=:.*)((?<=[\s:])\d+|#[0-9A-Fa-f]{3,6}|\b(solid|dashed|dotted|grid)\b)/gm,
    reConstants: new RegExp('.*:\\s*|.*:|.*?{|[a-z]\\d+|\\w+\\(\\)|(\\d+|#[0-9A-Fa-f]{3,6}|\\b(' + getConstants() + ')(?![\\w-]))', 'gm'),
    // reKeywords: /.*:\s*|.*:|(<\/span>)(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax|fr)(?=\W)/gm,
    reKeywords: new RegExp('.*:\\s*|.*:|(<\\/span>|\\d+)(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax|fr)(?=\\W|$)', 'gm'),
    currentDivLine: '',
    mouseClick: false,
    clickElem: '',
    clickPos: 0,
    init: function(preFill) {
        var thisGrid = this;
        thisGrid.codeEditor.innerHTML = preFill;
        thisGrid.codeEditor.focus();
        
        // console.log( 'childElementCount', this.codeEditor.childElementCount );
        // console.log( 'childNodes', this.codeEditor.childNodes[1].childNodes[0] );
        // console.log( 'children', this.codeEditor.children );
        // console.log( thisGrid.constants );
        // console.log( thisGrid.reConstants );
        
        thisGrid.setCursor( this.codeEditor.childNodes[ 1 ].childNodes[ 0 ], 2 );
        thisGrid.currentDivLine = thisGrid.getSelectedNode();

        thisGrid.codeEditor.oninput = function( evt ) {
            // console.log( evt );
            console.log( '' );
            var selNode, working, prevValue;
            
            // selNode = thisGrid.getSelectedNode();
            selNode = thisGrid.currentDivLine; // containing div of the selected line
            console.log( 'selNode', selNode.nodeName );
            console.log( evt );

            working = selNode.textContent;
            // working = selNode.innerHTML;
            prevValue = working;

            console.log( '-------------------' );
            console.log( 'prevValue', prevValue );
            console.log( 'working', working );

            // DONE: Call a function on string.replace & track prevNode & newNode 
            if (working.includes(':')) {
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
            }    

            selNode.innerHTML = working;

            console.log( '*** regex match and update innerHTML ***' );
            console.log( 'prevValue', prevValue );
            console.log( 'working', working );
            console.log( '-------------------' );
            
            if ( prevValue === working ) {
                console.log( 'same child' );
            } else {
                console.log( 'new children' );
                selNode.appendChild( document.createTextNode( '' ) );
            }

            /**
             * DONE: Set caret position
             * 1. use current sel.anchor.parent.children.lastChild
             * 2. length of innerText of last child
             */

            console.log( '1.', 'sel', selNode );
            console.log( '2a.', 'selNode.innerHTML', selNode.innerHTML );
            console.log( '2b.', 'selNode.textContent', selNode.textContent );
            console.log( '2c.', 'selNode.lastChild', selNode.lastChild );
            console.log( '2c.', 'selNode.lastChild.nodeType', selNode.lastChild.nodeType );
            console.log( '2c.', 'selNode.nodeType', selNode.nodeType );


            var childNodes = selNode.childNodes;
            console.log( '3.', 'childNodes', childNodes );
            // console.log( '4.', 'lastChild', selNode.lastChild );
            // console.log( '5.', 'lastChild.length', selNode.lastChild.textContent.length );
            // console.log( '6.', 'window.getSelection().getRangeAt(0)', window.getSelection().getRangeAt(0) );
            // console.log( '7.', 'window.getSelection()', window.getSelection() );
            // console.log( '8.', 'window.getSelection().anchorNode', window.getSelection().anchorNode );
            // console.log( '9.', 'window.getSelection().anchorNode.parentNode', window.getSelection().anchorNode.parentNode );
           
            if ( thisGrid.mouseClick ) {
                thidGrid.mouseClick = false;
            } else {
                var curElem = selNode.lastChild;
                var curPos = 0;
                if ( selNode.lastChild.nodeType === 3 ) {
                    curPos = selNode.lastChild.textContent.length;
                } else {
                    // curElem = selNode.lastChild;
                    curPos = selNode.lastChild.outerHTML.length;
                }

                thisGrid.setCursor( curElem, curPos );
            }
            

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
        thisGrid.codeEditor.onmouseup = function( evt ) {
            console.log( 'mouseup true' );
            thisGrid.mouseup = true;
            thisGrid.clickElem = thisGrid.getSelectedNode();
            console.log( '  clickElem:     ', thisGrid.clickElem.nodeName, thisGrid.clickElem.className, '"' + thisGrid.clickElem.textContent + '"');
            
            var selNode = thisGrid.currentDivLine; // containing div of the selected line
            console.log( '  currentDivLine:', selNode.nodeName, selNode.className, '"' + selNode.textContent + '"' );
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
        this.currentDivLine = newNode.childNodes[ 0 ].parentNode;        
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