( function($) {
  var order = {
    init: function( config ) {
      this.config = config;
      this.fields = this.config.fields;
      this.submit = this.config.submit;
      this.cardErrors = this.config.cardErrors;
      this.orderForm = this.config.orderForm;
      this.input = $( this.fields[5] );
      this.terms = this.config.terms;
      this.html = this.config.html;
      this.termsState = false;
      this.stripeKey = 'pk_live_ZmaIUxHu5NLIcFhA4FfJW4iO00nWOwpBBz';
      this.stripeToken = '';
      this.fontSize = this.input.css( 'font-size' );
      this.fontFamily = this.input.css( 'font-family' );
      this.style = {
        base: {
          fontSize: this.fontSize,
          fontFamily: this.fontFamily
        },
        invalid: {
          color: '#e5424d',
          ':focus': {
            color: 'grey'
          },
        },
      };
      this.stripe = Stripe( this.stripeKey );
      this.elements = this.stripe.elements();
      //this.card = this.elements.create( 'card', { style: this.style, hidePostalCode: false } );
      //this.card.mount( '#card-element' )
      this.cardNumber = this.elements.create( 'cardNumber', { style: this.style } );
      this.cardExp = this.elements.create( 'cardExpiry', { style: this.style } );
      this.cardCvc = this.elements.create( 'cardCvc', { style: this.style } );
      this.postalCode = this.elements.create( 'postalCode', { style: this.style } );
      this.cardNumber.mount( '#card-number');
      this.cardExp.mount( '#card-expiry' );
      this.cardCvc.mount( '#card-cvc' );
      this.postalCode.mount( '#postal-code' )
      this.bind();
    },

    submitForm: function() {
      var action = this.orderForm.attr('action')
        , method = this.orderForm.attr('method')
        , dataArray = this.orderForm.serializeArray()
        , data = {};

      $.each( dataArray, function( i, field ) {
        data[field.name] = field.value
      } );

      var xhr = new XMLHttpRequest();
      xhr.open( 'POST', action, true );
      xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      xhr.send( JSON.stringify( data ) );
      xhr.onreadystatechange = function() {
        if( xhr.readyState === 4 ) {
          if( xhr.status === 200 ) {
            return alert( 'Thank you. We will be in-touch shortly' );
          } else {
            return alert( 'Ooops there was a problem' );
          }
        }
      };
    },

    stripeTokenHandler: function( token ) {
      var hiddenInput = document.createElement( 'input' );
      hiddenInput.setAttribute( 'type', 'hidden' );
      hiddenInput.setAttribute( 'name', 'stripeToken' );
      hiddenInput.setAttribute( 'value', token.id );
      this.orderForm.append( hiddenInput );
      //submit
      this.submitForm();
    },

    getToken: function( e ) {
      if( e.error ) this.cardErrors.text( e.error.message );
      else this.cardErrors.text( "" );
    },

    checkToken: function( result ) {
      var msg = 'Please try again or call 0800 830 3689.'
        , level = 'info'
        , stringified = JSON.stringify( result );

      if( 'object' != typeof result && this.termsState ) {
        this.submit.removeAttr( 'disabled' );
        this.submit.val( 'Please try again' );
      } else {
        //add token to form and submit
        this.stripeTokenHandler( result );
      }
    },

    submitOrder: function( e ) {
      e.preventDefault();

      //make sure all fields are filled
      //disable submit and send nice message
      this.submit.attr('disabled', 'disabled');
      this.submit.val( 'Thank you. Please wait…' );

      //get token
      this.stripe.createToken( this.cardNumber )
      .then( function( result ) {
        if( result.error ) {
          //show error message
          this.cardErrors.text( result.error.message );
          this.submit.removeAttr( 'disabled' );
          this.submit.val( 'Please try again' );
        } else {
          //check that token is as expected
          this.checkToken( result.token ); 
        }
      }.bind( this ) );
    },

    termsAgreed: function( e ) {
      this.termsState = this.terms.checked
    },

    bind: function() {
      this.submit.on( 'click', this.submitOrder.bind( this ) );
      this.cardNumber.on( 'change', this.getToken.bind( this ) );
      this.terms.on( 'change', this.termsAgreed.bind( this ) );
    }
  };

  order.init({
    fields: $( 'input[type=text]')
    , submit: $( 'input[type="submit"]' )
    , cardErrors: $( '#card-errors' )
    , orderForm: $( '#order-form' )
    , html: $( 'html' )
    , terms: $( 'order-terms' )
  });

} )( jQuery)
