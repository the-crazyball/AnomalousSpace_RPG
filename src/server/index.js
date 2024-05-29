require("dotenv").config();

const db = require("./database/index");
const server = require("./server/index");

const startup = {
    init: function () {
        db.init(this.onDbReady.bind(this));        
    },
    onDbReady: async function () {
        await server.init();
    }
}

startup.init();