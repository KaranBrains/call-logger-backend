const router = require('express').Router();
const received = require('../controllers/received');

router.get('/received/get-by-user-id', received.getReceivedByUserId);


module.exports = {
  router: router,
  basePath: '/api'
};
