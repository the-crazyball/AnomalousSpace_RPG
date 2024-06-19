const objects = require('../objects/objects');

const { route, routeGlobal } = require('./connections/route');

module.exports = {
	players: [],

	sockets: null,
	playing: 0,

	onHandshake: function (socket) {
		if (this.players.some(f => f.socket.id === socket.id))
			return;

		const p = objects.build();
		p.socket = socket;
		p.addComponent('auth');
		p.addComponent('player');

		objects.pushObjectToList(p);

		this.players.push(p);
	},
	onDisconnect: async function (socket) {
		let player = this.players.find(p => p.socket.id === socket.id);

		if (!player)
			return;

		this.players.spliceWhere(p => p.socket.id === socket.id);
	},
	route: function (socket, msg) {
		route.call(this, socket, msg);
	},
	routeGlobal: function (msg) {
		routeGlobal.call(this, msg);
	}
};
