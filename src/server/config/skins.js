const events = require('../misc/events');

const config = {
	drifter: {
		name: 'Drifter',
		sprite: [0, 0],
		defaultSpirit: '',
		default: true
	}
};

module.exports = {
	init: function () {
		events.emit('onBeforeGetSkins', config);
	},

	getBlueprint: function (skinId) {
		return config[skinId];
	},

	getList: function (skins) {
		const result = Object
			.entries(config)
			.map(([skinId, skinConfig]) => {
				const { sprite: [ spriteX, spriteY ] } = skinConfig;

				const serializedSprite = `${spriteX},${spriteY}`;

				const skin = {
					id: skinId,
					...skinConfig,
					sprite: serializedSprite
				};

				return skin;
			});

		return result;
	},

	getCell: function (skinId) {
		let skin = config[skinId] || config.drifter;
		return (skin.sprite[1] * 8) + skin.sprite[0];
	},

	getSpritesheet: function (skinId) {
		let skin = config[skinId] || config.drifter;
		return skin.spritesheet || 'characters';
	}
};
