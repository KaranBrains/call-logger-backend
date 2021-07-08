const router = require('express').Router();
const admin = require('../controllers/admin');

router.get('/admin/get-users', admin.getUsers);

module.exports = {
  router: router,
  basePath: '/api'
};
