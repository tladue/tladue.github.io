(function(appSpace, $, Modernizr, undefined){
  
  /**
   * Represents a Content Slider
   * @constructor
   * @param {oject} jQuery object that holds the slider
   */
  appSpace.ATDContentSlider = function(slider) {
    var _this = this;

    _this.activeSlide = 0; // index of active slide
    _this.slides = []; // array to hold slides
    
    _this.initSlider(slider);

  };

  /**
   * Initializes slider
   * 
   * @param {oject} jQuery object that holds the slider
   */
  appSpace.ATDContentSlider.prototype.initSlider = function(slider) {
    var _this = this;

    _this.sliderEl = slider;

    // populate slide array
    _this.sliderEl.find('.slide').each(function() {
      var slide = {},
      slideBack;
      slide.el = $(this);

      if(!Modernizr.csstransitions) {
        slide.el.css({left: '100%'});
      }

      _this.slides.push(slide);
    });

    if(!Modernizr.csstransitions) {
      _this.slides[0].el.css({left: '0%'});
    }
    //set slider list height 
    _this.setSliderHeight();
    $(window).resize(function() {
       _this.setSliderHeight();
    });

    _this.sliderEl.find('.slide-prev').addClass('inactive');
    if(_this.slides.length <= 1) {
      _this.sliderEl.find('.slide-next').addClass('inactive');
    }


    // click handlers for slideshow buttons
    _this.sliderEl.on('click', '.slide-prev', function(e) {
      e.preventDefault();
      _this.advanceSlide(true);
    });

    _this.sliderEl.on('click', '.slide-next', function(e) {
      e.preventDefault();
      _this.advanceSlide(false);
     });
  };

  /**
   * set slider list height
   * 
   */
   appSpace.ATDContentSlider.prototype.setSliderHeight = function(reverse) {
      var _this = this;

      if($(window).innerWidth() < 768) {
        _this.sliderEl.find('.slide-list').innerHeight(_this.slides[0].el.outerHeight() * 2);
      }
      else {
        _this.sliderEl.find('.slide-list').innerHeight(_this.slides[0].el.outerHeight());
      }

      sliderTitles();
   };

  /**
   * Advance slide
   * 
   * @param {boolean} should reverse direction
   */
  appSpace.ATDContentSlider.prototype.advanceSlide = function(reverse) {
    var _this = this,
      newIndex = _this.activeSlide;

    if(reverse) {
      if(newIndex > 0) {
        newIndex--;
        _this.sliderEl.find('.slide-next').removeClass('inactive');

        if(newIndex === 0) {
          _this.sliderEl.find('.slide-prev').addClass('inactive');
        }
      }
    }
    else {
      if(newIndex < _this.slides.length - 1) {
        newIndex++;
        _this.sliderEl.find('.slide-prev').removeClass('inactive');

        if(newIndex >= _this.slides.length - 1) {
          _this.sliderEl.find('.slide-next').addClass('inactive');
        }
      }
    }

    _this.activateSlide(newIndex, reverse);
  };

  /**
   * Activate slide given index
   * 
   * @param {integer} index of slide to activate
   * @param {boolean} is animation reversed?
   */
  appSpace.ATDContentSlider.prototype.activateSlide = function(index, reverse) {
    var _this = this;

    if(typeof reverse === 'undefined') {
      if(index < _this.activeSlide) {
        reverse = true;
      }
    }

    if(_this.slides.length > index) {
      if(Modernizr.csstransitions) {
        _this.slides[index].el.removeClass('out-left').removeClass('out-right');
      }
      else {
        _this.slides[index].el.animate({left: '0%'}, 300);
      }

      _this.deactivateSlide(reverse, index);

      _this.activeSlide = index;
    }
  };

  /**
   * Deactivate current Slide
   * @param {boolean} is animation reversed?
   * @param {integer} index of new slide
   */
  appSpace.ATDContentSlider.prototype.deactivateSlide = function(reverse, index) {
    var _this = this,
      i = _this.activeSlide;

    if(i !== index) {
      if(reverse) {
        if(Modernizr.csstransitions) {
          _this.slides[i].el.addClass('out-right');
        }
        else {
          _this.slides[i].el.animate({left: '100%'}, 300);
        }

      }
      else {
        if(Modernizr.csstransitions) {
          _this.slides[i].el.addClass('out-left');
        }
        else {
          _this.slides[i].el.animate({left: '-100%'}, 300);
        }
      }
    }
  };

  function sliderTitles() {
    $('.slide-list').each(function() {
      var height = 0;
      $(this).find('.slide-title').each(function() {
        if($(this).height() > height) {
          height = $(this).height();
        }
      });

      $(this).find('.slide-title').each(function() {
        var margin = height - $(this).height();
        $(this).css({'margin-top': margin + 'px'});
      });
    });
  }

}(window.atdApp = window.atdApp || {}, jQuery, Modernizr));