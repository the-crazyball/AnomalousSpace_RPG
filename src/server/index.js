require("dotenv").config();

//const db = require("./database/index");
//const server = require("./server/index");

const app = {};

const startup = {
    init: async () => {
        app.db = require("./database/index")(app);
        app.db.init(async () => {
            app.connections = require("./security/connections")(app);
            app.server = require("./server/index")(app);
            app._ = require("./misc/helpers");
            
            await app.server.init();
        })
    }
}

startup.init();