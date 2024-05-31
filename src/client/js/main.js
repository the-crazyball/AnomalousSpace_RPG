define([
    'js/library/client',
    'ui/factory',
    'js/rendering/renderer',
    'js/library/input'
], function(
    client,
    uiFactory,
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

            uiFactory.init();
            
            $('.loader-container').remove();
        }
    }
})