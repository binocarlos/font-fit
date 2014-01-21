var emify = require('emify');

module.exports = function(el, config){

	// if no config given, assign an empty object
	config = config || {};

	// establish some default configuration
	var min_size = typeof config.min_size !== 'undefined' ? config.min_size : 0;
	var max_size = typeof config.max_size !== 'undefined' ? config.max_size : 50;
	var fit_width = typeof config.fit_width !== 'undefined' ? config.fit_width : true;
	var fit_height = typeof config.fit_height !== 'undefined' ? config.fit_height : true;
	var tolerence = typeof config.tollerence !== 'undefined' ? config.tolerence : .0001;
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

		// define a starting size and step amount
		var size = step = max_size;

		// declare a variable
		var overflowing = true;

		// keep an eye on how many times our while loop is iterating
		var i = 0;

		// while our increment is above our tolerence
		while(step >= tolerence || overflowing){
			
			// adjust our elements font-size
			el.style.fontSize = size + 'em';

			// get overflowing status
		  var overflow_w = (w < el.scrollWidth);
		  var overflow_h = (h < el.scrollHeight);

		  // formulate a condition based on the fit_width/fit_height variable flags
		  overflowing = (fit_width && overflow_w) || (fit_height && overflow_h);
		  
		  // adjust our size according to our current step amount
			size = (overflowing) ? size - step : size + step;

			// if the size is less than our min_size, force it to min_size
			if(size < min_size){

				size = min_size;

			}

			// narrow the range of our step
			step *= multiplier;

			// escape clause
			if(i >= 100){ break }else{ i++; }

		}
	}

	/* Note: padding and border support only for browsers with getComputedStyle */

	// if we have the getComputedStyle method to hand
	if(document.defaultView && document.defaultView.getComputedStyle){

		// get the computed bottom padding/border
		var padding = parseFloat(document.defaultView.getComputedStyle(el).getPropertyValue('padding-bottom'));
		var border = parseFloat(document.defaultView.getComputedStyle(el).getPropertyValue('border-bottom'));

		// if the element has bottom padding/border
		if(padding || border){

			// get the pixel/em ratio from the computed font-size of the parent element
			var px_to_ems = (el.parentNode) ? parseFloat(document.defaultView.getComputedStyle(el.parentNode).getPropertyValue('font-size')) : 16;
			
			// reduce the font-size of the element by the appropriate padding/border amount in ems
			el.style.fontSize = (size - (padding / px_to_ems) - (border / px_to_ems)) + 'em';

		}
	}

	// return whatever was passed to begin with
	return el;

}