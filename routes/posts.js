const express = require('express');
const router = express.Router();
const hlpJWT = require('../helpers/hlp_JWT');
const ctrPosts = require('../controllers/ctr_posts');
const multer  = require('multer');
const storage = multer.diskStorage({ destination: function (req, file, cb) { cb(null, './static')},
    filename: function (req, file, cb){ cb(null, new Date().toISOString().replace(/[\/\\:]/g, "_")
        + file.originalname);}});
const fileFilter = (req,file,cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif' || file.mimetype === 'video/mp4') {
        cb(null, true);
    } else {
        cb(new Error('forbidden file type in upload, upload in jpeg/png/gif/mp4 format'), false);
    }
};
const upload = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1024 * 50
    },
    fileFilter: fileFilter
});

router.post('/', hlpJWT.authenticateToken, upload.single('media'), ctrPosts.add);

router.delete('/:id', hlpJWT.authenticateToken,  ctrPosts.remove);

router.get('/:id', hlpJWT.authenticateToken,  ctrPosts.showSpecific);

router.get('/', (req, res) => {
    res.redirect(307, '/api/follows/');
});

router.put('/:id', (req, res) => {
    res.status(403).json('Post editing is forbidden')
});


module.exports = router;
