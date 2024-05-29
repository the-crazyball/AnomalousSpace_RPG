define([
    'js/rendering/renderer'
], function (
    renderer
) {
    return {
        mouse: {
            button: null,
            x: 0,
            y: 0
        },
        enabled: true,

        init: function () {
            $('.ui-container')
				.on('mousedown', this.events.mouse.mouseDown.bind(this))
				.on('mouseup', this.events.mouse.mouseUp.bind(this))
				.on('mousemove', this.events.mouse.mouseMove.bind(this))
				.on('touchstart', this.events.touch.touchStart.bind(this))
				.on('touchmove', this.events.touch.touchMove.bind(this))
				.on('touchend', this.events.touch.touchEnd.bind(this))
				.on('touchcancel', this.events.touch.touchCancel.bind(this));

        },

        events: {
            mouse: {
				mouseDown: function (e) {
					let el = $(e.target);
					if ((!el.hasClass('ui-container')) || (el.hasClass('blocking')))
						return;

					let button = e.button;
					this.mouse.button = button;
					this.mouse.down = true;
					this.mouse.event = e;

					//This is needed for casting targetted spells on Mobile...it's hacky.
					this.mouse.worldX = e.pageX + renderer.pos.x;
					this.mouse.worldY = e.pageY + renderer.pos.y;

					events.emit('mouseDown', this.mouse);
				},
				mouseUp: function (e) {
					let el = $(e.target);
					if ((!el.hasClass('ui-container')) || (el.hasClass('blocking')))
						return;

					this.mouse.button = null;
					this.mouse.down = false;

					events.emit('mouseUp', this.mouse);
				},
				mouseMove: function (e) {
					if (e)
						this.mouseRaw = e;
					else
						e = this.mouseRaw;

					if (!e)
						return;

					let el = $(e.target);
					if ((!el.hasClass('ui-container')) || (el.hasClass('blocking')))
						return;

					this.mouse.x = e.offsetX + renderer.pos.x;
					this.mouse.y = e.offsetY + renderer.pos.y;
				}
			},

			touch: {
				touchStart: function (e) {
					let el = $(e.target);
					if ((!el.hasClass('ui-container')) || (el.hasClass('blocking')))
						return;

					let touch = e.touches[0];
					events.emit('onTouchStart', {
						x: touch.clientX,
						y: touch.clientY,
						worldX: touch.clientX + renderer.pos.x,
						worldY: touch.clientY + renderer.pos.y
					});
				},

				touchMove: function (e) {
					let el = $(e.target);
					if ((!el.hasClass('ui-container')) || (el.hasClass('blocking')))
						return;

					let touch = e.touches[0];
					events.emit('onTouchMove', {
						x: touch.clientX,
						y: touch.clientY,
						touches: e.touches.length
					});
				},

				touchEnd: function (e) {
					let el = $(e.target);
					if ((!el.hasClass('ui-container')) || (el.hasClass('blocking')))
						return;

					events.emit('onTouchEnd');
				},

				touchCancel: function (e) {
					let el = $(e.target);
					if ((!el.hasClass('ui-container')) || (el.hasClass('blocking')))
						return;

					events.emit('onTouchCancel');
				}
			},

        }
    }
})