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
	},
	logOut: async function (exclude) {
		const { players } = this;

		let pLen = players.length;
		for (let i = 0; i < pLen; i++) {
			const p = players[i];

			if (!p || p === exclude || !p.auth)
				continue;
			else if (p.auth.username === exclude.auth.username) {
				if (p.name && p.zoneId)
					await atlas.forceSavePlayer(p.id, p.zoneId);

				if (p.socket?.connected)
					p.socket.emit('dc', {});
				else {
					players.splice(i, 1);
					i--;
					pLen--;
				}
			}
		}
	},
	modifyPlayerCount: function (delta) {
		this.playing += delta;
	}
};
