(function(appSpace, $, undefined){
  
  /**
   * Represents a Image Display
   * @constructor
   * @param {oject} jQuery object that holds the slider
   */
  appSpace.ATDImageDisplay = function(imageDisplay) {
    var _this = this;

    _this.initImageDisplay(imageDisplay);

  };

  /**
   * Initializes Image Display
   * 
   * @param {oject} jQuery object that holds the Image Display
   */
  appSpace.ATDImageDisplay.prototype.initImageDisplay = function(imageDisplay) {
    var _this = this;

    _this.imageReplaceEl = imageDisplay;
    _this.targetEl = _this.imageReplaceEl.find('[data-target="atd-image-display"]');
    _this.imageLinks = _this.imageReplaceEl.find('[data-image-src]');
    _this.currentImage = 0;

    //magnifier
    _this.magnifier = null;
    _this.magnifierEl = _this.imageReplaceEl.find('[data-magnify]');

    //set initial image
    _this.setActiveImage(_this.imageLinks.first());

    //set up click handlers
    _this.imageReplaceEl.on('click', '[data-image-src]', function(e) {
      e.preventDefault();
      _this.setActiveImage($(this));
    });

    _this.imageReplaceEl.on('click', '.next-image', function(e) {
      e.preventDefault();
      _this.getNextImage();
    });

    _this.imageReplaceEl.on('click', '.prev-image', function(e) {
      e.preventDefault();
      _this.getPrevImage();
    });

    _this.imageReplaceEl.find().on('click', '.next-image', function(e) {
      e.preventDefault();
      _this.getNextImage();
    });

    _this.targetEl.on('swiperight', function(e) {
      e.preventDefault();
      _this.getPrevImage();
    });

    _this.targetEl.on('swipeleft', function(e) {
      e.preventDefault();
      _this.getNextImage();
    });
  };

  /**
   * Set active image
   * 
   * @param {oject} jQuery object for the image trigger
   */
  appSpace.ATDImageDisplay.prototype.setActiveImage = function(imageTrigger) {
    var _this = this,
      magnifySrc = imageTrigger.data('magnify-src'),
      imageLoaded = false;

    _this.magnifierEl.find('.click-text').remove();
    _this.magnifierEl.find('.hover-text').remove();

    // kill existing magnifier on image switch
    if(_this.magnifier) {
      $('#' + _this.magnifierEl.data('magnify-preview')).remove();
      _this.magnifierEl.find('.magnifier-lens').remove();
      _this.magnifier.kill();
      _this.magnifier = null;
    }

    _this.targetEl.on('load', onImageLoad);
    _this.targetEl.attr('src', imageTrigger.data('image-src'))
      .attr('alt', imageTrigger.data('image-alt'));

    if (_this.targetEl.get(0).complete) {
        onImageLoad();
    }

    _this.currentImage = _this.imageLinks.index(imageTrigger);

    function onImageLoad() {
      _this.targetEl.unbind('load', onImageLoad);
      
      if(imageLoaded) {
        return;
      }
      imageLoaded = true;

      _this.imageLinks.removeClass('active');
      imageTrigger.addClass('active');


      // initialize new magnification
      if(typeof magnifySrc !== 'undefined' && magnifySrc.length && $(window).innerWidth() >= 768) {
        _this.initMagnification(magnifySrc);
        _this.magnifierEl.append('<span class="hover-text"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span> <span class="visually-hidden">Hover to zoom</span></span>');
      }
    }
  };

  /**
   * initialize magnification
   * 
   * @param {string} src of magnification image
   */
  appSpace.ATDImageDisplay.prototype.initMagnification = function(magnifySrc) {
    var _this = this,
      evt = new Event(),
      preview = $('<div id="vdp-magnify-preview" class="magnifier-preview"></div>'),
      aspect = 1,
      img = new Image();

    //add magnified preview offscreen for loading
    preview.appendTo('body');


    // calculate aspect ration of new image
    img.src = _this.targetEl.attr('src');
    aspect = img.height / img.width;
    preview.height(preview.width() * aspect);


    _this.magnifier = new Magnifier(evt);

    _this.magnifier.attach({
      thumb: '#' + _this.magnifierEl.data('magnify-thumb'),
      large: magnifySrc,
      largeWrapper: _this.magnifierEl.data('magnify-preview'),
      zoom: 3
    });

    //move magnified preview into final place
    preview.appendTo(_this.magnifierEl);
  };

   /**
   * get prev image
   * 
   */
   appSpace.ATDImageDisplay.prototype.getPrevImage = function() {
      var _this = this;

      if(_this.currentImage <= 0) {
        _this.currentImage = _this.imageLinks.length - 1;
      }
      else {
        _this.currentImage--;
      }

      _this.setActiveImage(_this.imageLinks.eq(_this.currentImage));
   }

   /**
   * get next image
   * 
   */
   appSpace.ATDImageDisplay.prototype.getNextImage = function() {
      var _this = this;

      if(_this.currentImage >= _this.imageLinks.length - 1) {
        _this.currentImage = 0;
      }
      else {
        _this.currentImage++;
      }

      _this.setActiveImage(_this.imageLinks.eq(_this.currentImage));
   }

}(window.atdApp = window.atdApp || {}, jQuery));