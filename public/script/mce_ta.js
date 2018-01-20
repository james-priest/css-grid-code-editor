'use strict';
// Version #1 - Creates an object literal assigned to a global var. Not great cause it pollutes the global namespace
// Use: cssPropVals.functions
// var cssPropVals = {
//     functions: '',
//     htmlElements: '',
//     constants: '',
//     colors: '',
// };

// Version #2 - Create a constructor function for a CssPropertyValues object, initialize a new instance of it & reference is done through newly created variable instance.
// Use: var css1 = new CssPropertyValues();
//      css1.getFunctions();
// function CssPropertyValues() {
//     var cssFunctions = '';
//     var cssHtmlElements = '';
//     var cssConstants = '';
//     var cssColors = '';
//     this.getFunctions = function() {
//         return cssFunctions;
//     };
//     this.getHtmlElements = function() {
//         return cssHtmlElements;
//     };
//     this.getConstants = function() {
//         return cssConstants;
//     };
//     this.getColors = function() {
//         return cssColors;
//     };
// }

// Version #3 - Create a CSSVALUES module namespace that returns an object containing all public methods
//  This uses a closure to encapsulate all private data
//  By wrapping the anonymous function in an IIFE we immediately initialize CSSVALUES to the result of our closure

// What enables the CSSVALUES variable to immediately contain the object
//  that serves as our module rather than a function is:
//  The parentheses that immediately invoke the function!

//  This is an example of the module pattern.
var CSSVALUES = (function() {
    var cssFunctions = 'url|translateZ|translateY|translateX|translate3d|translate|steps|skewY|skewX|skew|sepia|scaleZ|scaleY|scaleX|scale3d|scale|saturate|rotateZ|rotateY|rotateX|rotate3d|rotate|repeating-radial-gradient|repeating-linear-gradient|repeat|radial-gradient|perspective|opacity|matrix3d|matrix|linear-gradient|invert|hue-rotate|grayscale|drop-shadow|cubic-bezier|contrast|calc|brightness|blur|attr';
    var cssHtmlElements = 'a|abbr|address|area|article|aside|audio|b|base|bdi|bdo|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|datalist|dd|del|details|dfn|dialog|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|head|header|hr|html|i|iframe|img|input|ins|kbd|label|legend|li|link|main|map|mark|menu|menuitem|meta|meter|nav|noscript|object|ol|optgroup|option|output|p|param|picture|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|source|span|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|u|ul|var|video|wbr';
    var cssConstants = 'absolute|alias|all|all-scroll|allow-end|alternate|alternate-reverse|always|armenian|auto|avoid|backwards|balance|baseline|bidi-override|block|border-box|both|bottom|break-all|break-word|capitalize|caption|cell|center|circle|cjk-ideographic|clip|clone|close-quote|col-resize|collapse|color-dodge|column|column-reverse|condensed|contain|content-box|context-menu|copy|counter|cover|crosshair|cursive|darken|dashed|decimal|decimal-leading-zero|default|disc|distribute|dotted|double|e-resize|ease|ease-in|ease-in-out|ease-out|ellipsis|embed|end|ew-resize|expanded|extra-condensed|extra-expanded|fantasy|fill|first|fixed|flat|flex|flex-end|flex-start|force-end|forwards|georgian|grab|grabbing|grid|groove|hebrew|help|hidden|hide|hiragana|hiragana-iroha|horizontal|icon|infinite|inherit|initial|inline|inline-block|inline-flex|inline-table|inset|inside|inter-cluster|inter-ideograph|inter-word|invert|italic|justify|kashida|katakana|katakana-iroha|keep-all|large|larger|last|left|lighten|line-through|linear|list-item|local|lower-alpha|lower-greek|lower-latin|lower-roman|lowercase|ltr|luminosity|max-content|medium|menu|message-box|middle|min-content|monospace|move|multiply|n-resize|ne-resize|nesw-resize|no-close-quote|no-drop|no-open-quote|no-repeat|none|normal|not-allowed|nowrap|ns-resize|nw-resize|nwse-resize|oblique|open-quote|outset|outside|overlay|overline|padding-box|paused|pointer|pre|pre-line|pre-wrap|preserve-3d|progress|relative|repeat|repeat-x|repeat-y|reverse|ridge|right|round|row|row dense|row-line|row-resize|row-reverse|rtl|run-in|running|s-resize|sans-serif|saturation|scale-down|screen|scroll|se-resize|semi-condensed|semi-expanded|separate|serif|show|slice|small|small-caps|small-caption|smaller|solid|space|space-around|space-between|span|square|start|static|status-bar|step-end|step-start|sticky|stretch|sub|super|sw-resize|system-ui|table|table-caption|table-cell|table-column|table-column-group|table-footer-group|table-header-group|table-row|table-row-group|text|text-bottom|text-top|thick|thin|top|transparent|trim|ultra-condensed|ultra-expanded|underline|unset|upper-alpha|upper-greek|upper-latin|upper-roman|uppercase|vertical|vertical-text|visible|w-resize|wait|wavy|wrap|wrap-reverse|x-large|x-small|xx-large|xx-small|zoom-in|zoom-out';
    var cssColors = 'aliceblue|antiquewhite|aqua|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen';
    return {
        getFunctions: function() { return cssFunctions; },
        getHtmlElements: function() { return cssHtmlElements; },
        getConstants: function() { return cssConstants; },
        getColors: function() { return cssColors; }
    };
} )();
// Private properties are created in the local scope of the function expression.
// Public properties are built within the object which is then returned to become the namespace.
// Access to private data is thus possible only because of closure within the larger module.

