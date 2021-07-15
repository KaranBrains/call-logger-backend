const router = require('express').Router();
const outgoing = require('../controllers/outgoing');

router.get('/outgoing/get-by-user-id', outgoing.getOutgoingByUserId);


module.exports = {
  router: router,
  basePath: '/api'
};
