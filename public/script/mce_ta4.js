var myTACodeEditor = {
    gridContainer: document.querySelector( '.grid-container' ),
    taCodeEditor: document.querySelector( '.ta-code-editor' ),
    divCodeEditor: document.querySelector( '.div-code-editor' ),

    rxSelectors: /[\S]+(?=\s*{)/gm,
    rxConstants: new RegExp('^[\\s\\w-]+|.*?{|\\w+\\(.*\\)|(\\b(' + getConstants() + ')(?![\\w-\\()]))', 'gm'),
    rxKeywords: new RegExp('^[\\s\\w-]+:|([\\d.]+)(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax|fr)(?=\\W)', 'gm'),
    rxNumbers: /^[\s\w-]+:|.*?{|[a-z]\d+|([^:>("'/_-]\d*\.?\d+|#[0-9A-Fa-f]{3,6})/gm,
    rxProperties: /^[ \t\w-]+(?=:)/gm,
    rxFunctions: new RegExp( '\\w+\\(\\)|((' + getFunctions() + ')\\([\\w"' + String.fromCharCode(39) + ':\\/\\._\\-]+\\))', 'gm' ),
    rxQuotes: /"[\w\s-]*"(?!>)|'[\w\s-]*'(?!>)/gm,
    rxRules: /(.+)\s*(?={)|^[\t\s]*(.+;)/gm,
    rxTextToWrap: /[\w\d\-[\] {}.:;#,>+'"=()/~^$*]+$/gm,
    rxFindComment: /\/\*|\*\//,
    rxReplaceComment: /\/\*|\*\//gm,
    
    init: function(preFill, curPos) {
        var mceObj = this;
        mceObj.taCodeEditor.defaultValue = preFill;
        mceObj.taCodeEditor.selectionStart = mceObj.taCodeEditor.selectionEnd = curPos;
        
        mceObj.taCodeEditor.onkeydown = function( evt ) {
            return mceObj.captureKeyDown( evt );
        };

        mceObj.taCodeEditor.oninput = function( evt ) {
            mceObj.highlightSyntax( mceObj.taCodeEditor.value );
            mceObj.processRules( evt );
        };

        mceObj.taCodeEditor.onkeyup = function( evt ) {
            return mceObj.captureKeyUp( evt );
        };

        mceObj.taCodeEditor.dispatchEvent( new Event( 'input' ) );
    },
    captureKeyUp: function( evt ) {
        const SLASH = '/';
        var mceObj = this,
            ce = mceObj.taCodeEditor,
            el = evt.target,
            // pos = ce.selectionStart,
            selStart = ce.selectionStart,
            selEnd = ce.selectionEnd,
            selDir = ce.selectionDirection,
            firstLineStartPos = ce.value.lastIndexOf( '\n', selStart - 1 ) > -1 ? ce.value.lastIndexOf( '\n', selStart - 1 ) + 1 : 0,
            lastLineEndPos = ce.value.indexOf( '\n', selEnd ) > -1 ? ce.value.indexOf( '\n', selEnd ) : ce.value.length;
        // console.log( 'after:', 'pos:', pos );
        console.log( '' );
        console.log( 'after:', 'firstLineStartPos:', firstLineStartPos, 'lastLineEndPos:', lastLineEndPos );
        if ( ce.selectionDirection === 'forward' ) {
            console.log( 'selStart:', selStart, 'selEnd:', selEnd, 'selDirection:', selDir );
        } else {

            console.log( 'selStart:', selEnd, 'selEnd:', selStart, 'selDirection:', selDir );
        }
        switch ( evt.key ) {
            case SLASH:
                if ( evt.ctrlKey ) {
                    mceObj.toggleComment( el );
                } else {
                    return true;
                }
                break;   
        }
        mceObj.taCodeEditor.dispatchEvent( new Event( 'input' ) );
        return false;
    },
    toggleComment: function( el ) {
        var mceObj = this,
            val = el.value,
            selStart = el.selectionStart,
            selEnd = el.selectionEnd,
            selDir = el.selectionDirection,
            firstLineStartPos = val.lastIndexOf( '\n', selStart - 1 ) > -1 ? val.lastIndexOf( '\n', selStart - 1 ) + 1 : 0,
            lastLineEndPos = val.indexOf( '\n', selEnd ) > -1 ? val.indexOf( '\n', selEnd ) : val.length,
            lineStartPos = 0, lineEndPos = 0;
            
        if ( typeof selStart === 'number' && typeof selEnd === 'number' ) {
            if ( selStart === selEnd ) {
                var slicedLine, newSlicedLine,
                    posModifier = 0, curPos = 0;
                
                lineStartPos = firstLineStartPos;
                lineEndPos = lastLineEndPos;
                slicedLine = val.slice( lineStartPos, lineEndPos );

                newSlicedLine = this.commentLine2( slicedLine );

                if ( this.rxFindComment.test( slicedLine ) ) {
                    // newSlicedLine = slicedLine.replace( this.rxReplaceComment, '' );
                    if ( selStart === lineStartPos ) {
                        posModifier = 0;
                    } else if ( selStart === lineEndPos ) {
                        posModifier = -4;
                    } else {
                        posModifier = -2;
                    }
                } else {
                    // newSlicedLine = slicedLine.replace( this.rxTextToWrap, '/*' + '$&' + '*/' );
                    if ( selStart === lineStartPos ) {
                        posModifier = 0;
                    } else if ( selStart === lineEndPos ) {
                        posModifier = +4;
                    } else {
                        posModifier = +2;
                    }
                }
                el.value = val.slice( 0, lineStartPos ) + newSlicedLine + val.slice( lineEndPos );

                // val = this.commentLine( el, slicedLine );
                // posModifier = this.commentLine( el, slicedLine );

                // console.log( 'posModifier', posModifier );
            
                // move the caret
                curPos = selDir === 'forward' ? selEnd : selStart;
                el.selectionStart = el.selectionEnd = curPos + posModifier;
            } else {
                // var selLineFrag = val.slice( selStart, selEnd );
                // if ( this.rxFindComment.test( selLineFrag ) === false ) {
                //     console.log
                // }

                console.log( '##########################' );
                var lines = val.split( '\n' );
                console.log( 'before (lines):', lines );

                var selLineCount = 0, prevCommentLineCount = 0;
                lines.forEach( ( line ) => {
                    lineEndPos = lineStartPos + line.length;
                    if ( ( selStart <= lineEndPos ) && ( lineStartPos < selEnd ) ) {
                        if ( this.rxFindComment.test( line ) === true ) {
                            prevCommentLineCount += 1;
                        }
                        selLineCount += 1;
                    }
                    lineStartPos = lineStartPos + line.length + 1;
                } );
                var doComment = true;
                if ( selLineCount === prevCommentLineCount ) {
                    doComment = false;
                }
                console.log( ' ', 'selLineCount:', selLineCount, 'prevCommentLineCount:', prevCommentLineCount );

                //#region old code
                // throw new Error("Halt execution");
                // var linesInfoArr = lines.map( x => [ x, x.length ] );
                // var start = 0, end = 0;
                // var linesInfoArr = lines.map( x => {
                //     end = start + x.length;
                //     var arr = [ x, start, end, x.length ];
                //     start = start + x.length + 1;
                //     return arr;
                // } );
                // console.log( 'selStart:', selStart, 'selEnd:', selEnd, 'selDir:', selDir );
                // console.log( 'before linesInfoArr:', linesInfoArr );

                // linesInfoArr.forEach( (item, idx, arr)  => {
                //     var line = item[0],
                //         lineStartPos = item[ 1 ],
                //         lineEndPos = item[ 2 ];
                //     if ( (lineStartPos < selStart && selStart < lineEndPos) || (lineStartPos < selEnd && selEnd < lineEndPos) ) {
                //         console.log( 'commented line:', line );
                //         arr[idx][0] = mceObj.commentLine2( el, line );
                //         // move the caret
                //         var pos = selDir === 'forward' ? selEnd : selStart;
                //         // el.selectionStart = el.selectionEnd = pos + posModifier;
                //         el.selectionStart = selStart + posModifier;
                //         el.selectionEnd = pos + (posModifier * 2);
                //     }
                // } );
                //#endregion
                
                lineStartPos = 0; lineEndPos = 0;
                var newCommentLineCount = 0;
                lines.forEach( ( line, idx, arr ) => {
                    lineEndPos = lineStartPos + line.length;
                    if ( ( selStart <= lineEndPos ) && ( lineStartPos < selEnd ) ) {
                        var hasComment = this.rxFindComment.test( line );
                        if ( hasComment === false && doComment === true ) {
                            arr[ idx ] = mceObj.commentLine2( line );
                            newCommentLineCount += 1;
                        } else if ( hasComment && doComment === false  ) {
                            arr[ idx ] = mceObj.commentLine2( line );
                            newCommentLineCount -= 1;
                        }
                        selLineCount += 1;

                        // arr[ idx ] = mceObj.commentLine3( line, doComment );
                        // newCommentLineCount += 1;
                    }
                    lineStartPos = lineStartPos + line.length + 1;
                } );

                // console.log( 'posModifier', posModifier );
                console.log( 'after (lines):', lines );
                console.log( ' ', 'newCommentLineCount:', newCommentLineCount );
                el.value = lines.join( '\n' );

                // set caret selection for comment
                if ( doComment ) {
                    if ( selStart === firstLineStartPos ) {
                        el.selectionStart = selStart;
                    } else if ( selStart > firstLineStartPos ) {
                        el.selectionStart = selStart + 2;
                    }
                    if ( selEnd < lastLineEndPos ) {
                        el.selectionEnd = selEnd + ( (prevCommentLineCount + newCommentLineCount) * 4 ) - 2;
                    } else if ( selEnd === lastLineEndPos ) {
                        el.selectionEnd = selEnd + ( (prevCommentLineCount + newCommentLineCount) * 4 );
                    }
                } else {
                    if ( selStart === firstLineStartPos ) {
                        el.selectionStart = selStart;
                    } else if ( selStart > firstLineStartPos ) {
                        el.selectionStart = selStart - 2;
                    }
                    if ( selEnd < lastLineEndPos ) {
                        el.selectionEnd = selEnd + ( (newCommentLineCount) * 4 ) + 2;
                    } else if ( selEnd === lastLineEndPos ) {
                        el.selectionEnd = selEnd + ( (newCommentLineCount) * 4 );
                    }
                }
                
                // for uncomment

                // var lineArr = val.slice( firstLineStartPos, lastLineEndPos ).split( '\n' );
                // lineArr.forEach( line => {
                //     console.log( line );
                //     posModifier = this.commentLine( el, line );
                // } );
            }
            
        }
    },
    commentLine: function( el, slicedLine ) {
        var val = el.value,
            selStart = el.selectionStart,
            selEnd = el.selectionEnd,
            lineStartPos = val.lastIndexOf( '\n', selStart - 1 ) > -1 ? val.lastIndexOf( '\n', selStart - 1 ) + 1 : 0,
            // lineEndPos = val.indexOf( '\n', selEnd ) > -1 ? val.indexOf( '\n', selEnd ) : val.length,
            lineEndPos = lineStartPos + slicedLine.length,
            newSlicedLine, posModifier = 0;
        if ( this.rxFindComment.test( slicedLine ) === false ) {
            newSlicedLine = slicedLine.replace( this.rxTextToWrap, '/*' + '$&' + '*/' );
            if ( selStart === lineStartPos ) {
                posModifier = 0;
            } else if ( selStart === lineEndPos ) {
                posModifier = +4;
            } else {
                posModifier = +2;
            }
        } else {
            newSlicedLine = slicedLine.replace( this.rxReplaceComment, '' );
            if ( selStart === lineStartPos ) {
                posModifier = 0;
            } else if ( selStart === lineEndPos ) {
                posModifier = -4;
            } else {
                posModifier = -2;
            }
        }
        // return val.slice( 0, lineStartPos ) + newSlicedLine + val.slice( lineEndPos );
        var newStr = val.slice( 0, lineStartPos ) + newSlicedLine + val.slice( lineEndPos );
        el.value = newStr;
        return posModifier;
    },
    commentLine2: function( slicedLine ) {
        var newSlicedLine,
            hasComment = this.rxFindComment.test( slicedLine );
        if ( hasComment ) {
            newSlicedLine = slicedLine.replace( this.rxReplaceComment, '' );
        } else {
            newSlicedLine = slicedLine.replace( this.rxTextToWrap, '/*' + '$&' + '*/' );
        }
        return newSlicedLine;
    },
    captureKeyDown: function( evt ) {
        const ENTER = 'Enter',
            TAB = 'Tab',    
            BACKSPACE = 'Backspace',
            COLON = String.fromCharCode(58),
            SEMI = String.fromCharCode(59),
            QUOTE = String.fromCharCode(34),
            APOSTROPHE = String.fromCharCode(39),
            LEFT_BRACKET = String.fromCharCode(123),
            RIGHT_BRACKET = String.fromCharCode(125),
            charNewLine = String.fromCharCode( 10 ),
            charTab = String.fromCharCode( 9 );
            // charBackspace = String.fromCharCode( 8 );
        var mceObj = this,
            ce = mceObj.taCodeEditor,
            el = evt.target,
            pos = ce.selectionStart,
            // lineStartPos = ce.value.lastIndexOf( '\n', pos ),
            // lineEndPos = ce.value.indexOf( '\n', pos );
            lineStartPos = ce.value.lastIndexOf( '\n', pos-1 ) > -1 ? ce.value.lastIndexOf( '\n', pos-1 ) + 1: 0,
            lineEndPos = ce.value.indexOf( '\n', pos ) > -1 ? ce.value.indexOf( '\n', pos ) : ce.value.length;
        // console.log( 'before:', 'pos:', pos );
        // console.log( 'before:', 'lineStartPos:', lineStartPos, 'lineEndPos:', lineEndPos );
        switch ( evt.key ) {
            case ENTER:
                var openBracketPos = ce.value.lastIndexOf( '{', ce.selectionStart ),
                    closeBracketPos = ce.value.lastIndexOf( '}', ce.selectionStart );
                if ( ( openBracketPos - ce.selectionStart ) > ( closeBracketPos - ce.selectionStart ) ) {
                    mceObj.insertText( el, charNewLine + charTab, 2 );
                } else {
                    mceObj.insertText( el, charNewLine, 1 );
                }
                break;
            case TAB:
                mceObj.insertText( el, charTab, 1 );
                break;    
            case COLON:
                var colonPos = el.value.indexOf( COLON, lineStartPos );
                if (colonPos > lineEndPos || colonPos === -1){
                    mceObj.insertText( el, COLON + SEMI, 1 );
                } else {
                    return true;
                }
                break;
            case BACKSPACE:
                return true;
                // break;    
            case QUOTE:
                mceObj.insertText( el, QUOTE + QUOTE, 1 );
                break;
            case APOSTROPHE:
                mceObj.insertText( el, APOSTROPHE + APOSTROPHE, 1 );
                break;
            case LEFT_BRACKET:
                mceObj.insertText( el, LEFT_BRACKET + charNewLine + charTab + charNewLine + RIGHT_BRACKET, 3 );
                break;    
            default:
                return true;
        }
        mceObj.taCodeEditor.dispatchEvent( new Event( 'input' ) );
        return false;
    },
    insertText: function( el, text, curPos, endText ) {
        var start, end, val = el.value;
        if ( typeof el.selectionStart === 'number' && typeof el.selectionEnd === 'number' ) {
            start = el.selectionStart;
            end = el.selectionEnd;
            if ( endText ) {
                el.value = val.slice( 0, start ) + text + endText + val.slice( end );
            } else {
                el.value = val.slice( 0, start ) + text + val.slice( end );
            }
            
            // move the caret
            el.selectionStart = el.selectionEnd = start + curPos;
        }
    },
    highlightSyntax: function( css ) {
        var formatted = css;

        formatted = formatted.replace( this.rxSelectors, '<span class="mce-selector">$&</span>' );
        formatted = formatted.replace( this.rxConstants, function(m, group1) {
            if (group1 !== undefined) {
                return '<span class="mce-constant">' + group1 + '</span>';
            }
            return m;
        } );
        formatted = formatted.replace( this.rxKeywords, function(m, group1, group2) {
            if (group1 !== undefined) {
                return group1 + '<span class="mce-keyword">' + group2 + '</span>';
            }
            return m;
        } );
        formatted = formatted.replace( this.rxProperties, '<span class="mce-property">$&</span>' );
        formatted = formatted.replace( this.rxFunctions, function(m, group1) {
            if (group1 !== undefined) {
                return '<span class="mce-function">' + group1 + '</span>';
            }
            return m;
        } );
        formatted = formatted.replace( this.rxNumbers, function(m, group1) {
            if (group1 !== undefined) {
                return '<span class="mce-number">' + group1 + '</span>';
            }
            return m;
        } );
        formatted = formatted.replace( this.rxQuotes, '<span class="mce-quotes">$&</span>' );

        this.divCodeEditor.innerHTML = formatted;
    },
    applyStyle: function( selector, declarations ) {
        var elArr = document.getElementById('sandbox').querySelectorAll( selector );
        elArr.forEach( el => {
            el.style = declarations;
        } );
    },
    clearStyle: function() {
        var elArr = document.getElementById('sandbox').querySelectorAll( '*' );
        elArr.forEach( el => {
            el.removeAttribute( 'style' );
        } );
    },
    processRules: function( evt ) {
        var css = evt.target.value;
        var m, selector, prev = '', rules = '', rulesArr = [], count=0;

        while ( ( m = this.rxRules.exec( css ) ) !== null ) {
            if ( m.index === this.rxRules.lastIndex ) {
                this.rxRules.lastIndex++;
            }
            // console.log( count, 'm[1]:', m[1] );
            // console.log( count, 'm[2]:', m[2] );
            
            if ( m[ 1 ] !== undefined ) {
                prev = prev ? prev : m[ 1 ];
                selector = m[ 1 ];
                if ( selector !== prev ) {
                    rulesArr.push([prev.trim(), rules] );
                    rules = [];
                    prev = selector;
                }
            } else {
                rules += m[ 2 ];
            }
            count += 1;
        }
        rulesArr.push( [prev.trim(), rules] );
        // console.log( rulesArr );

        this.clearStyle();
        rulesArr.forEach( rule => {
            this.applyStyle( rule[ 0 ], rule[ 1 ] );
        } );
        // this.applyStyle( 'div.target.dunes', 'border: 15px dotted darkblue; background-color: green;' );        
    }
};
