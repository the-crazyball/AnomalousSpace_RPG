require("dotenv").config();

require('./globals');

const server = require('./server/index');
const components = require('./components/components');
const routerConfig = require('./security/routerConfig');




const startup = {
    init: function () {
        db.init(this.onDbReady.bind(this));
    },
    onDbReady: function () {
        routerConfig.init();
        components.init(this.onComponentsReady.bind(this));
    },
    onComponentsReady: async function() {
        await clientConfig.init();
        await server.init();
    }
}

startup.init();