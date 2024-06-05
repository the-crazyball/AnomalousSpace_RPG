module.exports = {
    version: process.env.AS_VERSION || '0.0.1',
    port: process.env.AS_PORT || 4000,

    nodeEnv: process.env.NODE_ENV,

    db: process.env.AS_DB || 'sqlite',
    dbHost: process.env.AS_DB_HOST || 'localhost',
    dbPort: process.env.AS_DB_PORT || 28015,
    dbName: process.env.AS_DB_NAME || 'AS_Production',
    dbUser: process.env.AS_DB_USER || 'user',
    dbPass: process.env.AS_DB_PASS || ''
}