var myTACodeEditor = {
    gridContainer: document.querySelector( '.grid-container' ),
    divFollow: document.querySelector( '.follow code'),
    divSolution: document.querySelector( '.answer code' ),
    taCodeEditor: document.querySelector( '.ta-code-editor' ),
    divCodeDisplay: document.querySelector( '.div-code-display' ),
    backBtn: document.querySelector( '.back-btn '),
    nextBtn: document.querySelector( '.next-btn' ),
    
    rxSelectors: /^[\w .\-#[\]'"=:()>^~*+,|$]+(?={)/gm,
    rxHtmlElements: new RegExp( '\\/\\*.*|<.*?>|\\b(' + CSSVALUES.getHtmlElements() + ')\\b(?=.*{)', 'gm' ),
    rxConstants: new RegExp('^[\\s\\w-]+|.*?{|\\w+\\(.*\\)|\\/\\*.*|<.*>|(\\b(' + CSSVALUES.getConstants() + '|' + CSSVALUES.getColors() + ')(?![\\w-\\()]))', 'gm'),
    rxKeywords: new RegExp('^[\\s\\w-]+:|\\/\\*.*|\\(.*\\)|([\\d.]+)(ch|cm|deg|em|ex|fr|gd|grad|Hz|in|kHz|mm|ms|pc|pt|px|rad|rem|s|turn|vh|vm|vmin|vmax|vw|%)(?=\\W)', 'gm'),
    rxNumbers: /^[\s\w-]+:|.*?{|[a-z]\d+|\/\*.*|\(.*\)|([^:>("'/_-]\d*\.?\d+|#[0-9A-Fa-f]{3,6})/gm,
    rxProperties: /^[^{][ \t\w-]+(?=:)/gm,
    rxFunctions: new RegExp( '\\/\\*.*|((' + CSSVALUES.getFunctions() + ')\\([\\w\\d `~!@#$%^&*()\\-_=+[\\]{}\\\\|:;' + String.fromCharCode(39) + '",.\\/?]*\\))', 'gm' ),
    rxQuotes: /^[/*].*\*\/|("[\w\s-]*"(?!>)|'[\w\s-]*'(?!>))/gm,
    rxRules: /(.+)\s*(?={)|^[\t\s]*(.+;)/gm,
    rxTextToWrap: /[\w\d\-[\] {}.:;#,>+'"=()/~^$*]+$/gm,
    rxBlockToWrap: /[\w\d\-[\] {}.:;#,>+'"=()/~^$*%\t]+$/gm,
    rxFindComment: /\/\*|\*\//,
    rxReplaceComment: /\/\*|\*\//gm,
    rxComments: /\/\*.*\*\//gm,

    preFill: '',
    curPos: 0,
    answerCode: '',
    styleRuleIdx: 0,
    browser: { chrome: 0, ie: 0, firefox: 0, safari: 0, opera: 0, edge: 0 },
    init: function() {
        var mceObj = this;

        mceObj.sniffBrowser();

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

        mceObj.backBtn.onclick = function( evt ) {
            return mceObj.clickBack( evt );
        };

        mceObj.nextBtn.onclick = function( evt ) {
            return mceObj.clickNext( evt );
        };

        mceObj.loadPage( 0 );
    },
    loadPage: function( idx ) {
        var mceObj = this;
        var pages = getPages();
        var num = pages[ idx ].num,
            title = pages[ idx ].title,
            subtitle = pages[ idx ].subtitle,
            part1 = pages[ idx ].instructions.part1,
            part2 = pages[ idx ].instructions.part2,
            preFill = pages[ idx ].code.preFill,
            follow = pages[ idx ].code.follow,
            solution = pages[ idx ].code.solution,
            guide = pages[ idx ].gridContainer.guide,
            guidelines = pages[ idx ].gridContainer.guidelines,
            grid = pages[ idx ].gridContainer.grid,
            style = pages[ idx ].style;

        mceObj.resetDefaults();
        document.title = num + '-' + title + ': ' + subtitle;
        document.querySelector( '.title' ).innerText = title;
        document.querySelector( '.subtitle' ).innerText = num + '. ' + subtitle;
        document.querySelector( '.part1' ).innerHTML = part1;
        document.querySelector( '.part2' ).innerHTML = part2;
        mceObj.setTaVal( preFill );
        mceObj.formatFollowCode( follow );
        mceObj.formatSolution( solution );
        mceObj.doNavButtons( idx, pages );
        document.querySelector( '.guide' ).innerHTML = guide;
        document.querySelector( '.guidelines' ).innerHTML = guidelines;
        document.querySelector( '.grid' ).innerHTML = grid;
 
        mceObj.doStyle( style );
        
        if ( preFill.length <=0 && follow.length <= 0 && solution.length <= 0 ) {
            mceObj.hideEditors();
        }
    },
    doStyle: function( style ) {
        var styleSheet = document.styleSheets.guideStyle;
        for ( var i = styleSheet.rules.length -1; i >= 0; i-- ) {
            styleSheet.deleteRule( i );
        }
        if ( style.length > 0 ) {
            style.forEach( function( rule ) {
                styleSheet.insertRule( rule );
            } );
        }
    },
    resetDefaults: function() {
        var mceObj = this;
        mceObj.hideAnswer();
        document.querySelector( '.paste-btn' ).innerText = 'Paste';
        document.querySelector( '.solution' ).classList.remove( 'hide' );
        mceObj.divCodeDisplay.classList.remove( 'hide' );
        mceObj.taCodeEditor.classList.remove( 'hide' );
        document.querySelector( '.toggle-code-btn' ).classList.remove( 'hide' );
        document.querySelector( '.toggle-code-btn' ).classList.add( 'show' );
        document.querySelector( '.comment' ).classList.remove( 'hide' );
        
    },
    hideEditors: function() {
        this.divCodeDisplay.classList.add( 'hide' );
        this.taCodeEditor.classList.add( 'hide' );
        document.querySelector( '.toggle-code-btn' ).classList.add( 'hide' );
        document.querySelector( '.comment' ).classList.add( 'hide' );
    },
    doNavButtons( idx, pages ) {
        var mceObj = this;
        // console.log( pages.length );
        if ( idx > 0 ) {
            mceObj.backBtn.classList.remove( 'disabled' );
            mceObj.backBtn.dataset.prev = +idx - 1;
        } else {
            mceObj.backBtn.classList.add( 'disabled' );
        }
        if ( idx < pages.length - 1) {
            mceObj.nextBtn.classList.remove( 'disabled' );
            mceObj.nextBtn.dataset.next = +idx + 1;
        } else {
            mceObj.nextBtn.classList.add( 'disabled' );
        }
    },
    formatFollowCode: function( follow ) {
        if ( follow.length > 0 ) {
            this.divFollow.innerText = follow;
            document.querySelector( '.follow' ).classList.remove( 'hide' );
        } else {
            document.querySelector( '.follow' ).classList.add( 'hide' );
        }
    },
    formatSolution: function(solution) {
        if ( solution.length > 0 ) {
            this.divSolution.innerText = solution;
            this.answerCode = solution;
        } else {
            document.querySelector( '.solution' ).classList.add( 'hide' );
        }
    },
    setTaVal: function( preFill ) {
        var mceObj = this,
            curPos = 0;    
        if ( preFill.length > 0 ) {
            mceObj.preFill = preFill;
            curPos = preFill.indexOf( '@' );
            mceObj.curPos = curPos;
            mceObj.taCodeEditor.value = preFill.replace( /@/, '' );
            mceObj.taCodeEditor.selectionStart = mceObj.taCodeEditor.selectionEnd = curPos;
            mceObj.taCodeEditor.focus();
            mceObj.triggerInputEvent();
        }
        
    },
    clickBack: function( evt ) {
        var mceObj = this;
        if ( mceObj.backBtn.classList.contains( 'disabled' ) === false ) {
            document.body.style.opacity = 0;
            
            window.setTimeout( function() {
                document.body.style.opacity = 1;
                mceObj.loadPage( evt.target.dataset.prev );
            }, 300 );
        }
        return false;
    },
    clickNext: function( evt ) {
        var mceObj = this;
        if ( mceObj.nextBtn.classList.contains( 'disabled' ) === false ) {
            // transition
            document.body.style.opacity = 0;
            
            window.setTimeout( function() {
                document.body.style.opacity = 1;
                mceObj.loadPage( evt.target.dataset.next );
            }, 300 );
        }
        return false;
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
        this.displaySolved();
    },
    displaySolved: function() {
        var ta = this.taCodeEditor,
            answer = this.preFill.replace( /\t@/, this.answerCode.replace( /^[\xA0 ]+/gm, '\t' ) ),
            gridContainer = document.querySelector('.grid-container');

        if ( ta.value === answer ) {
            gridContainer.classList.add( 'solved' );
        } else {
            gridContainer.classList.remove( 'solved' );
        }
    },
    showAnswer: function() {
        document.querySelector( '.answer' ).classList.add( 'show' );
        document.querySelector( '.answer-btn' ).classList.add( 'disabled' );
        return false;
    },
    hideAnswer: function() {
        document.querySelector( '.answer' ).classList.remove( 'show' );
        document.querySelector( '.answer-btn' ).classList.remove( 'disabled' );
        return false;
    },
    pasteAnswer: function() {
        var mceObj = this,
            ta = this.taCodeEditor,
            code = document.querySelector( '.answer code' ).innerText,
            pasteBtn = document.querySelector( '.paste-btn' );
            
        if ( pasteBtn.innerText === 'Paste' && code.trim().length > 0) {
            console.log( code.trim().length );
            pasteBtn.innerText = 'Clear';
            // replace non-breaking space (char code 160) with tab
            ta.value = mceObj.preFill.replace( /\t@/, code.replace( /^[\xA0 ]+/gm, '\t' ) );
            mceObj.taCodeEditor.selectionStart = mceObj.taCodeEditor.selectionEnd = mceObj.curPos;
            mceObj.taCodeEditor.focus();
            mceObj.triggerInputEvent();
        } else if(pasteBtn.innerText === 'Clear') {
            pasteBtn.innerText = 'Paste';
            this.setTaVal( mceObj.preFill );
        }
    },
    toggleCode: function() {
        var mceObj = this,
            ta = this.taCodeEditor,
            val = ta.value,
            selStart = ta.selectionStart,
            selEnd = ta.selectionEnd,
            lineStartPos = val.lastIndexOf( '\n', selStart - 1 ) > -1 ? val.lastIndexOf( '\n', selStart - 1 ) + 1 : 0,
            lineEndPos = val.indexOf( '\n', selEnd ) > -1 ? val.indexOf( '\n', selEnd ) : val.length,
            doComment = false,
            posModifier = 0;
        
        var startPart = val.slice( 0, selStart ),
            startPrevLines = ( startPart.match( /\n/gm ) || [] ).length;
        var endPart = val.slice( 0, selEnd ),
            endPrevLines = ( endPart.match( /\n/gm ) || [] ).length;
        
        // select all to comment all lines
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

        // pos on the current line
        if ( doComment ) {
            if ( selStart === lineStartPos ) {
                posModifier = 0;
            } else if ( selStart === lineEndPos ) {
                posModifier = +4;
            } else {
                posModifier = +2;
            }
            ta.selectionStart = selStart + posModifier + ( startPrevLines * 4 );
            ta.selectionEnd = selEnd + posModifier + ( endPrevLines * 4 );
        } else {
            if ( selStart === lineStartPos ) {
                posModifier = 0;
            } else if ( selStart === lineEndPos ) {
                posModifier = -4;
            } else {
                posModifier = -2;
            }
            ta.selectionStart = selStart + posModifier - ( startPrevLines * 4 );
            ta.selectionEnd = selEnd + posModifier - ( endPrevLines * 4 );
        }
        ta.focus();
        return false;
    }
};

window.onload = myTACodeEditor.init();