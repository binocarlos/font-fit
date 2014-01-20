var emify = require('emify');

module.exports = function(el, config){

	// if no config given, assign an empty object
	config = config || {};

	// establish some default configuration
	var min_size = typeof config.min_size !== 'undefined' ? config.min_size : 0;
	var max_size = typeof config.max_size !== 'undefined' ? config.max_size : 50;
	var fit_width = typeof config.fit_width !== 'undefined' ? config.fit_width : true;
	var fit_height = typeof config.fit_height !== 'undefined' ? config.fit_height : false;
	var tolerence = typeof config.tollerence !== 'undefined' ? config.tolerence : .01;
	var multiplier = typeof config.multiplier !== 'undefined' ? config.multiplier : .5;

	// if fit_width or fit_height is true
	if(fit_width || fit_height){

		// emify our element
		emify(el);

		// emulate the width of our container without text nodes
		el.style.fontSize = '0em';

		// get the width and height of the containing element with font-size at 0
		var w = el.offsetWidth;
		var h = el.offsetHeight;
		
		// declare a starting size and step amount
		var size = step = max_size;

		// while our increment is above our tolerence
		while(step >= tolerence){

			// adjust our elements font-size
			el.style.fontSize = size + 'em';

			// get overflowing status
		  var overflow_w = (w < el.scrollWidth);
		  var overflow_h = (h < el.scrollHeight);

		  // formulate a condition based on the fit_width/fit_height variable flags
		  var overflowing = (fit_width && overflow_w) || (fit_height && overflow_h);

		  // adjust our size according to our current step amount
			size = (overflowing) ? size - step : size + step;

			// if the size is less than our min_size, force it to min_size
			if(size < min_size){

				size = min_size;

			}

			// narrow the range of our step
			step *= multiplier;

		}
	}

	// return whatever was passed to begin with
	return el;

}