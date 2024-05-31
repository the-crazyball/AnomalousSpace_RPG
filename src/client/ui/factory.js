define([
    'ui/default',
], function (
    uiDefault
) {
    return {
        uis: [],
        ingameUisBuilt: false,
        root: '',
        uiList: [
            'messages'
        ],

        init: async function () {

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
    }
})