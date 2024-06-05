define([
    'ui/default',
    'js/library/events'
], function (
    uiDefault,
    events
) {
    return {
        uis: [],
        ingameUisBuilt: false,
        root: '',
        uiList: [
            'messages'
        ],

        init: function () {
            events.on('onBuildIngameUis', this.onBuildIngameUis.bind(this));
			events.on('onUiKeyDown', this.onUiKeyDown.bind(this));
			events.on('onResize', this.onResize.bind(this));
        },
        onBuildIngameUis: async function () {
            if (!this.ingameUisBuilt) {
				events.clearQueue();

                await Promise.all(
                    this.uiList.map(u => {
                        const uiType = u.path ? u.path.split('/').pop() : u;

                        return new Promise(res => {
                            const doneCheck = () => {
                                const isDone = this.uis.some(ui => ui.type === uiType);
                                if (isDone) {
                                    res();

                                    return;
                                }

                                setTimeout(doneCheck, 100);
                            };

                            this.build(uiType, { path: u.path });

                            doneCheck();
                        });
                    })
                );
                this.ingameUisBuilt = true;
            }

        },
        build: function (type, options) {
			let className = 'ui' + type[0].toUpperCase() + type.substr(1);
			let el = $('.' + className);
			if (el.length > 0)
				return;

			this.getTemplate(type, options);
		},
        getTemplate: function (type, options) {
			let path = null;
			if (options && options.path)
				path = options.path + `\\${type}.js`;
			else {
				const entryInClientConfig = this.uiList.find(u => u.type === type);
				if (entryInClientConfig)
					path = entryInClientConfig.path;
				else
					path = this.root + 'ui/templates/' + type + '/' + type;
			}

			require([path], this.onGetTemplate.bind(this, options, type));
		},
        onGetTemplate: function (options, type, template) {
			let ui = $.extend(true, { type }, uiDefault, template);
			ui.setOptions(options);
		
			requestAnimationFrame(this.renderUi.bind(this, ui));
		},
        renderUi: function (ui) {
			ui.render();
			ui.el.data('ui', ui);

			this.uis.push(ui);
		},
        onResize: function () {
			this.uis.forEach(function (ui) {
				if (ui.centered)
					ui.center();
				else if ((ui.centeredX) || (ui.centeredY))
					ui.center(ui.centeredX, ui.centeredY);
			}, this);
		},
        onUiKeyDown: function (keyEvent) {
			if (keyEvent.key === 'esc') {
				this.uis.forEach(u => {
					if (!u.modal || !u.shown)
						return;

					keyEvent.consumed = true;
					u.toggle();
				});
				
				$('.uiOverlay').hide();
				events.emit('onHideContextMenu');
			} else if (['o', 'j', 'h', 'i'].indexOf(keyEvent.key) > -1)
				$('.uiOverlay').hide();
		},
        update: function () {
			let uis = this.uis;
			let uLen = uis.length;
			for (let i = 0; i < uLen; i++) {
				let u = uis[i];
				if (u.update)
					u.update();
			}
		},
        getUi: function (type) {
			return this.uis.find(u => u.type === type);
		}
    }
})