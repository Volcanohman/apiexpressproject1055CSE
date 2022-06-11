const express = require('express');
const router = express.Router();
const ctrAuth = require('../controllers/ctr_auth');

router.post('/login', ctrAuth.login);
router.post('/register', ctrAuth.register);

module.exports = router;
