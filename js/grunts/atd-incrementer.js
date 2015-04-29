(function(appSpace, $, undefined){
	
	/**
	 * Represents a Incrementer
	 * @constructor
	 * @param {oject} jQuery object that holds the incrementer
	 */
	appSpace.ATDIncrementer = function(incrementer) {
		var _this = this;

		_this.initIncrementer(incrementer);
	};

	/**
	 * Initializes incrementer
	 * 
	 * @param {oject} jQuery object that holds the incrementer
	 */
	appSpace.ATDIncrementer.prototype.initIncrementer = function(incrementer) {
		var _this = this,
			id = $(incrementer).attr('id');

		_this.incrementerEl = incrementer;
		_this.startValue = _this.getValue();
		_this.increment = parseInt(_this.incrementerEl.data('atd-increment'), 10);
		_this.upEl = $('[data-atd-increment-up="' + id + '"]');
		_this.downEl = $('[data-atd-increment-down="' + id + '"]');

		_this.downEl.addClass('inactive');

		_this.upEl.click(function(e) {
			e.preventDefault();
			_this.incrementUp();
		});

		_this.downEl.click(function(e) {
			e.preventDefault();
			_this.incrementDown();
		});

		_this.incrementerEl.change(function() {
			_this.setValue(_this.getValue());
		});
	};

	/**
	 * Increment incrementer
	 */
	appSpace.ATDIncrementer.prototype.incrementUp = function() {
		var _this = this,
			value = _this.getValue();

		_this.setValue(value + _this.increment);
	};

	/**
	 * Decrement incrementer
	 */
	appSpace.ATDIncrementer.prototype.incrementDown = function() {
		var _this = this,
			value = _this.getValue();

		value -= _this.increment;

		_this.setValue(value);
	};

	/**
	 * Get value
	 */
	appSpace.ATDIncrementer.prototype.getValue = function() {
		var _this = this,
			value = parseInt(_this.incrementerEl.val().replace(/\,/g,''), 10);

		if(isNaN(value)) {
			return 0;
		}

		return value;
	};

	/**
	 * Set value
	 */
	appSpace.ATDIncrementer.prototype.setValue = function(value) {
		var _this = this;

		_this.downEl.removeClass('inactive');

		if(value <= _this.startValue || isNaN(value)) {
			value = _this.startValue;
			_this.downEl.addClass('inactive');
		}

		_this.incrementerEl.val(numberWithCommas(value));
	};

	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	$(document).ready(function() {
		$('[data-atd-increment]').each(function() {
			var incrementer = new appSpace.ATDIncrementer($(this));
		});
	});

}(window.atdApp = window.atdApp || {}, jQuery));