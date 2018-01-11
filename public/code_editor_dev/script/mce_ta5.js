var myCodeEditor = {
    gridContainer: document.querySelector( '.grid-container' ),
    taCodeEditor: document.querySelector( '.ta-text-input' ),
    divCodeEditor: document.querySelector( '.div-text-layer' ),

    rxSelectors: /^[^/*][\S]+(?=\s*{)/gm,
    rxConstants: new RegExp('^[\\s\\w-]+|.*?{|\\w+\\(.*\\)|\\/\\*.*|(\\b(' + getConstants() + ')(?![\\w-\\()]))', 'gm'),
    rxKeywords: new RegExp('^[\\s\\w-]+:|\\/\\*.*|\\(.*\\)|([\\d.]+)(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax|fr)(?=\\W)', 'gm'),
    rxNumbers: /^[\s\w-]+:|.*?{|[a-z]\d+|\/\*.*|\(.*\)|([^:>("'/_-]\d*\.?\d+|#[0-9A-Fa-f]{3,6})/gm,
    rxProperties: /^[ \t\w-]+(?=:)/gm,
    rxFunctions: new RegExp( '\\/\\*.*|((' + getFunctions() + ')\\([\\w\\d `~!@#$%^&*()\\-_=+[\\]{}\\\\|:;' + String.fromCharCode(39) + '",.\\/?]*\\))', 'gm' ),
    rxQuotes: /^[/*].*\*\/|("[\w\s-]*"(?!>)|'[\w\s-]*'(?!>))/gm,
    rxRules: /(.+)\s*(?={)|^[\t\s]*(.+;)/gm,
    rxTextToWrap: /[\w\d\-[\] {}.:;#,>+'"=()/~^$*]+$/gm,
    rxFindComment: /\/\*|\*\//,
    rxReplaceComment: /\/\*|\*\//gm,
    rxComments: /\/\*.*\*\//gm,

    lastCursorColumn: -1,
    
    init: function(preFill, curPos) {
        var mceObj = this;
        mceObj.taCodeEditor.defaultValue = preFill;
        mceObj.taCodeEditor.selectionStart = mceObj.taCodeEditor.selectionEnd = curPos;
        
        mceObj.taCodeEditor.onkeydown = function( evt ) {
            // var result = mceObj.handleTAPosition( evt );
            // console.log( result );
            return mceObj.handleEditorKeystrokes( evt );
        };

        mceObj.taCodeEditor.oninput = function( evt ) {
            mceObj.highlightSyntax( mceObj.taCodeEditor.value );
            mceObj.processRules( evt );
        };

        mceObj.taCodeEditor.onkeyup = function( evt ) {
            return mceObj.captureKeyUp( evt );
        };

        // mceObj.taCodeEditor.onclick = function( evt ) {
        //     mceObj.taCodeEditor.focus();
        // };

        mceObj.taCodeEditor.dispatchEvent( new Event( 'input' ) );
    },
    /*
    handleTAPosition: function( evt ) {
        const ARROW_UP = 'ArrowUp',
            ARROW_RIGHT = 'ArrowRight',
            ARROW_DOWN = 'ArrowDown',
            ARROW_LEFT = 'ArrowLeft';
        var mceObj = this;
        var ta = mceObj.taCodeEditor,
            offsetLeft = ta.offsetLeft, scrollLeft = ta.scrollLeft, clientLeft = ta.clientLeft,
            offsetTop = ta.offsetTop, scrollTop = ta.scrollTop, clientTop = ta.clientTop;
        switch ( evt.key ) {
            case ARROW_UP:
                ta.style.top = (ta.offsetTop - ta.clientTop - 14) + 'px';
                break;    
            case ARROW_RIGHT:
                // ta.style.left = (ta.offsetLeft + ta.clientLeft + 7.4609) + 'px';    
                // ta.style.left = (ta.offsetLeft + ta.clientLeft + 7.6) + 'px';
                mceObj.moveTAPos( 'forward' );
                break;    
            case ARROW_DOWN:
                ta.style.top = (ta.offsetTop + ta.clientTop + 14) + 'px';
                break;    
            case ARROW_LEFT:
                // ta.style.left = (ta.offsetLeft + ta.clientLeft - 7.4609) + 'px';    
                // ta.style.left = ( ta.offsetLeft + ta.clientLeft - 7.6 ) + 'px';
                mceObj.moveTAPos( 'backward' );
                break;    
            default:
                return true;
        }
        console.log( 'offsetLeft', offsetLeft, 'scrollLeft', scrollLeft, 'clientLeft', clientLeft);
        console.log( 'offsetTop', offsetTop, 'scrollTop', scrollTop, 'clientTop', clientTop );
        return false;
    },
    */
    captureKeyUp: function( evt ) {
        const SLASH = '/';
        var mceObj = this,
            // ta = mceObj.taCodeEditor,
            ta = evt.target,
            val = evt.target.value,
            selStart = ta.selectionStart,
            selEnd = ta.selectionEnd,
            selDir = ta.selectionDirection,
            lineStartPos = val.lastIndexOf( '\n', selStart - 1 ) > -1 ? val.lastIndexOf( '\n', selStart - 1 ) + 1 : 0,
            lineEndPos = val.indexOf( '\n', selEnd ) > -1 ? val.indexOf( '\n', selEnd ) : val.length,
            firstLineEndPos = val.indexOf( '\n' ) > -1 ? val.indexOf( '\n' ) : val.length,
            lastLineStartPos = val.lastIndexOf( '\n' ) > -1 ? val.lastIndexOf( '\n' ) + 1 : 0,
            
            // linePos = selStart - lineStartPos,
            posInLine = val.lastIndexOf( '\t', selStart ) >= lineStartPos ? selStart - lineStartPos + 1 : selStart - lineStartPos,
            offsetLeft = ta.offsetLeft, scrollLeft = ta.scrollLeft, clientLeft = ta.clientLeft,
            offsetTop = ta.offsetTop, scrollTop = ta.scrollTop, clientTop = ta.clientTop;
        console.log( '' );
        console.log( 'Chars' );
        console.log( '  selStart:', selStart, 'posInLine', posInLine, 'this.lastCursorColumn', this.lastCursorColumn );
        console.log( '  lineStartPos:', lineStartPos, 'lineEndPos:', lineEndPos );
        console.log( '  firstLineStartPos:', 0, 'firstLineEndPos:', firstLineEndPos );
        console.log( '  lastLineStartPos:', lastLineStartPos, 'lastLineEndPos:', val.length );
        // if ( selDir === 'forward' ) {
        //     console.log( 'selStart:', selStart, 'selEnd:', selEnd, 'selDirection:', selDir );
        // } else {
        //     console.log( 'selStart:', selEnd, 'selEnd:', selStart, 'selDirection:', selDir );
        // }
        console.log( 'Pixels' );
        // console.log( '  offsetLeft', offsetLeft, 'clientLeft', clientLeft, 'scrollLeft', scrollLeft );
        // console.log( '  offsetTop', offsetTop, 'clientTop', clientTop, 'scrollTop', scrollTop );
        console.log( '  offsetLeft', offsetLeft, 'offsetTop', offsetTop );
        console.log( '  clientLeft', clientLeft, 'clientTop', clientTop );
        console.log( '  scrollLeft', scrollLeft, 'scrollTop', scrollTop );
        switch ( evt.key ) {
            case SLASH:
                if ( evt.ctrlKey ) {
                    mceObj.commentSelection( ta );
                } else {
                    return true;
                }
                break;   
        }
        mceObj.taCodeEditor.dispatchEvent( new Event( 'input' ) );
        return false;
    },
    commentSelection: function( el ) {
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

                newSlicedLine = this.toggleComment( slicedLine );
                el.value = val.slice( 0, lineStartPos ) + newSlicedLine + val.slice( lineEndPos );

                // set caret selection for comment
                if ( this.rxFindComment.test( slicedLine ) ) {
                    if ( selStart === lineStartPos ) {
                        posModifier = 0;
                    } else if ( selStart === lineEndPos ) {
                        posModifier = -4;
                    } else {
                        posModifier = -2;
                    }
                } else {
                    if ( selStart === lineStartPos ) {
                        posModifier = 0;
                    } else if ( selStart === lineEndPos ) {
                        posModifier = +4;
                    } else {
                        posModifier = +2;
                    }
                }
                curPos = selDir === 'forward' ? selEnd : selStart;
                el.selectionStart = el.selectionEnd = curPos + posModifier;
            } else {
                var lines = val.split( '\n' ),
                    selLineCount = 0, prevCommentLineCount = 0;
                console.log( '##########################' );
                console.log( 'before (lines):', lines );

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

                lineStartPos = 0; lineEndPos = 0;
                var newCommentLineCount = 0;
                lines.forEach( ( line, idx, arr ) => {
                    lineEndPos = lineStartPos + line.length;
                    if ( ( selStart <= lineEndPos ) && ( lineStartPos < selEnd ) ) {
                        var hasComment = this.rxFindComment.test( line );
                        if ( hasComment === false && doComment === true ) {
                            arr[ idx ] = mceObj.toggleComment( line );
                            newCommentLineCount += 1;
                        } else if ( hasComment && doComment === false  ) {
                            arr[ idx ] = mceObj.toggleComment( line );
                            newCommentLineCount -= 1;
                        }
                        selLineCount += 1;
                    }
                    lineStartPos = lineStartPos + line.length + 1;
                } );

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
            }
        }
    },
    toggleComment: function( slicedLine ) {
        var newSlicedLine,
            hasComment = this.rxFindComment.test( slicedLine );
        if ( hasComment ) {
            newSlicedLine = slicedLine.replace( this.rxReplaceComment, '' );
        } else {
            newSlicedLine = slicedLine.replace( this.rxTextToWrap, '/*' + '$&' + '*/' );
        }
        return newSlicedLine;
    },
    handleEditorKeystrokes: function( evt ) {
        const ENTER = 'Enter',
            TAB = 'Tab',    
            BACKSPACE = 'Backspace',
            SHIFT = 'Shift',
            ARROW_UP = 'ArrowUp',
            ARROW_RIGHT = 'ArrowRight',
            ARROW_DOWN = 'ArrowDown',
            ARROW_LEFT = 'ArrowLeft',
            DELETE = 'Delete',
            COLON = String.fromCharCode(58),
            SEMI = String.fromCharCode(59),
            QUOTE = String.fromCharCode(34),
            APOSTROPHE = String.fromCharCode( 39 ),
            LEFT_PAREN = String.fromCharCode(40),
            RIGHT_PAREN = String.fromCharCode( 41 ),
            LEFT_BRACKET = String.fromCharCode(91),
            RIGHT_BRACKET = String.fromCharCode(93),
            LEFT_CURLY_BRACE = String.fromCharCode(123),
            RIGHT_CURLY_BRACE = String.fromCharCode(125),
            charNewLine = String.fromCharCode( 10 ),
            charTab = String.fromCharCode( 9 );
            // charBackspace = String.fromCharCode( 8 );
        var mceObj = this,
            // ta = mceObj.taCodeEditor,
            ta = evt.target,
            val = evt.target.value,
            BoS = 0,
            EoS = val.length,
            selStart = ta.selectionStart,
            selEnd = ta.selectionEnd,
            selLen = selEnd - selStart,
            deletedText, deletedCharCode,
            lineStartPos = val.lastIndexOf( '\n', selStart - 1 ) > -1 ? val.lastIndexOf( '\n', selStart - 1 ) + 1 : 0,
            lineEndPos = val.indexOf( '\n', selStart ) > -1 ? val.indexOf( '\n', selStart ) : val.length,
            firstLineEndPos = val.indexOf( '\n' ) > -1 ? val.indexOf( '\n' ) : val.length,
            lastLineStartPos = val.lastIndexOf( '\n' ) > -1 ? val.lastIndexOf( '\n' ) : 0;
        // console.log( 'before:', 'selStart:', selStart );
        // console.log( 'before:', 'lineStartPos:', lineStartPos, 'lineEndPos:', lineEndPos );

        switch ( evt.key ) {
            case ENTER:
                var openBracketPos = ta.value.lastIndexOf( '{', ta.selectionStart ),
                    closeBracketPos = ta.value.lastIndexOf( '}', ta.selectionStart );
                if ( ( openBracketPos - ta.selectionStart ) > ( closeBracketPos - ta.selectionStart ) ) {
                    mceObj.insertText( ta, charNewLine + charTab, 2 );
                    mceObj.moveTAPos( 'newline-tab' );
                } else {
                    mceObj.insertText( ta, charNewLine, 1 );
                    mceObj.moveTAPos( 'newline' );
                }
                break;
            case TAB:
                mceObj.insertText( ta, charTab, 1 );
                mceObj.moveTAPos( 'tab' );                
                break;    
            case COLON:
                var colonPos = ta.value.indexOf( COLON, lineStartPos );
                var semiPos = ta.value.indexOf( SEMI, lineStartPos );
                if ((colonPos > lineEndPos || colonPos === -1) && (semiPos > lineEndPos || semiPos === -1) ){
                    mceObj.insertText( ta, COLON + SEMI, 1 );
                    mceObj.moveTAPos( 'forward' );
                } else {
                    mceObj.moveTAPos( 'forward' );
                    return true;
                }
                break;
            case BACKSPACE:
                if ( selLen ) {
                    deletedText = val.slice( selStart, selEnd );
                    console.log( 'deletedText', deletedText );
                } else {
                    deletedCharCode = val.charCodeAt( selStart - 1 );
                    console.log( 'deletedCharCode', deletedCharCode );
                }
                // if prev char is tab then move backward-tab
                if ( deletedCharCode === charTab.charCodeAt() ) {
                    mceObj.moveTAPos( 'backward-tab' );
                } else {
                    mceObj.moveTAPos( 'backward' );
                }
                return true;
                // break;    
            case QUOTE:
                mceObj.insertText( ta, QUOTE + QUOTE, 1 );
                break;
            case APOSTROPHE:
                mceObj.insertText( ta, APOSTROPHE + APOSTROPHE, 1 );
                break;
            case LEFT_PAREN:
                mceObj.insertText( ta, LEFT_PAREN + RIGHT_PAREN, 1 );
                break;
            case LEFT_BRACKET:
                mceObj.insertText( ta, LEFT_BRACKET + RIGHT_BRACKET, 1 );
                break;
            case LEFT_CURLY_BRACE:
                mceObj.insertText( ta, LEFT_CURLY_BRACE + charNewLine + charTab + charNewLine + RIGHT_CURLY_BRACE, 3 );
                break;
            case SHIFT:
                return true;
            case ARROW_RIGHT:
                var nextCharCode = val.charCodeAt( selStart );
                // console.log( 'selStart', selStart, 'val.length', val.length );
                if ( nextCharCode === 9 ) {
                    mceObj.moveTAPos( 'tab' );
                } else if ( nextCharCode === 13 || nextCharCode === 10 ) {
                    console.log( 'begin new line' );
                    mceObj.moveTAPos( 'newline' );
                } else if ( selStart >= val.length ) {
                    console.log( 'end of string' );
                    return true;
                } else {
                    mceObj.moveTAPos( 'forward' );
                }
                return true;
            case ARROW_LEFT:
                var prevCharCode = val.charCodeAt( selStart - 1 );
                // console.log( 'selStart', selStart );
                if ( prevCharCode === 9 ) {
                    mceObj.moveTAPos( 'backward-tab' );
                } else if ( prevCharCode === 13 || prevCharCode === 10 ) {
                    console.log( 'end prev line' );
                    mceObj.moveTAPos( 'end-prev-line' );
                } else if( selStart <= 0) {
                    console.log( 'beginning of string' );
                    return true;
                } else {
                    mceObj.moveTAPos( 'backward' );
                }
                return true;
            case ARROW_DOWN:
                console.log( '' );
                console.log( 'selStart', selStart, 'val.length', val.length );
                var posInLine = selStart - lineStartPos;
                console.log( 'lineStartPos', lineStartPos, 'lineEndPos', lineEndPos, 'posInLine', posInLine );
                var nextLineStartPos = val.indexOf( '\n', selStart ) > -1 ? val.indexOf( '\n', selStart ) + 1 : val.length,
                    nextLineEndPos = val.indexOf( '\n', nextLineStartPos ) > -1 ? val.indexOf( '\n', nextLineStartPos ) : val.length,
                    nextChar = val.charAt( nextLineStartPos + posInLine - 1);
                console.log( 'nextChar', nextChar, 'nextLineStartPos', nextLineStartPos, 'nextLineEndPos', nextLineEndPos );
                if ( selStart >= lastLineStartPos ) {
                    this.lastCursorColumn = selStart - lineStartPos;
                    mceObj.moveTAPos( 'eos' );
                } else {
                    mceObj.moveTAPos( 'down', this.lastCursorColumn );
                }
                return true;
            case ARROW_UP:
                console.log( '' );    
                console.log( 'selStart', selStart, 'val.length', val.length );
                var prevChar = val.charAt( selStart - 1 ),
                    prevLineStartPos = val.lastIndexOf( '\n', selStart-2 ) > -1 ? val.lastIndexOf( '\n', selStart-2 ) + 1: 0,
                    prevLineEndPos = val.indexOf( '\n', selStart - 1 ) > -1 ? val.indexOf( '\n', selStart - 1 ) : val.length,
                    prevLineLen = prevLineEndPos - prevLineStartPos;
                console.log( 'prevChar', prevChar, 'prevLineStartPos', prevLineStartPos, 'prevLineEndPos', prevLineEndPos, 'prevLineLen', prevLineLen );
                if ( selStart <= firstLineEndPos ) {
                    this.lastCursorColumn = selStart - lineStartPos;
                    mceObj.moveTAPos( 'bos' );
                } else {
                    mceObj.moveTAPos( 'up' );
                }
                return true;
            case DELETE:
                return true;
            default:
                if ( ( evt.which >= 32 && evt.which <= 126 ) && !evt.ctrlKey ) {
                    // only move forward on a-z, 0-9, etc
                    console.log( 'move cursor back on ctrl-z' );
                    mceObj.moveTAPos( 'forward' );
                }
                return true;
        }
        mceObj.taCodeEditor.dispatchEvent( new Event( 'input' ) );
        return false;
    },
    moveTAPos: function( type, m ) {
        var mceObj = this,
            ta = mceObj.taCodeEditor,
            val = ta.value,
            selStart = ta.selectionStart,
            selEnd = ta.selectionEnd,
            // len = selEnd - selStart,
            // deletedText, deletedCharCode,
            lineStartPos = val.lastIndexOf( '\n', selStart - 1 ) > -1 ? val.lastIndexOf( '\n', selStart - 1 ) + 1 : 0,
            lineEndPos = val.indexOf( '\n', selStart ) > -1 ? val.indexOf( '\n', selStart ) : val.length;
        // console.log( 'offsetLeft:', ta.offsetLeft, 'clientLeft', ta.clientLeft );
        // console.log( 'offsetTop:', ta.offsetTop, 'clientTop', ta.clientTop );
        // var w = 6.61313, h = 14.4;
        // var w = 6.61313, h = 14.4;
        // var w = 7.46094, h = 15;

        var b = 21, w = 7.48, h = 14.4;
        switch ( type ) {
            case 'forward':
                ta.style.left = (ta.offsetLeft + w) + 'px';
                break;
            case 'backward':
                ta.style.left = ( ta.offsetLeft - w ) + 'px';
                break;
            case 'tab':
                ta.style.left = (ta.offsetLeft + Math.floor(w) * 2) + 'px';
                break;
            case 'backward-tab':
                ta.style.left = ( ta.offsetLeft - Math.floor(w) * 2) + 'px';
                break;    
            case 'up':
                ta.style.top = (ta.offsetTop - 1 - h) + 'px';
                break;
            case 'down':
                if ( m > -1 ) {
                    console.log( 'm exists' );
                    ta.style.left = ( ta.offsetLeft + Math.floor( w ) * m ) + 'px';
                    // TODO: if selectionStart = 0 then set it to lineStartPos + this.lastCursorColumn
                    // TODO: ta ta.selectionStart = ta.selectionEnd = this.lastCursorColumn;
                    if ( ta.selectionStart === 0 ) {
                        if ( val.indexOf( '\t', lineStartPos ) <= lineEndPos ) {
                            ta.selectionStart = ta.selectionEnd = this.lastCursorColumn - 1;
                        } else {
                            ta.selectionStart = ta.selectionEnd = this.lastCursorColumn;
                        }
                        console.log( '+++++++', 'new cursor sel pos', ta.selectionStart );
                    }
                    this.lastCursorColumn = -1;
                }
                ta.style.top = (ta.offsetTop + 1 + h) + 'px';
                break;
            case 'newline':
                ta.style.left = ( b ) + 'px';
                ta.style.top = (ta.offsetTop + 1 + h) + 'px';
                break;
            case 'newline-tab':
                ta.style.left = ( b + Math.floor(w) * 2 ) + 'px';
                ta.style.top = (ta.offsetTop + 1 + h) + 'px';
                break;
            case 'end-prev-line':
                var prevCharCode = val.charCodeAt( selStart - 1 ),
                    prevLineStartPos = val.lastIndexOf( '\n', selStart-2 ) > -1 ? val.lastIndexOf( '\n', selStart-2 ) + 1: 0,
                    prevLineEndPos = val.indexOf( '\n', selStart - 1 ) > -1 ? val.indexOf( '\n', selStart - 1 ) : val.length,
                    prevLineLen = prevLineEndPos - prevLineStartPos;
                console.log( '' );
                console.log( 'prevLineStartPos', prevLineStartPos, 'prevLineEndPos', prevLineEndPos, 'prevLineLen', prevLineLen );
                
                // ta.style.left = ( 17.6 ) + 'px';
                // Test for tab; check for tab
                if ( val.slice( prevLineStartPos, prevLineEndPos ).includes( String.fromCharCode( 9 ) ) ) {
                    console.log( 'contains tab', 'prevLineLen', prevLineLen );
                    prevLineLen += 1;
                }
                // ta.style.left = (ta.offsetLeft + ta.clientLeft + (7.6 * (prevLineLen + 1))) + 'px';
                // ta.style.left = (ta.offsetLeft + ta.clientLeft + (w * (prevLineLen))) + 'px';
                console.log( 'a', ta.style.left );
                console.log( 'b', ( b + ( w * (prevLineLen - 1 ) ) ) + 'px' );
                console.log( 'c', ( b + Math.floor( w * (prevLineLen - 1 ) ) ) + 'px' );
                ta.style.left = (b + Math.floor(w) * prevLineLen) + 'px';
                ta.style.top = (ta.offsetTop -1 - h) + 'px';
                break;
            case 'bos':
                console.log( 'jump to beginning of string' );
                ta.style.left = ( b ) + 'px';
                // TODO: if selectionStart = 0 then set it to lineStartPos + this.lastCursorColumn
                console.log( '*******', 'selStart', selStart, 'lineStartPos', lineStartPos);
                break;    
            case 'eos':
                console.log( 'jump to end of string' );
                break;    
            default:
                return true;    
        }
    },
    insertText: function( el, text, curPos) {
        var start, end, val = el.value;
        if ( typeof el.selectionStart === 'number' && typeof el.selectionEnd === 'number' ) {
            start = el.selectionStart;
            end = el.selectionEnd;
            el.value = val.slice( 0, start ) + text + val.slice( end );
            
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
        formatted = formatted.replace( this.rxQuotes, function(m, group1) {
            if (group1 !== undefined) {
                return '<span class="mce-quotes">' + group1 + '</span>';
            }
            return m;
        } );
        formatted = formatted.replace( this.rxComments, '<span class="mce-comment">$&</span>' );
        
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
                if ( this.rxFindComment.test( m[ 2 ] ) === false ) {
                    rules += m[ 2 ];
                }
            }
            count += 1;
        }
        rulesArr.push( [prev.trim(), rules] );
        // console.log( rulesArr );

        this.clearStyle();
        rulesArr.forEach( rule => {
            this.applyStyle( rule[ 0 ], rule[ 1 ] );
        } );
    }
};
