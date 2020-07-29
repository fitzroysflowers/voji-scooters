( function() {
  var slide = {
    init: function( config ) {
      this.config = config;
      this.slides = this.config.slides;
      this.build();
    },

    action: function( slide, i ) {
      var numChildren = slide.ChildElementCount
        , classes = slide.className.split(' ')
        , slideElms = slide.getElementsByTagName('li')
        , elmsArray = Array.from( slideElms )
        , n = i; 
      
      i < this.numChildren
        ? n++
        : n = 0 ;

      window.setTimeout( this.control( slide, n ), 30000 );
    },

    control: function( slide, i, action ) {
      console.log( 'slide', slide )
      console.log( 'i', i )
      this.action( slide, i )
    },

    build: function() {
      for( var i=0; i<this.slides.length; i++ ) {
        var slide = this.slides[i]
          , slideElms = slide.getElementsByTagName('li')
          , controls = document.createElement('li');

        controls.classList.add('controls');

        for( var b=0;b<slideElms.length;b++ ) {
          var slideElm = slideElms[b]
            , pip = document.createElement('div')
            , background = slideElm.getAttribute('data-background')
            , colour = slideElm.getAttribute('data-pipcolour') || 'red'; 

          slideElm.setAttribute('style', 'background-image:url(' + background + ')');
          pip.setAttribute( 'style', 'background-color:' + colour );
          pip.classList.add('pip');
          controls.appendChild(pip);
        }
        slide.appendChild( controls );
        this.control(slide, 0);
      }
    }
  }

  slide.init( {
    slides: document.getElementsByClassName('slide')
  } )
} )()
