window.intro =  (function($) {
  var intro = {
    init: function(config){
      this.config = config;
      this.slide = this.config.slide;
      this.Slider = this.config.Slider;
      this.Modernizr = this.config.Modernizr;
      this.UA = navigator.userAgent;
      this.video = document.createElement('video');
      this.videoPath = 'https://s3-eu-west-1.amazonaws.com/headphoneking/larry-trimmed'
      switch(true) {
        case this.video.canPlayType('video/webm').length > 0: //Chrome
          this.videoType = '.webm#t=0.1';
          break;
        case this.video.canPlayType('video/ogg').length > 0: //Firefox
          this.videoType = '.ogv';
          break;
        default:
        this.videoType = '.mp4#t=0.1';
      }
      this.testBrowser();
    },

    desktopStrategy: function() {
      var screen = document.createElement('div')
        , text = document.createElement('div')
        , loadingDiv = document.createElement('div')
        , controls = document.createElement('div')
        , muteBtn = document.createElement('a')
        , duration
        , interval
        , loadingRotation
        , w = this.slide.width()
        , h = this.slide.height()
        , quotes = [
          ];

      this.video.src = this.videoPath + this.videoType;
      text.setAttribute( 'class', 'video-text' );
      loadingDiv.setAttribute( 'class', 'loading-quotes' );

      muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>'
      controls.appendChild(muteBtn);
      controls.setAttribute('class', 'video-controls');

      this.slide.prepend(screen);
      this.slide.prepend(text);
      this.slide.prepend(loadingDiv);

      //this.video.autoplay = true;
      this.video.loop = true;
      this.video.setAttribute('playsinline', null);
      this.video.setAttribute('muted', 'muted');

      onplaying = function() {
        var self = intro;
        loadingDiv.setAttribute('style', 'display:none');
        clearInterval(loadingRotation);
        self.slide.append(controls)
      };

      onprogress = function() {
        var self = intro;
        clearInterval(loadingRotation);
        interval = setInterval(function() {
          var ct = self.video.currentTime;
          if( ct > 2 && ct < 4.5 ) {
            text.setAttribute('class', 'video-text');
            text.innerHTML = '<p>The Best Headphone Brands</p>'
          } else if( ct > 5.5 && ct < 8 ) {
            text.setAttribute('class', 'video-text');
            text.innerHTML = '<p>The Lowest Prices</p>'
          } else if( ct > 8.5 && ct < 11 ) {
            text.setAttribute('class', 'video-text');
            text.innerHTML = '<p>Free Online Expert Advice, Guides & Reviews</p>'
          } else if( ct > 11.5 && ct < 14 ) {
            text.setAttribute('class', 'video-text');
            text.innerHTML = '<p>Proper Customer Service</p>'
          } else if( ct > 14.5 && ct < 17 ) {
            text.setAttribute('class', 'video-text');
            text.innerHTML = '<p>Plus 3 Months to Pay At 0% Interest</p>'
          } else if( ct > 17.5 && ct < 20 ) {
            text.setAttribute('class', 'video-text');
            text.innerHTML = '<p>Will Make you</p>'
          } else if( ct > 20.5 && ct < 23) {
            text.setAttribute('class', 'video-text');
            text.innerHTML = '<p>As Happy As Larry</p>'
          } else if( ct > 26 && ct < 38) {
            text.setAttribute('class', 'video-text bigger');
            text.innerHTML = '<p>This is Larry</p>'
          } else if(self.video.currentTime > 39 ) {
            onended();
          } else {
            text.setAttribute('class', 'video-text balanced-text');
            text.innerHTML = '';
          }
        }, 500)
      };

      onended = function() {
        var self = intro;
        //self.slide.append(controls);
        self.video.pause();
      };

      metaLoaded = function() {
        var self = intro
        screen.setAttribute('class', 'screen');
        self.slide.prepend(self.video);
      };

      loadingQuotes = function() {
        var quoteLength = quotes.length
          , i = 1

        function loadQuote() {
          var text = ''
          text = '<p>' + 'Some fun quotes whilst you wait&hellip;' + '</p>';
          text += '<p>' + quotes[i].quote + '</p>';
          text += '<p>' + quotes[i].description + '</p>';
          return text
        }
        loadingDiv.innerHTML = loadQuote();
        loadingRotation = setInterval( function() {
          ( i < quoteLength -1 ) ? i++: i=0;
          loadingDiv.innerHTML = loadQuote();
        }, 10000 );
      };

      bind = function() {
        var self = intro
          , video = self.video;
        video.addEventListener('loadeddata', metaLoaded);
        video.addEventListener('play', onplaying);
        video.addEventListener('progress', onprogress);
        muteBtn.addEventListener('click', function(e) {
          if( video.muted ) {
            video.muted = false;
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>'
          } else {
            muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>'
            video.muted = true;
          }
        });
      };

      //loadingQuotes();
      bind();
      this.video.load();
      this.video.play();
    },

    mobileStrategy: function() {
      var interval
        , i = 0
        , linkBtn = document.createElement('a')
        , path = '/images/stills/'

        , src = [
            '001.jpg',
            '',
            '007.jpg',
            '',
            '008.jpg',
            '',
            '22291.jpg',
            '22306.jpg',
            '22320.jpg',
            '008.jpg',
            '009.jpg',
            '',
            '013.jpg',
            '013.jpg',
            '',
            '',
            '',
            '',
            ''
          ]

        , text = [
            '',
            '<p class="bigger">walking</p>',
            '',
            '<p class="bigger">jogging</p>',
            '',
            '<p class="bigger">or running</p>',
            '',
            '',
            '',
            '<p>all dogs need exercise</p>',
            '<p>and they all love adventure</p>',
            '<p>We\'re here to make that</p>',
            '',
            '',
            '<p class="bigger">Easy!</p>',
            '<p>Click here to watch the full trailer</p>',
            '<p>Click here to watch the full trailer</p>',
            '<p>Click here to watch the full trailer</p>'
          ]

        , sliderWrapper = document.createElement('div')
        , screen = document.createElement('div')
        , images = [];
       
      linkBtn.href = 'https://s3-eu-west-1.amazonaws.com/dogjog/dogjog' + this.videoType;
      linkBtn.setAttribute('class', 'video-link-button');
      sliderWrapper.setAttribute('class', 'slider-wrapper');
      screen.setAttribute('class', 'screen');
      this.slide.append(sliderWrapper);
      this.slide.append(screen);
      this.slide.append(linkBtn);


      loaded = function() {
        interval = setInterval(function() {
          images.forEach(function(elem, indx) {
            elem.setAttribute('class', 'slider hidden');
            elem.innerHTML = text[i];
          });
          images[i].setAttribute('class', 'slider');
          (i<src.length - 1) ? i++ : i=0;
          if( i < (src.length -3) && src.length > i ){
            linkBtn.setAttribute('style', 'display:none');
          } else {
            linkBtn.setAttribute('style', 'display:block');
          }
        }, 2000);
      };

      loadimages = function() {
        src.forEach(function(name) {
          var image = document.createElement('div');
          //image.src = path + name;
          image.setAttribute('class','slider hidden');
          image.setAttribute('style', 'background-image:url('+path+name+');')
          images.push(image);
          sliderWrapper.appendChild(image);
        });
        loaded();
      };
      loadimages();
    },

    testBrowser: function() {
      //Is mobile?
      ( this.UA.indexOf('Mobile') == -1 || this. UA.indexOf('iPad') != -1 )
        //getPlayer if not mobile or iPad
        ?  this.desktopStrategy()
        :  this.desktopStrategy();
        //:  this.mobileStrategy();
    }
  };

  intro.init({
    slide: $('#intro'),
    Slider: window.Slider,
    Modernizr: Modernizr
  });
})(jQuery);
