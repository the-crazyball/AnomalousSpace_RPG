define([
    'js/rendering/renderer',
    'js/library/input'
], function(
    renderer,
    input
) {
    return {
        init: function() {
            this.start();
        },
        start: function () {
            renderer.init();
            input.init();
            $('.loader-container').remove();
        }
    }
})