const router = require('express').Router();
const cancelled = require('../controllers/cancelled');

router.post('/cancelled/add', cancelled.addCancelled);
router.get('/cancelled/get-by-user-id', cancelled.getCancelledByUserId);

module.exports = {
  router: router,
  basePath: '/api'
};
