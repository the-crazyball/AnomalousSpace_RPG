define([
	'socket',
	'js/library/events'
], function (
	io,
	events
) {
    return {
        doneConnect: false,

        init: function (cb) {
            this.socket = io({
                transports: ['websocket']
            });

            this.socket.on('connect', this.onConnected.bind(this, cb));
			this.socket.on('handshake', this.onHandshake.bind(this));
			this.socket.on('event', this.onEvent.bind(this));
			this.socket.on('events', this.onEvents.bind(this));
			this.socket.on('dc', this.onDisconnect.bind(this));

			Object.entries(this.processAction).forEach(([k, v]) => {
				this.processAction[k] = v.bind(this);
			});

			//events.emit('onBuildIngameUis');
        },
		onRezoneStart: function () {
			//Fired for mods to listen to
			// events.emit('rezoneStart');

			// events.emit('destroyAllObjects');
			// events.emit('resetRenderer');
			// events.emit('resetPhysics');
			// events.emit('clearUis');

			// client.request({
			// 	threadModule: 'rezoneManager',
			// 	method: 'clientAck',
			// 	data: {}
			// });
		},
		onGetMap: function ([msg]) {
			events.emit('onGetMap', msg);
			console.log('onGetMap')
			// client.request({
			// 	threadModule: 'instancer',
			// 	method: 'clientAck',
			// 	data: {}
			// });
		},
        onConnected: function (cb) {
			if (this.doneConnect)
				this.onDisconnect();
			else
				this.doneConnect = true;

			if (cb)
				cb();
		},
        onDisconnect: function () {
			window.location = window.location;
		},
        onHandshake: function () {
			events.emit('onHandshake');
			this.socket.emit('handshake');
		},
		request: function (msg) {
			this.socket.emit('request', msg, msg.callback);
		},
		processAction: {
			default: function (eventName, msgs) {
				msgs.forEach(m => events.emit(eventName, m));
			},

			rezoneStart: function (eventName, msgs) {
				// events.emit('rezoneStart');

				// events.emit('destroyAllObjects');
				// events.emit('resetRenderer');
				// events.emit('resetPhysics');
				// events.emit('clearUis');

				// client.request({
				// 	threadModule: 'rezoneManager',
				// 	method: 'clientAck',
				// 	data: {}
				// });
			},

			getMap: function (eventName, msgs) {
				events.emit('onBuildIngameUis');
				events.emit('onGetMap', msgs[0]);
			},

			onGetObject: function (eventName, msgs) {
				const prepend = msgs.filter(o => o.self);
				msgs.spliceWhere(o => prepend.some(p => p === o));
				msgs.unshift.apply(msgs, prepend);

				this.processAction.default(eventName, msgs);
			}
		},

		onEvent: function ({ event: eventName, data: eventData }) {
			const handler = this.processAction[eventName] || this.processAction.default;

			handler(eventName, [eventData]);
		},

		onEvents: function (response) {
			for (let eventName in response) {
				const eventMsgs = response[eventName];

				const handler = this.processAction[eventName] || this.processAction.default;

				handler(eventName, eventMsgs);
			}
		}
    }
})