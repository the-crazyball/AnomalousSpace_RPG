const events = require('../../misc/events');
//const profanities = require('../../misc/profanities');
//const canChat = require('./canChat');

const sendRegularMessage = async ({ obj }, msg) => {
	const charname = obj.auth.charname;

	const msgEvent = {
		username: obj.account,
		tagPrefix: null,
		tagSuffix: null,
		tags: [],
		emojiTag: null,
		namePrefix: '',
		nameSuffix: '',
		msgStyle: null,
		obj
	};

	await events.emit('onBeforeGetChatStyles', msgEvent);

	const { emojiTag } = msgEvent;

	let usePrefix = '';
	if (emojiTag) {
		const imgX = (-emojiTag.sprite[0] * emojiTag.spriteSize);
		const imgY = (-emojiTag.sprite[1] * emojiTag.spriteSize);
		const backgroundPosition = `${imgX}px ${imgY}px`;

		usePrefix = `<div class='emojiTag' style='background: url("${emojiTag.spritesheet}")  no-repeat scroll ${backgroundPosition} / auto;'></div>`;
	} else if (msgEvent.tags.length > 0)
		usePrefix = `${msgEvent.tagPrefix}${msgEvent.tags.join(' ')}${msgEvent.tagSuffix} `;

	let useCharName = charname;
	if (msgEvent.namePrefix)
		useCharName = `${msgEvent.namePrefix}${useCharName}`;
	if (msgEvent.nameSuffix)
		useCharName = `${useCharName}${msgEvent.nameSuffix}`;

	const finalMessage = `${usePrefix}${useCharName}: ${msg.data.message}`;

	const item = msg.data.item ? JSON.parse(JSON.stringify(msg.data.item).replace(/(<([^>]+)>)/ig, '')) : undefined;

	const eventMsg = {
		event: 'onGetMessages',
		data: {
			messages: [{
				class: msgEvent.msgStyle ?? 'color-grayB',
				message: finalMessage,
				item,
				type: 'chat',
				source: obj.name
			}]
		}
	};

	cons.emit('event', eventMsg);
};

const sendPartyMessage = ({ party, obj }, msg) => {
	if (!party) {
		obj.socket.emit('events', {
			onGetMessages: [{
				messages: [{
					class: 'color-redA',
					message: 'you are not in a party',
					type: 'info'
				}]
			}]
		});

		return;
	}

	let charname = obj.auth.charname;
	let message = msg.data.message;

	party.forEach(p => {
		let player = cons.players.find(c => c.id === p);

		player.socket.emit('events', {
			onGetMessages: [{
				messages: [{
					class: 'color-tealC',
					message: '(party: ' + charname + '): ' + message,
					type: 'chat',
					source: obj.name
				}]
			}]
		});
	});
};

const sendCustomChannelMessage = (cpnSocial, msg) => {
	const { obj } = cpnSocial;

	const { data: { message, subType: channel } } = msg;

	if (!channel)
		return;

	if (!cpnSocial.isInChannel(obj, channel)) {
		obj.socket.emit('events', {
			onGetMessages: [{
				messages: [{
					class: 'color-redA',
					message: 'You are not currently in that channel',
					type: 'info'
				}]
			}]
		});
		return;
	}

	const sendMessage = `[${channel}] ${obj.auth.charname}: ${message}`;
	const eventData = {
		onGetMessages: [{
			messages: [{
				class: 'color-grayB',
				message: sendMessage,
				type: 'chat',
				subType: 'custom',
				channel: channel.trim(),
				source: obj.name
			}]
		}]
	};

	cons.players.forEach(p => {
		if (!cpnSocial.isInChannel(p, channel))
			return;

		p.socket.emit('events', eventData);
	});
};

const sendPrivateMessage = ({ obj: { name: sourceName, socket } }, msg) => {
	const { data: { message, subType: targetName } } = msg;

	if (targetName === sourceName)
		return;

	let target = cons.players.find(p => p.name === targetName);
	if (!target)
		return;

	socket.emit('event', {
		event: 'onGetMessages',
		data: {
			messages: [{
				class: 'color-yellowB',
				message: '(you to ' + targetName + '): ' + message,
				type: 'chat',
				subType: 'privateOut',
				target: targetName
			}]
		}
	});

	target.socket.emit('event', {
		event: 'onGetMessages',
		data: {
			messages: [{
				class: 'color-yellowB',
				message: '(' + sourceName + ' to you): ' + message,
				type: 'chat',
				subType: 'privateIn',
				source: sourceName
			}]
		}
	});
};

const sendErrorMsg = (cpnSocial, msgString) => {
	cpnSocial.sendMessage(msgString, 'color-redA');
};

module.exports = async (cpnSocial, msg) => {
	const { data: msgData } = msg;

	if (!msgData.message)
		return;

	const { obj, maxChatLength, messageHistory } = cpnSocial;
	const sendError = sendErrorMsg.bind(null, cpnSocial);

	msgData.message = msgData.message
		.split('<')
		.join('&lt;')
		.split('>')
		.join('&gt;');

	if (!msgData.message)
		return;

	if (msgData.message.trim() === '')
		return;

	let messageString = msgData.message;
	if (messageString.length > maxChatLength)
		return;

	let time = +new Date();
	messageHistory.spliceWhere(h => ((time - h.time) > 5000));

	if (messageHistory.length) {
		if (messageHistory[messageHistory.length - 1].msg === messageString) {
			sendError('You have already sent that message');

			return;
		} else if (messageHistory.length >= 3) {
			sendError('You are sending too many messages');

			return;
		}
	}

	cpnSocial.onBeforeChat(msgData);
	if (msgData.ignore)
		return;

	// if (!msgData.item && !profanities.isClean(messageString)) {
	// 	sendError('Profanities detected in message. Blocked.');

	// 	return;
	// }

	// if (!canChat(obj, time)) {
	// 	sendError('Your character needs to be played for at least 3 minutes or be at least level 3 to be able to send messages in chat.');

	// 	return;
	// }

	let msgEvent = {
		source: obj.auth.charname,
		sourceObj: obj,
		msg: messageString,
		type: msgData.type,
		subType: msgData.subType,
		ignore: false,
		error: null
	};
	events.emit('onBeforeSendMessage', msgEvent);

	if (msgEvent.ignore) {
		if (msgEvent.error)
			sendError(msgEvent.error);

		return;
	}

	messageHistory.push({
		msg: msgEvent.msg,
		time: time
	});

	const messageHandler = {
		global: sendRegularMessage,
		custom: sendCustomChannelMessage,
		direct: sendPrivateMessage,
		party: sendPartyMessage
	}[msgData.type];

	if (!messageHandler)
		return;

	await messageHandler(cpnSocial, msg);
};
