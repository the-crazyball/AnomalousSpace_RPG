require.config({
	baseUrl: '',
	waitSeconds: 120,
	paths: {
        socket: 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.1.3/socket.io.min',
		jquery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.slim.min',
		main: 'js/main',
        helpers: 'js/misc/helpers',
		particles: 'plugins/particle-emitter'
	},
	shim: {
        socket: {
			exports: 'io'
		},
		jquery: {
			exports: '$'
		},
        main: {
            deps: [
                'jquery',
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
