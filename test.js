let rmrf_css = require('rmrf-css'),
    path     = require('path'),
    dir      = '';


rmrf_css({html:path.join(dir, 'index.html'), css:path.join(dir, 'css/tailwind.min.css'), out:'./dist'})
