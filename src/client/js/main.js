define([
    'js/library/client',
    'js/rendering/renderer',
    'js/library/input'
], function(
    client,
    renderer,
    input
) {
    return {
        init: function() {
            client.init(this.onClientReady.bind(this));
        },
        onClientReady: function() {
            this.start();
        },
        start: function () {
            renderer.init();
            input.init();
            $('.loader-container').remove();
        }
    }
})