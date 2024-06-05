const mongoose = require("mongoose");



module.exports = {
    init: function (cb) {
        mongoose.connect(process.env.MONGODB).then(() => { 
            console.log('db connected')
            this.onDbConnect(cb);
        }).catch((err) => {
            console.error("Unable to connect to the Mongodb database. Error:"+err, "error");
        });
    },
    onDbConnect: function (cb) {
        this.cache = {};
        this.cache.users = new Map();
        
        this.userModel = require("./models/user");
        
        cb();
    }
}