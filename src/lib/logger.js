const { createLogger, format, transports } = require('winston');

const { combine, timestamp, label, prettyPrint } = format;
const config = require('../configs/config');

const createTransports = (applicationLogging) => {
    const customTransports = [];

    if (applicationLogging.file) {
        customTransports.push(
            new transports.File({
                filename: applicationLogging.file,
                level: applicationLogging.level
            })
        );
    }

    if (applicationLogging.console) {
        customTransports.push(
            new transports.Console({
                level: applicationLogging.level
            })
        );
    }

    return customTransports;
};

const logger = createLogger({
    format: combine(label({ label: config.app.name }), timestamp(), prettyPrint()),
    transports: createTransports(config.application_logging)
});

module.exports = logger;
