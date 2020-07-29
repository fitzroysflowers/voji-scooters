(function($) {
  'use strict';

  function emailValid( email ) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  var lambdaEmail = {
    init: function( config ) {
      this.config = config;
      this.emailForm = this.config.emailForm;
      this.submitBtn = this.emailForm.find(':submit');
      console.log( this.submitBtn );
      this.bind();
    },

    error: function() {
      alert('There is a problem with your form. Please review and submit again');
     },

    sendData: function( data ) {
      var self = lambdaEmail
        , form = this.emailForm;

      var xhr = new XMLHttpRequest();
      xhr.open( 'POST', 'https://3ghtzhhdkc.execute-api.eu-west-1.amazonaws.com/prod', true );
      xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      xhr.send( JSON.stringify( data ) );
      xhr.onreadystatechange = function() {
        if( xhr.readyState === 4 ) {
          if( xhr.status === 200 ) {
            window.location.href='/success.html'
            //return alert( 'Thank you. We will be in-touch shortly' );
          } else {
            window.location.href='/failure.html'
            //return alert( 'Ooops there was a problem' );
          }
        }
      };
    },
    
    processData: function( data ) {
      var obj={}
        , form = this.emailForm
        , submit = this.emailForm.find('input[submit]');
      form.addClass('sending-data');
      this.emailForm.find('input[type=submit]').val('sending request');
      for( var i=0;i<data.length;i++ ) {
        obj[data[i].name] = data[i].value;
      }
      ( emailValid( obj.email ) ) ? this.sendData(obj) : this.error();
      //( emailValid( obj.email ) ) ? this.sendData(JSON.stringify(obj)) : this.error();
    },

    getData: function(e) {
      e.preventDefault();
      var self = lambdaEmail
        , data = $(this).serializeArray();
      self.processData(data);
      self.submitBtn.prop('disabled', true)
    },

    bind: function() {
      this.emailForm.on( 'submit', this.getData ); 
    },
  };

  lambdaEmail.init({
    emailForm: $("#notify"),
  });
})(jQuery)
