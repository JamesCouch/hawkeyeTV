
if (typeof DEBUG === 'undefined') DEBUG = true;

require.config({

    baseUrl: '/',

    paths: {
        'jquery'              : 'assets/lib/jquery',
        'underscore'          : 'assets/lib/underscore',         
        'backbone'            : 'assets/lib/backbone',
        'bootstrap'           : 'assets/vendor/bootstrap/js/bootstrap',
        'text'                : 'assets/lib/text',
        'parsley'             : 'assets/lib/parsley'
    },

    shim: {
        'underscore'          : { exports  : '_' },
        'backbone'            : { deps : ['underscore', 'jquery'], exports : 'Backbone' },
        'bootstrap'           : { deps : ['jquery'], exports : 'Bootstrap' },
        'parsley'             : { deps: ['jquery'] }
    }

});

require(['main']);
