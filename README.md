![Logo](lib/imgs/font-fit-logo@github.jpg)

#font-fit

Force your text nodes to fit their parent elements.

##usage

Call on the containing element:

    var fit = require('fit');

    fit(document.getElementById('container'));

By default, *font-fit* scales text as large as it will go before bleeding the width/height of the container.

If you want to ignore the height of a container, use the following:

    fit(document.getElementById('container'), {fit_height:false});

Likewise, to ignore width:

    fit(document.getElementById('container'), {fit_width:false});