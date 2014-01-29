
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("shennan-emify/index.js", function(exports, require, module){
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
});
require.register("font-fit/index.js", function(exports, require, module){
/*

	@overview font-fit component
	@author shennan
	@version 1.0
	@link http://github.com/shennan/font-fit

*/

var emify = require('emify');

/*

	Constructor

*/

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

		// remember the line-height value
		var line_height = el.style.lineHeight;

		// emulate the width of our container without text nodes and strange line-heights
		el.style.fontSize = '0em';
		el.style.lineHeight = 'normal';

		// get the width and height of the containing element with font-size at 0
		var w = el.offsetWidth;
		var h = el.offsetHeight;

		// define a starting size and step amount
		var size = step = max_size;

		// define an overflowing flag
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

		  // define a flag to indicate that we need to multiply our step
		  var multiply;

		  // if we're overflowing (based on a condition using the fit_width/fit_height variable flags and offset vs scroll)
		  if((fit_width && overflow_w) || (fit_height && overflow_h)){

		  	// adjust our multiply flag based on our previous overflowing flag
		  	multiply = overflowing ? false : true;

		  	// adjust our overflow flag
		  	overflowing = true;

		  }else{

		  	// adjust our multiply flag based on our previous overflowing flag
		  	multiply = overflowing ? true : false;

		  	// adjust our overflow flag
		  	overflowing = false;

		  }
		  
		  // adjust our size according to our current step amount
			size = (overflowing) ? size - step : size + step;

			// if the size is less than our min_size, force it to min_size
			if(size < min_size){

				size = min_size;

			}

			// if we need to narrow our step
			if(multiply){
				
				// narrow the range of our step
				step *= multiplier;

			}

			// escape clause
			if(i >= 100){ break }else{ i++; }

		}

		// return our line-height to its original value
		el.style.lineHeight = line_height;

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
});
require.alias("shennan-emify/index.js", "font-fit/deps/emify/index.js");
require.alias("shennan-emify/index.js", "emify/index.js");
