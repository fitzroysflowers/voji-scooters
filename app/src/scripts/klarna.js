( function( Klarna ) {

  var klarna = {
    init: function( config ) {
      this.config = config;
      this.widgetContainer = this.config.widgetContainer;
      this.orderForm = this.config.orderForm;
      this.applyBtn = this.config.applyBtn;
      this.paymentOptionsWrapper = this.config.paymentOptionsWrapper
      this.klarnaOption = this.config.klarnaOption
      this.stripeOption = this.config.stripeOption
      this.cardRadio = this.config.cardRadio
      this.origin = window.location.origin;
      this.klarnaPath = 'https://c4syibmg0i.execute-api.eu-west-2.amazonaws.com';
      this.payCategory = 'pay_later';
      this.selectedPaymentMethod = ''
      this.sessionResponse = {}
      this.callSession();
      this.applyBtn.removeAttribute('disabled');
      this.bind();
    },

    serialize: function(form) {
      var field, s = [], o={};
      if (typeof form == 'object' && form.nodeName == "FORM") {
        var len = form.elements.length;
        for (i=0; i<len; i++) {
          field = form.elements[i];
          if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
            if (field.type == 'select-multiple') {
              for (j=form.elements[i].options.length-1; j>=0; j--) {
                if(field.options[j].selected)
                  s[s.length] = field.name + "=" + field.options[j].value;
              }
            } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
              s[s.length] = field.name + "=" + field.value;
            }
          }
        }
      }
      s.forEach( function( item ) {
        var itemArray = item.split('=')
          , fieldName = itemArray[0]
          , fieldValue = itemArray[1];
        o[fieldName] = fieldValue;
      } )
      return o
    },

    writeCookie: function( name, value, days ) {
      var date = new Date()
        , expires = '';

      if( days ) {
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires=" + date.toGMTString();
      } else {
        expires = "";
      }

      document.cookie = name + '=' + value + expires + "; path=/";
    },

    readCookie: function( name ) {
      var i, c, ca, nameEQ = name + "=";
      ca = document.cookie.split(';');
      for(i=0;i < ca.length;i++) {
          c = ca[i];
          while (c.charAt(0)==' ') {
              c = c.substring(1,c.length);
          }
          if (c.indexOf(nameEQ) == 0) {
              return c.substring(nameEQ.length,c.length);
          }
      }
      return '';
    },

    klarnaAsyncCallback: function() {
      var that = this
      Klarna.Payments.init( {
        "client_token": that.sessionResponse.client_token
      } )

      Klarna.Payments.load( {
        container: '#klarna-payments-container'
        , payment_method_category: that.selectedPaymentMethod
      }, function( res ) {
      } )

      if( this.sessionResponse.showForm ) this.widgetContainer.style.display = 'block';
      else this.widgetContainer.style.display = 'block';
    },

    hideKlarna: function(e) {
      this.klarnaOption.style.display = "none";
      this.stripeOption.style.display = 'block';
    },

    selectPaymentMethod: function(e) {
      var target = e.target
      this.selectedPaymentMethod = target.value
      this.stripeOption.style.display = 'none';
      this.klarnaOption.style.display = 'block'
      this.klarnaAsyncCallback()
    },

    displayPaymentMethods: function() {
      var that = this
        , methods = this.sessionResponse.payment_method_categories

      console.debug(this.sessionResponse)

      methods.forEach( function( method ) {
        var li = document.createElement('li')
          , radio = document.createElement('input')
          , label = document.createElement('label')
          , textLabel = document.createElement('label')

        li.classList.add('klarna')

        radio.setAttribute('type', 'radio')
        radio.setAttribute('name', 'payment_method')
        radio.setAttribute('id', method.identifier)
        radio.setAttribute('value', method.identifier)
        radio.classList.add('toggle')

        label.setAttribute('for', method.identifier)

        textLabel.setAttribute('for', method.identifier)
        textLabel.innerHTML = method.name

        li.appendChild( radio )
        li.appendChild( label )
        li.appendChild( textLabel )

        that.paymentOptionsWrapper.appendChild( li )
        
        radio.addEventListener('click', that.selectPaymentMethod.bind(that))

      } )
    },

    callSession: function() {
      var that = this
        , xhr = new XMLHttpRequest()
        , action = this.klarnaPath + '/session'
        , klarnaSession = this.readCookie( 'voji-klarna-session' )
        , data = {
          "purchase_country": "GB"
          , "purchase_currency": "GBP" 
          , "locale": "en-GB"
          , "order_amount": 692.50
          , "order_lines": [ {
            "type": "physical"
            , "reference": "scooter"
            , "name": "scooter-name"
            , "quantity": 1
            , "unit_price": 692.50
            , "tax_rate": 0
            , "total_amount": 692.50
            , "total_discount_amount": 0
            , "total_tax_amount": 0
          } ]
        }

      if( !klarnaSession ) {
        xhr.open( 'POST', action, true );
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.send( JSON.stringify( data ) );
        xhr.onreadystatechange = function() {
          if( xhr.readyState === 4 ) {
            if( xhr.status === 200 ) {
              that.sessionResponse = JSON.parse( xhr.response )
              that.writeCookie( 'voji-klarna-session', that.sessionResponse.session_id, 4 )
              that.displayPaymentMethods()
            } else {
              return alert( 'Ooops there was a problem' );
            }
          }
        };

      } else {
        xhr.open( 'GET', action + '/' + klarnaSession, true );
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.send()
        xhr.onreadystatechange = function() {
          if( xhr.readyState === 4 ) {
            if( xhr.status === 200 ) {
              that.sessionResponse = JSON.parse( xhr.response )
              that.displayPaymentMethods()
            } else {
              return alert( 'Ooops there was a problem' );
            }
          }
        };
      }
    },

    order: function( token, authorizeData ) {
      var that = this
        , xhr = new XMLHttpRequest()
        , action = this.klarnaPath + '/order/' + token;

      authorizeData['merchant_urls'] = {
        "confirmation": this.origin + "/success.html"
      }

      xhr.open( 'POST', action, true );
      xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      xhr.send( JSON.stringify( authorizeData ) );
      xhr.onreadystatechange = function() {
        if( xhr.readyState === 4 ) {
          if( xhr.status === 200 ) {
            var response = JSON.parse( xhr.response )
            window.location.href = response.redirect_url
          } else {
            return alert( 'Ooops there was a problem' );
          }
        }
      }
    },

    authorize: function( e ) {
      e.preventDefault();
      this.applyBtn.setAttribute('disabled', 'disabled')
      var that = this
        , formData = this.serialize( this.orderForm )
        , updateCategory = this.payCategory
        , formatedDob = new Date(formData['dob']).toISOString().slice(0,10)
        , orderLines = {
            "type": "physical"
            , "reference": "scooter"
            , "name": formData["scooter-colour"] + ' scooter'
            , "quantity": 1
            , "unit_price": 69500
            , "tax_rate": 0
            , "total_amount": 69500
            , "total_discount_amount": 0
            , "total_tax_amount": 0
          }
        , authorizeData = {
          purchase_country: "GB"
          , purchase_currency: "GBP"
          , locale: "en-GB"
          , billing_address: {
            given_name: formData['billing_fname']
            , family_name: formData['billing_lname'] 
            , email: formData['billing_email'] 
            , title: formData['billing_title'] 
            , street_address: formData['billing_address'] 
            , street_address2: "" 
            , postal_code: formData['billing_postcode'] 
            , city: formData['billing_city'] 
            , region: ""
            , phone: formData['billing_phone'] 
            , country: "GB"
          }
          , shipping_address: {
            given_name: formData['shipping_fname'] || formData['billing_fname']
            , family_name: formData['shipping_lname'] || formData['billing_lname']
            , email: formData['shipping_email'] || formData['billing_email']
            , title: formData['shipping_title'] || formData['billing_title']
            , street_address: formData['shipping_address'] || formData['billing_address']
            , street_address2: ""
            , postal_code: formData['shipping_postcode'] || formData['billing_postcode']
            , city: formData['shipping_city'] || formData['billing_city']
            , region: ""
            , phone: formData['shipping_phone'] || formData['billing_phone']
            , country: "GB"
          }
          , order_amount: 69500
          , order_tax_amount: 0
          , order_lines: [ orderLines ]
          , customer: {
            date_of_birth: formatedDob
          }
          };

      Klarna.Payments.authorize( {
        payment_method_category: this.payCategory
      }, authorizeData, function( res ) {
        if( !res.show_form ) { 
          widgetContainer.style.display = none;
        
        } else if( res.show_form && !res.approved ) {
          alert( 'Sorry but your application has not been approved. Please check your details and try again' )
        } else {
          that.order( res.authorization_token, authorizeData );
        }
      } )
    },

    bind: function() {
      this.applyBtn.addEventListener( 'click', this.authorize.bind(this) )
      this.cardRadio.addEventListener( 'click', this.hideKlarna.bind(this) )
    }
  }

  klarna.init({
    widgetContainer: document.getElementById('klarna-payments-container')
    , orderForm: document.getElementById('order-form')
    , applyBtn: document.getElementById('apply-btn')
    , paymentOptionsWrapper: document.getElementById('payment-options-wrapper')
    , cardRadio: document.getElementById('card-payment')
    , klarnaOption: document.getElementById('klarna-option')
    , stripeOption: document.getElementById('stripe-option')
  })

} )( window.Klarna )
