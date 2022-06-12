const srvPosts = require('../services/srv_posts');
const srvAuth = require("../services/srv_auth");
const decoder = require("jwt-decode");

showSpecific = async function (req, res, next) {
    let post = await srvPosts.getPostById(req.params.id);
    if (post) {
        res.json(post);
    }
    else {
        res.status(404);
        res.json({error: 'post not found'});
    }
};

add = async function (req, res, next){
    const file = req.file;
    if (!file) {
        res.status(404);
        res.json({error: 'no file attached'});
    }
    let tokenMail = decoder(req.headers['authorization']);
    let user = await srvAuth.getByEmail(tokenMail.email);
    let input = {
        media:  file.filename,
        caption: req.body.caption
    }
    try{
    srvPosts.storePostID(user.user_id)
    srvPosts.storePost(input)
    res.status(202).json(input);
    } catch (e) {
        res.status(500).json({error: e, message: 'internal server error'});
    }
};

remove = async function (req, res, next){
    let paramId = await srvPosts.getPostById(req.params.id);
    if (paramId){
        let tokenMail = decoder(req.headers['authorization']);
        let currentUser = await srvAuth.getByEmail(tokenMail.email)
        let originalUser = await srvPosts.getUserByPost(paramId.post_id)
        if ((currentUser.user_id !== originalUser.user_id)) {
            res.status(403)
            res.json('error: user can only delete his own posts')
        } else {
            try {
                srvPosts.removeFile(paramId.media);
                await srvPosts.removePost(originalUser.post_id);
                await srvPosts.removeUsersPosts(originalUser.post_id);
                res.status(202).json("post was successfully deleted");
            } catch (e) {
                res.status(500).json({error: e, message: 'internal server error'});
            }
        }
    } else {
        res.status(404);
        res.json({error: 'post not found'});
    }
}

module.exports = {
    showSpecific,
    add,
    remove
}