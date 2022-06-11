const srvFollows = require('../services/srv_follows');
const srvAuth = require('../services/srv_auth');
const decoder = require("jwt-decode");
const srvPosts = require("../services/srv_posts");

addFollow = async function (req, res, next) {
    let followed = await srvAuth.getById(req.params.id);
    let tokenMail = decoder(req.headers['authorization']);
    let follower = await srvAuth.getByEmail(tokenMail.email);
    try{
        if(followed[0] && follower) {
            srvFollows.addFollow(follower.user_id, followed[0].user_id)
            res.status(202).json('successfully followed')
        } else {
            res.status(404).json({error: 'user not found'});
        }
    } catch (e) {
        res.status(500).json({error: e, message: 'internal server error'});
    }
};

removeFollow = async function (req, res, next) {
    let followed = await srvAuth.getById(req.params.id);
    let tokenMail = decoder(req.headers['authorization']);
    let follower = await srvAuth.getByEmail(tokenMail.email);
    try{
        if(followed[0] && follower) {
            srvFollows.removeFollow(follower.user_id, followed[0].user_id)
            res.status(202).json('successfully removed')
        } else {
            res.status(404).json({error: 'user not found'});
        }
    } catch (e) {
        res.status(500).json({error: e, message: 'internal server error'});
    }
};

generateFeed = async function (req, res, next) {
    let tokenMail = decoder(req.headers['authorization']);
    let follower = await srvAuth.getByEmail(tokenMail.email);
    let followedProfiles = await srvFollows.getFollows(follower.user_id);
    if (followedProfiles) {
        let result = []
        for (let i = 0; i < followedProfiles.length; i++) {
            let idS = await srvFollows.getFeedIds(followedProfiles[i].following_id);
            for (let j = 0; j < idS.length; j++) {
                let feed = await srvPosts.getPostById(idS[j].post_id)
                result.push(feed)
            }
        }
        res.json(result.reverse());
    } else
        res.status(404).json({error: 'user not found'});
}

module.exports = {
    addFollow,
    removeFollow,
    generateFeed
}