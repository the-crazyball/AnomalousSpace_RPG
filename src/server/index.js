require('dotenv').config();

require('./globals');

const server = require('./server/index');
const components = require('./components/components');
const skins = require('./config/skins');
const routerConfig = require('./security/routerConfig');
const profanities = require('./misc/profanities');

const startup = {
	init: function () {
		db.init(this.onDbReady.bind(this));
	},
	onDbReady: function () {
		routerConfig.init();
		profanities.init();
		components.init(this.onComponentsReady.bind(this));
	},
	onComponentsReady: async function () {
		skins.init();
		await clientConfig.init();
		await server.init();
		await leaderboard.init();
	}
};

startup.init();
