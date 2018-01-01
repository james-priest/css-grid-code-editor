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
    init: function(preFill, curPos) {
        var mceObj = this;
        mceObj.taCodeEditor.defaultValue = preFill;
        mceObj.taCodeEditor.selectionStart = mceObj.taCodeEditor.selectionEnd = curPos;
        
        mceObj.taCodeEditor.onkeydown = function( evt ) {
            return mceObj.captureKey( evt );
        };

        mceObj.taCodeEditor.oninput = function( evt ) {
            mceObj.divCodeEditor.innerHTML = mceObj.highlightSyntax( mceObj.taCodeEditor.value );
            mceObj.applyStyle( evt );
        };

        mceObj.taCodeEditor.dispatchEvent( new Event( 'input' ) );
    },
    captureKey: function( evt ) {
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
            el = evt.target;
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
                var pos = ce.selectionStart,
                    lineStartPos = ce.value.lastIndexOf( '\n', pos ),
                    lineEndPos = ce.value.indexOf( '\n', pos );
                if (lineStartPos === lineEndPos){
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
    insertText: function( el, text, curPos ) {
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
        formatted = formatted.replace( this.rxQuotes, '<span class="mce-quotes">$&</span>' );

        // this.divCodeEditor.innerHTML = formatted;
        return formatted;
    },
    applyStyle: function( evt ) {
        var css = evt.target.value;
        var pattern = /([\w-]+:\s*[\w-#\s]+;?)/gm;
        var cssStatements = css.match( pattern );
        if ( cssStatements ) {
            // this.gridContainer.setAttribute( 'style', cssStatements.join( ' ' ) );
            this.gridContainer.style = cssStatements.join( ' ' );
        }
        // console.log( css );
    }
};
