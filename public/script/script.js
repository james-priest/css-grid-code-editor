var myGrid = {
    init: function() {
        document.querySelector( '#css-code' ).addEventListener( 'keypress', function( e ) {
            console.log( 'e', e );
            // console.log( 'a', a );
            // e( arguments );
        });
    },
    captureKey: function( evt ) {
        console.log('args', evt)
        var myGrid = document.querySelector( '.grid-container' );
        var css = document.querySelector( '#css-code' ).value;
        console.log( evt );
        // myGrid.captureKey( evt );
        var pattern = /([\w-]+:\s*[\w-#\s]+;?$)/gm;
        var cssStatements = '';
        if ( cssStatements = css.match( pattern ) ) {
            console.log( 'match', cssStatements );
            myGrid.setAttribute( 'style', cssStatements.join( ' ' ) );
        }
    },
    filterEnter: function( evt ) {
        if ( evt.keyCode === 13 || evt.which === 13 ) {
            return false;
        } else {
            return true;
        }
    }
};

window.onload = myGrid.init();