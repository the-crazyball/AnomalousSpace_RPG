//Imports
const bcrypt = require('bcrypt-nodejs');
const messages = require('../misc/messages');
const skins = require('../config/skins');
const profanities = require('../misc/profanities');
//const fixes = require('../fixes/fixes');
const spirits = require('../config/spirits');
//const ga = require('../security/ga');
const eventEmitter = require('../misc/events');

//const checkLoginRewards = require('./auth/checkLoginRewards');

//This section of code is in charge of ensuring that we only ever create one account at a time,
// since we don't have a read/write lock on the characters table, we have to address it in code
const createLockBuffer = [];
const getCreateLock = async () => {
	const releaseLock = lockEntry => {
		createLockBuffer.spliceWhere(c => c === lockEntry);

		const nextEntry = createLockBuffer[0];

		if (!nextEntry)
			return;

		nextEntry.takeLock();
	};

	const promise = new Promise(async res => {
		let lockEntry = {};
		lockEntry.takeLock = res.bind(null, releaseLock.bind(null, lockEntry));

		if (!createLockBuffer.length) {
			createLockBuffer.push(lockEntry);

			lockEntry.takeLock();

			return;
		}

		createLockBuffer.push(lockEntry);
	});

	return promise;
};

//Component Definition
module.exports = {
	type: 'auth',

	username: null,
	charname: null,
	characters: {},
	characterList: [],
	stash: null,
	accountInfo: null,

	customChannels: [],

	play: async function (data) {
		if (!this.username || this.charname)
			return;

		let character = this.characters[data.data.name];
		if (!character)
			return;
		else if (character.permadead)
			return;

		character.stash = this.stash;
		character.account = this.username;

		this.charname = character.name;

		//checkLoginRewards(this, data, character, this.onSendRewards.bind(this, data, character));
		this.onSendRewards(data, character);
		cons.modifyPlayerCount(1);
	},

	onSendRewards: async function (data, character) {
		await db.setAsync({
			key: this.username,
			table: 'accountInfo',
			value: this.accountInfo,
			serialize: true
		});

		this.obj.player.sessionStart = +new Date();
		this.obj.player.spawn(character, data.callback);

		let prophecies = this.obj.prophecies ? this.obj.prophecies.simplify().list : [];
		await leaderboard.setLevel(character.name, this.obj.stats.values.level, prophecies);
	},

	doSave: async function (callback) {
		const simple = this.obj.getSimple(true, true);
		delete simple.destroyed;
		delete simple.forceDestroy;

		simple.components.spliceWhere(f => (f.type === 'stash'));

		await db.setAsync({
			key: this.charname,
			table: 'character',
			value: simple,
			clean: true,
			serialize: true
		});

		await this.doSaveStash();

		if (callback)
			callback();
	},

	//This function is called from the 'forceSave' command. Because of this, the first argument is the action data
	// instead of (callback, saveStash)
	doSaveManual: async function (msg) {
		await this.doSave();

		process.send({
			module: 'atlas',
			method: 'resolveCallback',
			msg: {
				id: msg.callbackId
			}
		});
	},

	doSaveStash: async function () {
		const { username, obj: { stash } } = this;

		if (!stash.changed)
			return;

		await db.setAsync({
			key: username,
			table: 'stash',
			value: stash.serialize(),
			clean: true,
			serialize: true
		});
	},

	simplify: function (self) {
		if (!self)
			return;
		
		return {
			type: 'auth',
			username: this.username,
			charname: this.charname,
			accountInfo: this.accountInfo
		};
	},

	getCharacterList: async function (data) {
		if (!this.username)
			return;

		this.characterList = await db.getAsync({
			key: this.username,
			table: 'characterList',
			isArray: true
		});

		let res = this.characterList.map(c => ({
			name: c.name ? c.name : c,
			level: leaderboard.getLevel(c.name ? c.name : c)
		}));

		data.callback(res);
	},

	getCharacter: async function (data) {
		let charName = data.data.name;
		if (!this.characterList.some(c => (c.name === charName || c === charName)))
			return;

		let character = await db.getAsync({
			key: charName,
			table: 'character',
			clean: true
		});

		await eventEmitter.emit('onAfterGetCharacter', {
			obj: this.obj,
			character
		});

		//fixes.fixCharacter(character);

		character.cell = skins.getCell(character.skinId);
		character.sheetName = skins.getSpritesheet(character.skinId);

		this.characters[charName] = character;

		await this.getCustomChannels(character);

		await this.verifySkin(character);

		data.callback(character);
	},

	getCustomChannels: async function (character) {
		this.customChannels = await db.getAsync({
			key: character.name,
			table: 'customChannels',
			isArray: true
		});

		let social = character.components.find(c => (c.type === 'social'));
		//this.customChannels = fixes.fixCustomChannels(this.customChannels);
		if (social)
			social.customChannels = this.customChannels;
	},

	verifySkin: async function (character) {
		const doesOwn = await this.doesOwnSkin(character.skinId);

		if (doesOwn)
			return;

		const defaultTo = 'wizard';

		character.skinId = defaultTo;
		character.cell = skins.getCell(defaultTo);
		character.sheetName = skins.getSpritesheet(defaultTo);
	},

	doesOwnSkin: async function (skinId) {
		const allSkins = skins.getList();
		const filteredSkins = allSkins.filter(({ default: isDefaultSkin }) => isDefaultSkin);

		const msgSkinList = {
			obj: this,
			allSkins,
			filteredSkins
		};

		await eventEmitter.emit('onBeforeGetAccountSkins', msgSkinList);

		const result = filteredSkins.some(f => f.id === skinId);

		return result;
	},

	getSkinList: async function ({ callback }) {
		const allSkins = skins.getList();
		const filteredSkins = allSkins.filter(({ default: isDefaultSkin }) => isDefaultSkin);

		const msgSkinList = {
			obj: this,
			allSkins,
			filteredSkins
		};

		await eventEmitter.emit('onBeforeGetAccountSkins', msgSkinList);

		callback(filteredSkins);
	},

	login: async function (msg) {
		let credentials = msg.data;

		if (credentials.username === '' || credentials.password === '') {
			msg.callback(messages.login.allFields);

			return;
		} else if (credentials.username.length > 32) {
			msg.callback(messages.login.maxUsernameLength);

			return;
		}

		let storedPassword = await db.getAsync({
			key: credentials.username,
			table: 'login',
			noParse: true
		});

		bcrypt.compare(credentials.password, storedPassword, this.onLogin.bind(this, msg, storedPassword));
	},

	onLogin: async function (msg, storedPassword, err, compareResult) {
		const { data: { username } } = msg;

		if (!compareResult) {
			msg.callback(messages.login.incorrect);
			return;
		}

		const emBeforeLogin = {
			obj: this.obj,
			success: true,
			msg: null,
			username
		};
		await eventEmitter.emit('onBeforeLogin', emBeforeLogin);
		if (!emBeforeLogin.success) {
			msg.callback(emBeforeLogin.msg);

			return;
		}
		
		this.username = username;
		await cons.logOut(this.obj);

		//this.initTracker();

		const accountInfo = await db.getAsync({
			key: username,
			table: 'accountInfo',
			noDefault: true
		}) || {
			loginStreak: 0,
			level: 0
		};

		const msgAccountInfo = {
			username,
			accountInfo
		};

		await eventEmitter.emit('onBeforeGetAccountInfo', msgAccountInfo);

		await eventEmitter.emit('onAfterLogin', { username });

		this.accountInfo = msgAccountInfo.accountInfo;

		msg.callback();
	},

	initTracker: function () {
		this.gaTracker = ga.connect(this.username);
	},

	track: function (category, action, label, value = 1) {
		process.send({
			method: 'track',
			serverId: this.obj.serverId,
			obj: {
				category,
				action,
				label,
				value
			}
		});
	},

	register: async function (msg) {
		let credentials = msg.data;

		if (credentials.username === '' || credentials.password === '') {
			msg.callback(messages.login.allFields);

			return;
		} else if (credentials.username.length > 32) {
			msg.callback(messages.login.maxUsernameLength);

			return;
		}

		let illegal = ["'", '"', '/', '\\', '(', ')', '[', ']', '{', '}', ':', ';', '<', '>', '+', '?', '*'];
		for (let i = 0; i < illegal.length; i++) {
			if (credentials.username.indexOf(illegal[i]) > -1) {
				msg.callback(messages.login.illegal);
				return;
			}
		}

		const emBeforeRegisterAccount = {
			obj: this.obj,
			success: true,
			msg: null,
			username: msg.data.username
		};

		await eventEmitter.emit('onBeforeRegisterAccount', emBeforeRegisterAccount);

		if (!emBeforeRegisterAccount.success) {
			msg.callback(emBeforeRegisterAccount.msg);

			return;
		}

		let exists = await db.getAsync({
			key: credentials.username,
			ignoreCase: true,
			table: 'login',
			noDefault: true,
			noParse: true
		});

		if (exists) {
			msg.callback(messages.login.exists);

			return;
		}

		bcrypt.hash(credentials.password, null, null, this.onHashGenerated.bind(this, msg));
	},

	onHashGenerated: async function (msg, err, hashedPassword) {
		await db.setAsync({
			key: msg.data.username,
			table: 'login',
			value: hashedPassword
		});

		this.accountInfo = {
			loginStreak: 0,
			level: 0
		};

		await db.setAsync({
			key: msg.data.username,
			table: 'characterList',
			value: [],
			serialize: true
		});

		this.username = msg.data.username;
		cons.logOut(this.obj);

		msg.callback();
	},

	createCharacter: async function (msg) {
		let data = msg.data;
		let name = data.name;

		let error = null;

		if (name.length < 3 || name.length > 12)
			error = messages.createCharacter.nameLength;
		else if (!profanities.isClean(name))
			error = messages.login.invalid;
		else if (name.indexOf('  ') > -1)
			msg.callback(messages.login.invalid);
		else if (!spirits.list.includes(data.class))
			return;

		let nLen = name.length;
		for (let i = 0; i < nLen; i++) {
			let char = name[i].toLowerCase();
			let valid = [
				'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
			];

			if (!valid.includes(char)) {
				error = messages.login.invalid;
				break;
			}
		}

		if (error) {
			msg.callback(error);
			return;
		}

		const releaseCreateLock = await getCreateLock();

		let exists = await db.getAsync({
			key: name,
			ignoreCase: true,
			table: 'character',
			noDefault: true
		});

		if (exists) {
			releaseCreateLock();
			msg.callback(messages.login.charExists);

			return;
		}

		let obj = this.obj;

		extend(obj, {
			name: name,
			skinId: data.skinId,
			class: data.class,
			cell: skins.getCell(data.skinId),
			sheetName: skins.getSpritesheet(data.skinId),
			x: null,
			y: null
		});
		
		let simple = this.obj.getSimple(true);

		await this.verifySkin(simple);
		
		let prophecies = (data.prophecies || []).filter(p => p);
		
		simple.components.push({
			type: 'prophecies',
			list: prophecies
		}, {
			type: 'social',
			customChannels: this.customChannels
		});

		const eBeforeSaveCharacter = {
			obj: simple,
			config: data
		};

		eventEmitter.emit('beforeSaveCharacter', eBeforeSaveCharacter);

		await db.setAsync({
			key: name,
			table: 'character',
			value: eBeforeSaveCharacter.obj,
			serialize: true
		});

		this.characters[name] = simple;
		this.characterList.push(name);
		
		await db.setAsync({
			key: this.username,
			table: 'characterList',
			value: this.characterList,
			serialize: true
		});
		
		releaseCreateLock();

		//this.initTracker();

		this.play({
			data: {
				name: name
			},
			callback: msg.callback
		});
	},

	deleteCharacter: async function (msg) {
		let data = msg.data;

		if ((!data.name) || (!this.username))
			return;

		if (!this.characterList.some(c => ((c.name === data.name) || (c === data.name)))) {
			msg.callback([]);
			return;
		}

		const msgBeforeDeleteCharacter = {
			obj: this,
			name: data.name,
			success: true,
			msg: null
		};

		await eventEmitter.emit('beforeDeleteCharacter', msgBeforeDeleteCharacter);

		if (!msgBeforeDeleteCharacter.success) {
			msg.callback({
				success: false,
				msg: msgBeforeDeleteCharacter.msg
			});

			return;
		}

		await db.deleteAsync({
			key: data.name,
			table: 'character'
		});

		let name = data.name;

		this.characterList.spliceWhere(c => (c.name === name || c === name));
		let characterList = this.characterList
			.map(c => ({
				name: c.name ? c.name : c,
				level: leaderboard.getLevel(c.name ? c.name : c)
			}));

		await db.setAsync({
			key: this.username,
			table: 'characterList',
			value: characterList,
			serialize: true
		});

		await leaderboard.deleteCharacter(name);

		let result = this.characterList
			.map(c => ({
				name: c.name ? c.name : c,
				level: leaderboard.getLevel(c.name ? c.name : c)
			}));

		msg.callback({
			success: true,
			characterList: result
		});
	},

	permadie: function () {
		this.obj.permadead = true;
		this.doSave(this.onPermadie.bind(this));
	},

	onPermadie: function () {
		process.send({
			method: 'object',
			serverId: this.obj.serverId,
			obj: {
				dead: true
			}
		});
	},

	getAccountLevel: function () {
		return this.accountInfo.level;
	}
};
