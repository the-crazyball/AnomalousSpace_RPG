let events = require('../misc/events');

module.exports = {
	list: ['drifter'],
	portraits: {
		drifter: {
			x: 0,
			y: 0
		}
	},
	spells: {
		drifter: []
	},
	stats: {
		drifter: {
			values: {
				hpMax: 35,
				hpPerLevel: 32
			},
			gainStats: {
				int: 1
			}
		}
	},
	weapons: {
		owl: 'ION Cannon'
	},

	getSpritesheet: function (className) {
		return this.stats[className].spritesheet || 'characters';
	},

	init: function () {
		events.emit('onBeforeGetSpirits', this);
	}
};
