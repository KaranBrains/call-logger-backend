const router = require('express').Router();
const missed = require('../controllers/missed');

router.post('/missed/add', missed.addMissed);
router.get('/missed/get-by-user-id', missed.getMissedByUserId);

module.exports = {
  router: router,
  basePath: '/api'
};
