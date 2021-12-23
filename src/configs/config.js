module.exports = {
    app: {
        environment: process.env['APPLICATION_ENV'] || '',
        logpath: process.env['LOG_PATH'] || '',
        name: process.env['APP_NAME'] || 'node-boilerplate',
        port: parseInt(process.env['APP_PORT'], 10) || 8000
    },
    application_logging: {
        console: process.env['LOG_ENABLE_CONSOLE'] !== 'false',
        file: process.env['LOG_PATH'],
        level: process.env['LOG_LEVEL'] || 'info'
    },
    mongo: {
        host: process.env['DB_HOST'],
        name: process.env['DB_DATABASE'],
        password: process.env['DB_PASSWORD'],
        port: parseInt(process.env['DB_PORT'], 10),
        user: process.env['DB_USER']
    },
    jwt: {
        userSecret: 'issahalabi',
        tokenLifeTime: 60 * 60 * 100
    },
    contentType: 'application/x-www-form-urlencoded',
    signUpFlow: 'link',
    nodeENV: process.env['NODE_ENV']
};
