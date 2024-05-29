const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB).then(() => { 
    console.log('db connected')
}).catch((err) => {
    console.error("Unable to connect to the Mongodb database. Error:"+err, "error");
});

module.exports = {
    init: function () {

        this.cache = {};
        this.cache.users = new Map();

        this.userModel = require("./models/user");

    }
}