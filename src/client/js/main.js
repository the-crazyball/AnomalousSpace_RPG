define([
    'js/library/client',
    'ui/factory',
    'js/rendering/renderer',
    'js/library/input',
    'js/library/events'
], function(
    client,
    uiFactory,
    renderer,
    input,
    events
) {

    let fnQueueTick = null;
	const getQueueTick = updateMethod => {
		return () => requestAnimationFrame(updateMethod);
	};

    return {
        hasFocus: true,

		lastRender: 0,
		msPerFrame: ~~(1000 / 60),

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

            fnQueueTick = getQueueTick(this.update.bind(this));
			fnQueueTick();
            
            $('.loader-container').remove();
        },
        update: function () {
            const time = +new Date();
			if (time - this.lastRender < this.msPerFrame - 1) {
				fnQueueTick();

				return;
			}

			renderer.update();
			uiFactory.update();

			renderer.render();

			this.lastRender = time;

			fnQueueTick();
        }
    }
})