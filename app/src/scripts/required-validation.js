( function( $, reqValid ) {
  var that = reqValid;

  init = function( config ) {
    config.requiredFields.on( 'change', onChange );
  }

  path = function( target ) {
    if( target instanceof jQuery ) return target.find( '.wrapper' );
    else return $( target ).find( '.wrapper' );
  };

  matchVal = function( input ) {
    var $input = $( input )
      , value = $input.val()
      , type = $input.attr( 'type' )
      , state = true;

    switch( type ) {
      case 'email':
        if( !value.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i ) ) state = false;
      default:
        if( value === '' ) state = false;
    }
    return state;
  };

  onChange = function( e ) {
    var matched = matchVal( e.target );
    if( matched === true ) $( e.target ).addClass( 'valid' );
  };

  reqValid.pass = function() {
    var requiredInp = $( section ).find('input[required]')
    var valid = true
    for(var i=0;i<requiredInp.length;i++){
      valid = matchVal( requiredInp[i] );
    }
    return valid;
  };

  reqValid.addClass = function( target ) {
    path( target ).addClass( 'not-valid' );
  };

  reqValid.removeClass = function( target ) {
    path( target ).removeClass( 'not-valid' );
  };

  init( {
    requiredFields: $( 'input[required]' )
  } );

} )( jQuery, this.reqValid={} )
