const express = require('express');
const router = express.Router();
const hlpJWT = require('../helpers/hlp_JWT');
const ctrProfile = require('../controllers/ctr_profile');

router.post('/', (req, res) => {
    res.redirect(307, '/api/auth/register');
});

router.delete('/:id', hlpJWT.authenticateToken,  ctrProfile.remove);

router.get('/:id', hlpJWT.authenticateToken,  ctrProfile.showSpecific);

router.get('/', hlpJWT.authenticateToken,  ctrProfile.showAll);

router.put('/:id', hlpJWT.authenticateToken,  ctrProfile.updateInfo);

module.exports = router;
