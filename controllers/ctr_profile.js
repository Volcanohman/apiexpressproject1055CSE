const srvProfile = require('../services/srv_profile')
const srvPosts = require('../services/srv_posts');
const srvAuth = require("../services/srv_auth");
const {prepareUser} = require("./ctr_auth");
const decoder = require("jwt-decode");

prepareSingleProfile = async function(user){
    let posts = [];
    let postIds = await srvPosts.getUserPostsID(user[0].user_id);
    for(let j = 0; j < postIds.length; j++){
        let post = await srvPosts.getPostById(postIds[j].post_id);
        posts.push(post);
    }
    user[0].posts = posts;
    return user;
}

showSpecific = async function (req, res, next) {
    let user = await srvProfile.showSpecific(req.params.id);
    if (user.length) {
        res.json(await prepareSingleProfile(user));
    }
    else {
        res.status(404);
        res.json({error: 'user not found'});
    }
};

updateInfo = async function (req,res,next) {
    let paramId = await srvAuth.getById(req.params.id);
    if (paramId.length) {
        let tokenMail = decoder(req.headers['authorization']);
        if ((req.body.email !== tokenMail.email) || (req.body.email !== paramId[0].email)) {
            res.status(403)
            res.json('error: user can only update his own profile')
            return;
        } else {
            try {
                let password = await srvAuth.cryptPass(req.body.password);
                let input = {
                    name: req.body.name,
                    age: req.body.age,
                    city: req.body.city,
                    gender: req.body.gender,
                    email: req.body.email,
                    password,
                }
                await srvProfile.updateProfile(input)
                res.status(202).json(prepareUser(input))
                return;
            } catch (e) {
                res.status(500).json({error: e, message: 'internal server error'});
            }
        }
    }
    res.status(404);
    res.json({error: 'user not found'});
}

showAll = async function(req, res, next) {
    let page = parseInt(req.query.page);
    if(!page || page<0) page = 1;
    const limit = 5;
    let offset = (page - 1) * limit;
    let profiles = await srvProfile.getPortion(offset, limit);
    let profilePosts = await prepareSingleProfile(profiles);
    let count = await srvProfile.getCount();
    let result = {
        data: profilePosts,
        current_page: page,
        total_pages: Math.ceil(count['COUNT(*)'] / limit)
    };
    res.json(result);
}

remove = async function (req,res,next) {
    let paramId = await srvAuth.getById(req.params.id)
    if (paramId.length){
        let tokenMail = decoder(req.headers['authorization']);
        let input = {
            email: tokenMail.email
        }
        if ((paramId[0].email !== tokenMail.email)) {
            res.status(403)
            res.json('error: user can only delete his own profile')
        } else {
            let postIds = await srvPosts.getUserPostsID(req.params.id)

            try {
                for (let i = 0; i < postIds.length; i++){
                    let posts = await srvPosts.getPostById(postIds[i].post_id)
                    await srvPosts.removeFile(posts.media);
                    await srvPosts.removePost(postIds[i].post_id)
                }
                await srvProfile.removeUsersPosts(req.params.id);
                await srvProfile.remove(input);
                res.status(202).json("profile was successfully deleted");
            } catch (e) {
                res.status(500).json({error: e, message: 'internal server error'});
            }
        }
    } else {
        res.status(404);
        res.json({error: 'user not found'});
    }
}

module.exports = {
    prepareSingleProfile,
    showSpecific,
    updateInfo,
    showAll,
    remove
}