const router = require('express').Router();
const routes = [
    'auth',
    'admin',
    'cancelled',
    'missed',
    'received',
    'outgoing'
];

module.exports = {
    init: function() {
        routes.forEach(route => {
            const defination = require(`./${route}`);
            router.use(defination.basePath, defination.router)
        });
        return router;
    }
}