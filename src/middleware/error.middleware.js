function errorMiddleware(error, req, res, next) {
    if (error && error.message === 'validation error') {
        res.status(400).json(error.errors);
    } else {
        try {
            const errorNew = JSON.parse(error.message);
            if (errorNew.message && errorNew.message.error) {
                error.message = errorNew.message;
            }
        } catch (e) {}
        const status = error.status || 500;
        const responseBody = {
            message: error.message || 'Something went wrong'
        };
        res.status(status).send(responseBody);
    }
}

module.exports = errorMiddleware;
