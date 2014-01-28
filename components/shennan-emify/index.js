module.exports = function(el){

	// vars
	var element_node_type = typeof Node !== 'undefined' && typeof Node.ELEMENT_NODE !== 'undefined' ? Node.ELEMENT_NODE : 1; /* IE7 fallback */

	// common conversions
	var px_to_ems = 16;
	var px_to_pt = .75;
	var keywords_to_ems = {

		'x-small':.625,
		'small':.8,
		'medium':1,
		'large':1.125,
		'x-large':1.5,
		'xx-large':2

	}

	// travel up the container until we reach a font-size with absolute values, then return the calculated container font-size in pixels
	var container_pixels = function(el, multiplier){

		// if there is no style property, return our default pixels
		if(typeof(el.style) === 'undefined'){ return px_to_ems; }

		// default vars
		multiplier = multiplier || 1;

		// get the font size
		var size = parseFloat(el.style.fontSize);

		// get the operator or keyword
		var operator = el.style.fontSize.replace(/[0-9]|\./g, '');

		// if the font-size is an absolute value
		if(operator === 'px' || operator === 'pt'){

			// return the calculated pixels, stopping execution
			return operator === 'px' ? size * multiplier : (size / px_to_pt) * multiplier;

		// if the font-size is in ems 
		}else if(operator === 'em'){

			// adjust the multiplier accordingly
			multiplier *= size;

		// if the font-size is in percentage
		}else if(operator === '%'){

			// adjust the multiplier accordingly
			multiplier *= (multiplier * size) / 100;

		}

		// if we haven't reached an absolute font-size and we haven't reached the body element
		if(el !== document.body){
			
			// call this function again, passing the parent and the current multiplier
			return container_pixels(el.parentNode, multiplier);

		}
	}

	// travel down the tree from the container and make font-size changes as we go
	function traverse(el, pixels, multiplier){

		// default vars 
		pixels = pixels || px_to_ems;
		multiplier = multiplier || 1;

		// get the font size
		var size = parseFloat(el.style.fontSize);

		// get the operator or keyword
		var operator = el.style.fontSize.replace(/[0-9]|\./g, '');

		// if the font-size is an absolute value
		if(operator === 'px' || operator === 'pt'){
			
			// adjust the multiplier accordingly
			multiplier = operator === 'px' ? size / pixels : (size / pixels) / px_to_pt;

			// adjust the pixels
			pixels *= multiplier

		// if our font-size is in ems
		}else if(operator === 'em'){
			
			// adjust the pixels
			pixels *= size;
			
			// adjust the multiplier accordingly
			multiplier *= size;

		// if our font-size is in percentage
		}else if(operator === '%'){
			
			// adjust the pixels
			pixels *= size / 100;

			// adjust the multiplier accordingly
			multiplier *= size / 100;

		}

		// if there is font-style and the font-style is an absolute value
		if(el.style.fontSize !== "" && (operator === 'px' || operator === 'pt')){
			
			// apply the calculated ems to the element's font-size
			el.style.fontSize = multiplier + 'em';

		}

		// if we have nodes below the element
		if(el.childNodes && el.childNodes.length){

			// iterate through the nodes
			for(var i in el.childNodes){

				// if the node type is an element
				if(el.childNodes[i].nodeType === element_node_type){

					// call the function recursively
					traverse(el.childNodes[i], pixels, multiplier);

				}
			}
		}
	}
	
	// execute
	traverse(el, container_pixels(el.parentNode));

	// return whatever was passed to begin with
	return el;

}