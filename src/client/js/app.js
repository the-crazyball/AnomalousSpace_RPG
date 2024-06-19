require.config({
	baseUrl: '',
	waitSeconds: 120,
	paths: {
        socket: 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.1.3/socket.io.min',
		jquery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.slim.min',
		text: 'https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min',
		html: 'plugins/html',
		css: 'https://cdnjs.cloudflare.com/ajax/libs/require-css/0.1.10/css.min',
		main: 'js/main',
        helpers: 'js/misc/helpers',
		particles: 'plugins/particle-emitter',
		honeycomb: 'plugins/honeycomb-grid'
	},
	shim: {
        socket: {
			exports: 'io'
		},
		jquery: {
			exports: '$'
		},
		helpers: {
			deps: [
				'jquery'
			]
		},
        main: {
            deps: [
                'helpers',
                'js/library/input'
            ]
        }
	}
});

require([
	'main'
], function (
	main
) {
	main.init();
});
