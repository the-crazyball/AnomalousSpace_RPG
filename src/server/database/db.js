let serverConfig = require('../config/serverConfig');

const mappings = {
	sqlite: './dbSqlite',
	rethink: './dbRethink',
    mongo: './dbMongo'
};

module.exports = require(mappings[serverConfig.db]);
