var myGrid = {
    init: function() {
        var myGrid = this;
        // document.querySelector( '#css-code' ).addEventListener( 'keypress', function( evt ) {
        //     myGrid.captureKey( evt );
        // });
        document.querySelector( '#css-code' ).onkeypress = function( evt ) {
            if ( evt.keyCode === 13 || evt.which === 13 ) {
                myGrid.indentEnterKey();
                return false;
            }
        };
    },
    indentEnterKey: function() {
        console.log( 'indented' );
    },
    captureKey: function( evt ) {
        // console.log( 'args', evt );
        var myGrid = document.querySelector( '.grid-container' );
        var css = document.querySelector( '#css-code' ).value;
        // console.log( evt );
        this.filterKey( evt );
        // return false;
        
        var pattern = /([\w-]+:\s*[\w-#\s]+;?$)/gm;
        var cssStatements = '';
        if ( cssStatements = css.match( pattern ) ) {
            console.log( 'match', cssStatements );
            myGrid.setAttribute( 'style', cssStatements.join( ' ' ) );
        }
    },
    filterKey: function( evt ) {
        if ( evt.keyCode === 13 || evt.which === 13 ) {
            console.log( "Enter" );
            return false;
        }
    }
};

window.onload = myGrid.init();