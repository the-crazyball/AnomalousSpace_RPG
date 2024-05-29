require.config({
	baseUrl: '',
	waitSeconds: 120,
	paths: {
		jquery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.slim.min',
		main: 'js/main',
        helpers: 'js/misc/helpers',
		particles: 'plugins/particle-emitter'
	},
	shim: {
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
