
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
require.register("font-fit/index.js", function(exports, require, module){
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
});