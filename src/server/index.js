require("dotenv").config();

const db = require("./database/index");

const startup = {
    init: function () {
        db.init();        
    }
}

startup.init();