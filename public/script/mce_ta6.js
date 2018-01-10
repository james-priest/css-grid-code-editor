var myTACodeEditor = {
    gridContainer: document.querySelector( '.grid-container' ),
    taCodeEditor: document.querySelector( '.ta-code-editor' ),
    divCodeEditor: document.querySelector( '.div-code-display' ),

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
            // ta = mceObj.taCodeEditor,
            ta = evt.target,
            val = ta.value,
            selStart = ta.selectionStart,
            selEnd = ta.selectionEnd,
            selDir = ta.selectionDirection,
            lineStartPos = val.lastIndexOf( '\n', selStart - 1 ) > -1 ? val.lastIndexOf( '\n', selStart - 1 ) + 1 : 0,
            lineEndPos = val.indexOf( '\n', selEnd ) > -1 ? val.indexOf( '\n', selEnd ) : val.length,
            firstLineEndPos = val.indexOf( '\n' ) > -1 ? val.indexOf( '\n' ) : val.length,
            lastLineStartPos = val.lastIndexOf( '\n' ) > -1 ? val.lastIndexOf( '\n' ) + 1 : 0,
            posInLine = selStart - lineStartPos;
        console.log( '' );
        if ( ta.selectionDirection === 'forward' ) {
            console.log( 'after: ', 'selStart:', selStart, 'selEnd:', selEnd, 'selDirection:', selDir );
        } else {
            console.log( 'after: ', 'selStart:', selEnd, 'selEnd:', selStart, 'selDirection:', selDir );
        }
        console.log( '  lineStartPos:', lineStartPos, 'lineEndPos:', lineEndPos, 'posInLine', posInLine );
        console.log( '  firstLineStartPos:', 0, 'firstLineEndPos:', firstLineEndPos );
        console.log( '  lastLineStartPos:', lastLineStartPos, 'lastLineEndPos:', val.length );
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
    captureKeyDown: function( evt ) {
        const ENTER = 'Enter',
            TAB = 'Tab',    
            BACKSPACE = 'Backspace',
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
            val = ta.value,
            selStart = ta.selectionStart,
            lineStartPos = val.lastIndexOf( '\n', selStart-1 ) > -1 ? val.lastIndexOf( '\n', selStart-1 ) + 1 : 0,
            lineEndPos = val.indexOf( '\n', selStart ) > -1 ? val.indexOf( '\n', selStart ) : val.length;
        switch ( evt.key ) {
            case ENTER:
                var openBracketPos = val.lastIndexOf( '{', ta.selectionStart ),
                    closeBracketPos = val.lastIndexOf( '}', ta.selectionStart );
                if ( ( openBracketPos - ta.selectionStart ) > ( closeBracketPos - ta.selectionStart ) ) {
                    // mceObj.insertText2( ta, charNewLine + charTab, 0 );
                    document.execCommand( 'insertText', false, charNewLine + charTab );
                } else {
                    // mceObj.insertText2( ta, charNewLine, 0 );
                    document.execCommand( 'insertText', false, charNewLine );
                }
                break;
            case TAB:
                // mceObj.insertText2( ta, charTab, 0 );
                document.execCommand( 'insertText', false, charTab );
                break;    
            case COLON:
                var colonPos = val.indexOf( COLON, lineStartPos );
                var semiPos = val.indexOf( SEMI, lineStartPos );
                if ((colonPos > lineEndPos || colonPos === -1) && (semiPos > lineEndPos || semiPos === -1) ){
                    // mceObj.insertText( ta, COLON + SEMI, 1 );
                    mceObj.insertText2( ta, COLON + SEMI, -1 );
                } else {
                    return true;
                }
                break;
            case SEMI:
                if ( val.charAt(selStart)  === SEMI ) {
                    // mceObj.insertText2( ta, '', 1 );
                    document.execCommand( 'forwardDelete', false );
                    document.execCommand( 'insertText', false, SEMI );
                } else {
                    return true;
                }
                break;    
            case BACKSPACE:
                return true;
                // break;    
            case QUOTE:
                // mceObj.insertText( ta, QUOTE + QUOTE, 1 );
                mceObj.insertText2( ta, QUOTE + QUOTE, -1 );
                break;
            case APOSTROPHE:
                // mceObj.insertText( ta, APOSTROPHE + APOSTROPHE, 1 );
                mceObj.insertText2( ta, APOSTROPHE + APOSTROPHE, -1 );
                break;
            case LEFT_PAREN:
                // mceObj.insertText( ta, LEFT_PAREN + RIGHT_PAREN, 1 );
                mceObj.insertText2( ta, LEFT_PAREN + RIGHT_PAREN, -1 );
                break;
            case LEFT_BRACKET:
                // mceObj.insertText( ta, LEFT_BRACKET + RIGHT_BRACKET, 1 );
                mceObj.insertText2( ta, LEFT_BRACKET + RIGHT_BRACKET, -1 );
                break;
            case LEFT_CURLY_BRACE:
                if ( val.lastIndexOf( '{', selStart ) === -1 || ( val.lastIndexOf( '}', selStart ) > val.lastIndexOf( '{', selStart ) ) ) {
                    // mceObj.insertText( ta, LEFT_CURLY_BRACE + charNewLine + charTab + charNewLine + RIGHT_CURLY_BRACE, 3 );
                    mceObj.insertText2( ta, LEFT_CURLY_BRACE + charNewLine + charTab + charNewLine + RIGHT_CURLY_BRACE, -2 );
                } else {
                    return true;
                }
                break;    
            default:
                return true;
        }
        mceObj.taCodeEditor.dispatchEvent( new Event( 'input' ) );
        return false;
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
    insertText2: function( el, text, m ) {
        // this allows the browser's undo & redo features to work
        document.execCommand( 'insertText', false, text );
        el.selectionStart = el.selectionEnd =  el.selectionStart + m;
    },
    moveCursor: function( el, m ) {
        el.selectionStart = el.selectionEnd = el.selectionStart + m;
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
