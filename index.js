module.exports = function(el, config){

	// if no config given, assign an empty object
	config = config || {};

	// establish some default configuration
	var font_metric = typeof(config.font_metric) !== 'undefined' ? config.font_metric : 'em';
	var min_size = typeof(config.min_size) !== 'undefined' ? config.min_size : 0;
	var max_size = typeof(config.max_size) !== 'undefined' ? config.max_size : 50;
	var fit_width = typeof(config.fit_width) !== 'undefined' ? config.fit_width : true;
	var fit_height = typeof(config.fit_height) !== 'undefined' ? config.fit_height : true;
	var incrementation = typeof(config.incrementation) !== 'undefined' ? config.incrementation : .1;

	// if neither fit_width or fit_height are true
	if(!fit_width && !fit_height){

		// quit
		return el;

	}

	// get an array of elements from our element argument
	var els = (typeof(jQuery) !== 'undefined' && el instanceof jQuery) ? el.get() : [el];

	for(var e = 0; e < els.length; e++){
		
		// get the element
		var el = els[e];

		// get the current width and height of the containing element
		var w = el.offsetWidth;
		var h = el.offsetHeight;
		
		// grab all the children from the containing element
		var children = el.getElementsByTagName('*');

		// declare an array for populating with relevant elements
		var relevant = [];

		// iterate through the elements children
		for(var i = 0; i < children.length; i++){
		  
		  // get the childNodes of our child element
	    var nodes = children[i].childNodes;

	    // iterate through the childNodes
	    for (var j = nodes.length; j--;) {
        
        // if our childNode contains text, and we're not just looking at white space
        if(nodes[j].nodeType === Node.TEXT_NODE && nodes[j].nodeValue.trim().length) {
        	
        	// add the current element containing this childNode to our relevant list
        	relevant.push(children[i]);
        
        }
	    }
	  }

	  // declare a starting size
	  var size = min_size;

	  // while our size is within our terms
		while(size <= max_size){

		  // get overflowing status
		  var overflow_w = (w < el.scrollWidth);
		  var overflow_h = (h < el.scrollHeight);

		  // formulate a condition based on the fit_width/fit_height variable flags
		  var overflowing = (fit_width && overflow_w) || (fit_height && overflow_h);

		  // iterate through our relevant elements and adjust the size accordingly
		  for(var k = 0; k < relevant.length; k++){

		  	// if we're overflowing, bring the font-size down one, otherwise continue enlarging
			  relevant[k].style.fontSize = ( overflowing ) ? (Math.round((size - incrementation) * 100) / 100) + font_metric : size + font_metric;

			}

			// if we're overflowing, quit
			if( overflowing ){

				// quit
				break;

			}else{

				// increment size while rounding to 2 decimal places
				size = Math.round((size + incrementation) * 100) / 100;

			}
		}
	}

	// return whatever was passed to begin with
	return el;

}