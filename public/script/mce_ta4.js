var myTACodeEditor = {
    gridContainer: document.querySelector( '.grid-container' ),
    taCodeEditor: document.querySelector( '.ta-code-editor' ),
    divCodeEditor: document.querySelector( '.div-code-editor' ),

    rxSelectors: /[\S]+(?=\s*{)/gm,
    // rxConstants: new RegExp('.*:\\s*|.*:|.*?{|\\w+\\(.*\\)|(\\b(' + getConstants() + ')(?![\\w-\\()]))', 'gm'),
    rxConstants: new RegExp('^[\\s\\w-]+|.*?{|\\w+\\(.*\\)|(\\b(' + getConstants() + ')(?![\\w-\\()]))', 'gm'),
    // rxKeywords: new RegExp('^[\\s\\w-]+:|([\\d\.]+)(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax|fr)(?=\\W)', 'gm'),
    rxKeywords: new RegExp('^[\\s\\w-]+:|([\\d.]+)(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax|fr)(?=\\W)', 'gm'),
    // rxNumbers: /^[\s\w-]+:|.*?{|[a-z]\d+|([^\(\"\' /_-]\d*\.?\d+|#[0-9A-Fa-f]{3,6})/gm,
    rxNumbers: /^[\s\w-]+:|.*?{|[a-z]\d+|([^:>("' /_-]\d*\.?\d+|#[0-9A-Fa-f]{3,6})/gm,
    rxProperties: /^[ \w-]+(?=:)/gm,
    rxFunctions: new RegExp( '\\w+\\(\\)|((' + getFunctions() + ')\\([\\w"' + String.fromCharCode(39) + ':\\/\\._\\-]+\\))', 'gm' ),
    rxQuotes: /"[\w\s-]*"(?!>)|'[\w\s-]*'(?!>)/gm,
    init: function(preFill, curPos) {
        var mceObj = this;
        mceObj.taCodeEditor.defaultValue = preFill;
        mceObj.taCodeEditor.selectionStart = mceObj.taCodeEditor.selectionEnd = curPos;
        
        mceObj.taCodeEditor.onkeydown = function( evt ) {
            console.log( 'keydown' );
            console.log( evt );
        };
        
        mceObj.taCodeEditor.onkeypress = function( evt ) {
            console.log( 'keypress' );
            var ce = mceObj.taCodeEditor;
            switch (evt.key) {
                case 'Enter':
                    var openBracketPos = ce.value.lastIndexOf( '{', ce.selectionStart ),
                        closeBracketPos = ce.value.lastIndexOf( '}', ce.selectionStart ),
                        newLine = '\u000A', indent = '\u0020\u0020';
                    if ( ( openBracketPos - ce.selectionStart ) > ( closeBracketPos - ce.selectionStart ) ) {
                        mceObj.insertText( this, newLine + indent, 3 );
                    } else {
                        mceObj.insertText( this, newLine, 1 );
                    }
                    break;
                case String.fromCharCode( 58 ):
                    var pos = ce.selectionStart,
                        lineStartPos = ce.value.lastIndexOf( '\n', pos ),
                        lineEndPos = ce.value.indexOf( '\n', pos );
                    if (lineStartPos === lineEndPos){
                        var colon = String.fromCharCode( 58 ), semi = String.fromCharCode( 59 );
                        mceObj.insertText( this, colon + semi, 1 );
                    } else {
                        return true;
                    }
                    break;
                case String.fromCharCode( 34 ):
                    var quote = String.fromCharCode( 34 );
                    mceObj.insertText( this, quote + quote, 1 );
                    break;
                case String.fromCharCode( 39 ):
                    var apostrophe = String.fromCharCode( 39 );
                    mceObj.insertText( this, apostrophe + apostrophe, 1 );
                    break;
                case String.fromCharCode( 123 ):
                    var leftBracket = String.fromCharCode( 123 ), rightBracket = String.fromCharCode( 125 );
                    mceObj.insertText( this, leftBracket + '\u000A\u0020\u0020\u000A' + rightBracket, 4 );
                    break;    
                default:
                    return true;
            }
            mceObj.taCodeEditor.dispatchEvent( new Event( 'input' ) );
            return false;
        };
        
        mceObj.taCodeEditor.oninput = function( evt ) {
            console.log( 'input' );
            
            if ( evt.inputType === 'deleteContentBackward' ) {
                console.log( 'delete' );
                var pos = evt.target.selectionStart;
                var lineStartPos = evt.target.value.lastIndexOf( '\n', pos );
                var lineEndPost = evt.target.value.indexOf( '\n', pos );
                console.log( lineStartPos, pos, lineEndPost );
            }
            mceObj.updateDivMce( mceObj.taCodeEditor.value );
            mceObj.applyStyle( evt );
        };

        mceObj.taCodeEditor.onkeyup = function( evt ) {
            console.log( 'keyup' );
        };

        mceObj.taCodeEditor.dispatchEvent( new Event( 'input' ) );
    },
    updateDivMce: function( css ) {
        var formatted = css;

        var selector = '<span class="mce-selector">$&</span>';
        formatted = formatted.replace( this.rxSelectors, selector );

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
        
        selector = '<span class="mce-property">$&</span>';
        formatted = formatted.replace( this.rxProperties, selector );

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

        selector = '<span class="mce-quotes">$&</span>';
        formatted = formatted.replace( this.rxQuotes, selector );

        this.divCodeEditor.innerHTML = formatted;
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
