const moment = require('moment');
const packageJson = require('../../../package');

class HealthMonitor {
    constructor() {
        this.startTime = Date.now();
    }

    getStatus() {
        return {
            startTime: new Date(this.startTime).toISOString(),
            upTime: moment(this.startTime).fromNow(true),
            version: packageJson.version
        };
    }
}

module.exports = HealthMonitor;
