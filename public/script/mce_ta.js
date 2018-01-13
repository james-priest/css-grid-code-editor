var myTACodeEditor = {
    gridContainer: document.querySelector( '.grid-container' ),
    taCodeEditor: document.querySelector( '.ta-code-editor' ),
    divCodeDisplay: document.querySelector( '.div-code-display' ),

    rxSelectors: /^[\w .\-#[\]'"=:()>^~*+,|$]+(?={)/gm,
    rxHtmlElements: new RegExp('\\/\\*.*|<.*?>|\\b(' + getHtmlElements() + ')\\b(?=.*{)','gm'),
    rxConstants: new RegExp('^[\\s\\w-]+|.*?{|\\w+\\(.*\\)|\\/\\*.*|<.*>|(\\b(' + getConstants() + ')(?![\\w-\\()]))', 'gm'),
    rxKeywords: new RegExp('^[\\s\\w-]+:|\\/\\*.*|\\(.*\\)|([\\d.]+)(ch|cm|deg|em|ex|fr|gd|grad|Hz|in|kHz|mm|ms|pc|pt|px|rad|rem|s|turn|vh|vm|vmin|vmax|vw|%)(?=\\W)', 'gm'),
    rxNumbers: /^[\s\w-]+:|.*?{|[a-z]\d+|\/\*.*|\(.*\)|([^:>("'/_-]\d*\.?\d+|#[0-9A-Fa-f]{3,6})/gm,
    rxProperties: /^[ \t\w-]+(?=:)/gm,
    rxFunctions: new RegExp( '\\/\\*.*|((' + getFunctions() + ')\\([\\w\\d `~!@#$%^&*()\\-_=+[\\]{}\\\\|:;' + String.fromCharCode(39) + '",.\\/?]*\\))', 'gm' ),
    rxQuotes: /^[/*].*\*\/|("[\w\s-]*"(?!>)|'[\w\s-]*'(?!>))/gm,
    rxRules: /(.+)\s*(?={)|^[\t\s]*(.+;)/gm,
    rxTextToWrap: /[\w\d\-[\] {}.:;#,>+'"=()/~^$*]+$/gm,
    rxBlockToWrap: /[\w\d\-[\] {}.:;#,>+'"=()/~^$*\t]+$/gm,
    rxFindComment: /\/\*|\*\//,
    rxReplaceComment: /\/\*|\*\//gm,
    rxComments: /\/\*.*\*\//gm,
    
    browser: { chrome: 0, ie: 0, firefox: 0, safari: 0, opera: 0, edge: 0 },
    init: function(preFill, curPos) {
        var mceObj = this;
        mceObj.sniffBrowser();
        if ( mceObj.browser.ie ) {
            mceObj.taCodeEditor.value = preFill;
        } else {
            mceObj.taCodeEditor.defaultValue = preFill;
        }
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

        mceObj.triggerInputEvent();
    },
    triggerInputEvent: function() {
        var mceObj = this;
        if ( mceObj.browser.ie ) {
            var event = document.createEvent( 'Event' );
            event.initEvent( 'input', false, true );
            mceObj.taCodeEditor.dispatchEvent( event );
        } else {
            mceObj.taCodeEditor.dispatchEvent( new Event( 'input' ) );
        }
    },
    sniffBrowser: function() {
        this.browser.chrome = navigator.userAgent.indexOf('Chrome') > -1;
        this.browser.ie = navigator.userAgent.indexOf( 'MSIE' ) > -1 ||
            navigator.userAgent.indexOf( 'Trident/7.' ) > -1;
        this.browser.firefox = navigator.userAgent.indexOf('Firefox') > -1;
        this.browser.safari  = navigator.userAgent.indexOf('Safari') > -1;
        this.browser.edge    = navigator.userAgent.indexOf('Edge') > -1;
        this.browser.opera   = navigator.userAgent.toLowerCase().indexOf('op') > -1;
        if ( ( this.browser.chrome ) && ( this.browser.safari ) ) { this.browser.safari = false; }
        if ( ( this.browser.chrome ) && ( this.browser.opera ) ) { this.browser.chrome = false; }
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
        mceObj.triggerInputEvent();
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

                newSlicedLine = this.toggleComment( slicedLine, false );
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

                // lines.forEach( ( line ) => {
                lines.forEach( function( line ){
                    lineEndPos = lineStartPos + line.length;
                    if ( ( selStart <= lineEndPos ) && ( lineStartPos < selEnd ) ) {
                        if ( mceObj.rxFindComment.test( line ) === true ) {
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
                // lines.forEach( ( line, idx, arr ) => {
                lines.forEach( function( line, idx, arr ) {
                    lineEndPos = lineStartPos + line.length;
                    if ( ( selStart <= lineEndPos ) && ( lineStartPos < selEnd ) ) {
                        var hasComment = mceObj.rxFindComment.test( line );
                        if ( hasComment === false && doComment === true ) {
                            // arr[ idx ] = mceObj.toggleComment( line );
                            newCommentLineCount += 1;
                        } else if ( hasComment && doComment === false  ) {
                            // arr[ idx ] = mceObj.toggleComment( line );
                            newCommentLineCount -= 1;
                        }
                        arr[ idx ] = mceObj.toggleComment( line, true );
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
    toggleComment: function( slicedLine, isBlock ) {
        var newSlicedLine,
            hasComment = this.rxFindComment.test( slicedLine );
        if ( hasComment ) {
            newSlicedLine = slicedLine.replace( this.rxReplaceComment, '' );
        } else {
            if ( isBlock ) {
                newSlicedLine = slicedLine.replace( this.rxBlockToWrap, '/*' + '$&' + '*/' );
            } else {
                newSlicedLine = slicedLine.replace( this.rxTextToWrap, '/*' + '$&' + '*/' );
            }
            
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
            charTab = String.fromCharCode( 9 ),
            FIREFOX = this.browser.firefox;
            // charBackspace = String.fromCharCode( 8 );
        var mceObj = this,
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
                    if ( FIREFOX ) {
                        mceObj.insertText( ta, charNewLine + charTab, 2 );
                    } else {
                        // mceObj.insertText2( ta, charNewLine + charTab, 0 );
                        document.execCommand( 'insertText', false, charNewLine + charTab );
                    }
                } else {
                    if ( FIREFOX ) {
                        mceObj.insertText( ta, charNewLine, 1 );
                    } else {
                        // mceObj.insertText2( ta, charNewLine, 0 );
                        document.execCommand( 'insertText', false, charNewLine );
                    }
                }
                break;
            case TAB:
                if ( FIREFOX ) {
                    mceObj.insertText( ta, charTab, 1 );
                } else {
                    // mceObj.insertText2( ta, charTab, 0 );
                    document.execCommand( 'insertText', false, charTab );
                }
                break;    
            case COLON:
                var colonPos = val.indexOf( COLON, lineStartPos );
                var semiPos = val.indexOf( SEMI, lineStartPos );
                if ((colonPos > lineEndPos || colonPos === -1) && (semiPos > lineEndPos || semiPos === -1) ){
                    if ( FIREFOX ) {
                        mceObj.insertText( ta, COLON + SEMI, 1 );
                    } else {
                        // mceObj.insertText( ta, COLON + SEMI, 1 );
                        mceObj.insertText2( ta, COLON + SEMI, -1 );
                    }
                } else {
                    return true;
                }
                break;
            case SEMI:
                if ( val.charAt( selStart ) === SEMI ) {
                    if ( FIREFOX ) {
                        // mceObj.insertText( ta, '', 1 );
                        mceObj.moveCursor( ta, 1 );
                    } else {
                        // mceObj.insertText2( ta, '', 1 );
                        document.execCommand( 'forwardDelete', false );
                        document.execCommand( 'insertText', false, SEMI );
                    }
                } else {
                    return true;
                }
                break;    
            case BACKSPACE:
                return true;
                // break;    
            case QUOTE:
                if ( FIREFOX ) {
                    mceObj.insertText( ta, QUOTE + QUOTE, 1 );
                } else {
                    mceObj.insertText2( ta, QUOTE + QUOTE, -1 );
                }
                break;
            case APOSTROPHE:
                if ( FIREFOX ) {
                    mceObj.insertText( ta, APOSTROPHE + APOSTROPHE, 1 );
                } else {
                    mceObj.insertText2( ta, APOSTROPHE + APOSTROPHE, -1 );
                }
                break;
            case LEFT_PAREN:
                if ( FIREFOX ) {
                    mceObj.insertText( ta, LEFT_PAREN + RIGHT_PAREN, 1 );
                } else {
                    mceObj.insertText2( ta, LEFT_PAREN + RIGHT_PAREN, -1 );
                }    
                break;
            case LEFT_BRACKET:
                if ( FIREFOX ) {
                    mceObj.insertText( ta, LEFT_BRACKET + RIGHT_BRACKET, 1 );
                } else {
                    mceObj.insertText2( ta, LEFT_BRACKET + RIGHT_BRACKET, -1 );
                }    
                break;
            case LEFT_CURLY_BRACE:
                if ( val.lastIndexOf( '{', selStart ) === -1 || ( val.lastIndexOf( '}', selStart ) > val.lastIndexOf( '{', selStart ) ) ) {
                    if ( FIREFOX ) {
                        mceObj.insertText( ta, LEFT_CURLY_BRACE + charNewLine + charTab + charNewLine + RIGHT_CURLY_BRACE, 3 );
                    } else {
                        mceObj.insertText2( ta, LEFT_CURLY_BRACE + charNewLine + charTab + charNewLine + RIGHT_CURLY_BRACE, -2 );
                    }    
                } else {
                    return true;
                }
                break;    
            default:
                return true;
        }
        mceObj.triggerInputEvent();
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
        var result = document.execCommand( 'insertText', false, text );
        console.log( 'insertText result:', result );
        el.selectionStart = el.selectionEnd =  el.selectionStart + m;
    },
    moveCursor: function( el, m ) {
        el.selectionStart = el.selectionEnd = el.selectionStart + m;
    },
    highlightSyntax: function( css ) {
        var formatted = css;
        
        formatted = formatted.replace( this.rxSelectors, '<span class="mce-selector">$&</span>' );
        formatted = formatted.replace( this.rxHtmlElements, function(m, group1) {
            if (group1 !== undefined) {
                return '<span class="mce-element">' + group1 + '</span>';
            }
            return m;
        } );
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
        
        this.divCodeDisplay.innerHTML = formatted;
    },
    applyStyle: function( selector, declarations ) {
        if ( selector ) {
            // var elArr = document.getElementById('sandbox').querySelectorAll( selector );
            var el = document.getElementById( 'sandbox' );
            var elArr = el.querySelectorAll( selector );
            // elArr.forEach( el => {
            elArr.forEach( function(el) {
                el.style = declarations;
            } );      
        }
    },
    clearStyle: function() {
        if ( this.browser.ie ) {
            NodeList.prototype.forEach = Array.prototype.forEach;
        }
        var elArr = document.getElementById('sandbox').querySelectorAll( '*' );
        // elArr.forEach( el => {
        elArr.forEach( function(el) {
            el.removeAttribute( 'style' );
        } );
    },
    processRules: function( evt ) {
        var mceObj = this;
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
        // rulesArr.forEach( rule => {
        rulesArr.forEach( function( rule ) {
            if ( rule[ 0 ].startsWith( '/*' ) === false ) {
                mceObj.applyStyle( rule[ 0 ], rule[ 1 ] );
            }
        } );
    },
    showAnswer: function() {
        document.querySelector( '.answer' ).classList.add( 'show' );
        document.querySelector( '.answer-btn' ).classList.add( 'disabled' );
        return false;
    },
    toggleCode: function() {
        var mceObj = this,
            ta = this.taCodeEditor,
            val = ta.value,
            selStart = ta.selectionStart,
            selEnd = ta.selectionEnd,
            doComment = false,
            startPartial = '', endPartial = '',
            startCount = 0, endCount = 0;
        
        ta.selectionStart = 0;
        ta.selectionEnd = ta.value.length;
        mceObj.commentSelection(ta);
        
        if ( document.querySelector( '.toggle-code-btn' ).classList.contains( 'show' ) ) {
            document.querySelector( '.toggle-code-btn' ).classList.remove( 'show' );
            doComment = true;
        } else {
            document.querySelector( '.toggle-code-btn' ).classList.add( 'show' );
            doComment = false;
        }
        mceObj.triggerInputEvent();

        if ( doComment ) {
            startPartial = ta.value.slice( 0, selStart );
            endPartial = ta.value.slice( 0, selEnd );
        } else {
            startPartial = val.slice( 0, selStart );
            endPartial = val.slice( 0, selEnd );
        }
        
        startCount = ( startPartial.match( /\/\*|\*\//g ) || []).length;
        endCount = ( endPartial.match( /\/\*|\*\//g ) || []).length;

        ta.focus();
        if ( doComment ) {
            ta.selectionStart = selStart + (startCount * 2);
            ta.selectionEnd = selEnd + (endCount * 2);
        } else {
            ta.selectionStart = selStart - (startCount * 2);
            ta.selectionEnd = selEnd - (endCount * 2);
        }
        
        return false;
    }
};
