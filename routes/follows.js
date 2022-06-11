const express = require('express');
const router = express.Router();
const hlpJWT = require('../helpers/hlp_JWT');
const ctrFollows = require('../controllers/ctr_follows');

router.post('/add/:id', hlpJWT.authenticateToken,  ctrFollows.addFollow);

router.post('/remove/:id', hlpJWT.authenticateToken,  ctrFollows.removeFollow);

router.get('/feed', hlpJWT.authenticateToken,  ctrFollows.generateFeed);

module.exports = router;
