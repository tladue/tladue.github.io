$(window).load(function(){
	$('select').customSelect();
});

$(document).ready(function() {
	//set up form validation
	initiateValidation();

	// create and initialize any sliders on the page
	$('.atd-slider').each(function() {
		var slider = new window.atdApp.ATDContentSlider($(this));
	});

	// create and initialize any image displays on the page
	$('.atd-image-display').each(function() {
		var imageDisplay = new window.atdApp.ATDImageDisplay($(this));
	});

	// set up toggles for mobile off screen sheets
	$('body').on('click', '[data-sheet-toggle]', function(e) {
		var selector = $(this).data('sheet-toggle');

		e.preventDefault();

		var bodyOffset = 0;
		// stop body from scrolling behind sheet
		if($('[data-xs-sheet="' + selector + '"]').hasClass('active')) {
			bodyOffset = parseInt($('body').css('top').replace('px', ''), 10);
			$('body').removeClass('noscroll');
			window.scrollTo(0, -bodyOffset);
		}
		else {
			bodyOffset = window.pageYOffset;
			$('body').addClass('noscroll').css({top: -bodyOffset + 'px'});
		}

		$('[data-xs-sheet="' + selector + '"]').toggleClass('active').focus();
		$('#main-nav-toggle').removeClass('fixed');
	});

	// handle switching between fields in offscreen sheet
	$('body').on('focus', '[data-xs-sheet] select, [data-xs-sheet] input, [data-xs-sheet] textarea', function(e) {
		$(this).closest('[data-xs-sheet]').addClass('active');
		var bodyOffset = window.pageYOffset;
		$('body').addClass('noscroll').css({top: -bodyOffset + 'px'});
	});

	$('body').on('blur', '[data-xs-sheet] select, [data-xs-sheet] input, [data-xs-sheet] textarea', function(e) {
		$(this).closest('[data-xs-sheet]').removeClass('active');
		var bodyOffset = parseInt($('body').css('top').replace('px', ''), 10);
		$('body').removeClass('noscroll');
		window.scrollTo(0, -bodyOffset);
	});

	//move sheets to end of body
	$('[data-xs-sheet].xs-append-body').each(function() {
		$(this).clone().appendTo('body').addClass('xs-visible');
		$(this).addClass('xs-hidden').removeAttr('data-xs-sheet');
	});

	//init appendAround 
	$('.rover').appendAround();

	//init popovers
	$('[data-toggle="popover"]').on('click',function(e){
    		e.preventDefault();
  		})
		.popover({html: true});
	
	//setup click handler for popover close button
	$('[data-toggle="popover"]').on('shown.bs.popover', function() {
		//only one can be open at a time
		$('[data-toggle="popover"]').not(this).popover('hide');
		$('select').customSelect();

		$('.popover-cancel').on('click', {parent: $(this)}, function(e) {
			e.preventDefault();
			e.data.parent.popover('hide');
		});

		// activate any incrementers
		$('[data-atd-increment]').each(function() {
			var incrementer = new atdApp.ATDIncrementer($(this));
		});

		//set up form validation
		initiateValidation();
	});
	//remove cancel button click handler
	$('[data-toggle="popover"]').on('hide.bs.popover', function() {

		$('.popover-cancel').unbind('click');
	});

	//activate datepickers
	var date = new Date();
	date.setHours(23,59,59,59);
	$('.datepicker').datetimepicker({
		format: 'MM/DD/YYYY',
		'minDate': new Date('Jan 01, 2001'),
		'maxDate': date
	});
	$('.datepicker').next('.btn.btn-calendar').click(function(e) {
		e.preventDefault();
		$(this).prev('.datepicker').trigger('focus');
	});

	/* init xs collapse */
	$('[data-toggle="xs-collapse"]').on('click', function(e) {
		e.preventDefault();
		$($(this).attr('href')).toggleClass('open');
		$(this).toggleClass('open');
	});

	/* event listener for user location select */
	$('#bin-delivery-location, #ib-delivery-location').on('change', function(e) {
		if($(this).val()  === 'other') {
			if($(window).innerWidth() < 768) {
				var selector = 'add-location-sheet',
				bodyOffset = 0;
				// stop body from scrolling behind sheet
				if($('[data-xs-sheet="' + selector + '"]').hasClass('active')) {
					bodyOffset = parseInt($('body').css('top').replace('px', ''), 10);
					$('body').removeClass('noscroll');
					window.scrollTo(0, -bodyOffset);
				}
				else {
					bodyOffset = window.pageYOffset;
					$('body').addClass('noscroll').css({top: -bodyOffset + 'px'});
				}

				$('[data-xs-sheet="' + selector + '"]').toggleClass('active').focus();
			}
			else {
				$('#add-location-modal').modal('show');
			}
		}
	});

	/* manually open vdp image modal */
	$('[href="#slider-modal"]').on('click', function(e) {
		e.preventDefault();

		if($(window).innerWidth() >= 768) {
			$('#slider-modal').modal('show');
		}

	});

	/* add scroll handler for sticky mobile menu button */
	if($(window).innerWidth() < 768) {
		var oldWindowPos = window.pageYOffset,
			scrollCheckBlock = false;
		$(window).on('scroll', function() {
			if(scrollCheckBlock) {
				return;
			}

			var windowPos = window.pageYOffset;

			if(windowPos <= 0 || windowPos > oldWindowPos) {
				$('#main-nav-toggle').removeClass('fixed');
			}
			else if(windowPos < oldWindowPos) {
				$('#main-nav-toggle').addClass('fixed');
			}

			oldWindowPos = windowPos;
			scrollCheckBlock = true;

			window.setTimeout(function(){
				scrollCheckBlock = false;
			}, 50);
		});
	}
});

function initiateValidation() {
	$('.validate-form').validate({
		errorPlacement: function(error, element) {
	   		if(element.data('error-message')) {
	   			error.text(element.data('error-message'));
	   		}

	   		if(element.closest('.form-group').find('span.error').length) {
	   			return;
	   		}

	   		if(element.data('error-placement') === 'after') {
		   		error.appendTo(element.closest('.form-group')).addClass('after');
		   	}
		   	else {
		   		error.prependTo(element.closest('.form-group'));
		   	}
		},
		highlight: function(element, errorClass) {
			$(element).closest('.form-group').addClass('has-error');
		},
		unhighlight: function(element, errorClass, validClass) {
			$(element).removeClass('error');
			var parent = $(element).closest('.form-group');
			if(!parent.find('[aria-invalid="true"]').length) {
				parent.removeClass('has-error');
			}
		},
		errorElement: 'span'
	});
}
