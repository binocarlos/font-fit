![Logo](lib/imgs/font-fit-logo@github.jpg)

#font-fit

Force your text nodes to fit their parent elements.

##usage

Call on the containing element:

    var fit = require('fit');

    fit(document.getElementById('container'));

By default, *font-fit* ignores the containers height. If you want to base the calculations on containing height only:

    fit(document.getElementById('container'), {fit_width:false, fit_height:true});

Or make sure that the text fits width and height:

    fit(document.getElementById('container'), {fit_width:true, fit_height:true});