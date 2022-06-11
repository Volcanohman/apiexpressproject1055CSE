const query = require('../connections/mysql')
const fs = require('fs')

getUserPostsID = function(user_id) {
    return new Promise((resolve, reject) => {
        query('SELECT * FROM users_posts WHERE user_id = ' + user_id,  (error, elements)=>{
            if(error){
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

getPostById = function(id) {
    return new Promise((resolve, reject) => {
        query('SELECT * FROM posts WHERE post_id = ' + id ,  (error, elements)=>{
            if(error){
                return reject(error);
            }
            return resolve(elements[0]);
        });
    });
};

getUserByPost = function(id) {
    return new Promise((resolve, reject) => {
        query('SELECT * FROM users_posts WHERE post_id = ' + id ,  (error, elements)=>{
            if(error){
                return reject(error);
            }
            return resolve(elements[0]);
        });
    });
};

storePost = function (input) {
    return new Promise((resolve, reject) => {
        query('INSERT INTO `posts` (`media`, `caption`) VALUES (?)',
            [[
            input.media,
            input.caption
        ]], function (error, elements) {
            if(error){
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

storePostID = function (id) {
    return new Promise((resolve, reject) => {
        query("INSERT INTO users_posts (user_id) VALUES (" + id + ")",
            (error, elements) => {
                if(error){
                    return reject(error);
                }
                return resolve(elements[0]);
            });
    });
};

removePost = function (id){
    return new Promise((resolve, reject) => {
        query("DELETE FROM posts WHERE post_id = '" + id + "'",
            function (error, success) {
                if (error) {
                    return reject(error);
                }
                return resolve(success);
            });
    });
};

removeUsersPosts = function (id){
    return new Promise((resolve, reject) => {
        query("DELETE FROM users_posts WHERE post_id = '" + id + "'",
            function (error, success) {
                if (error) {
                    return reject(error);
                }
                return resolve(success);
            });
    });
};

removeFile = function (mediaPath) {
    const path = "./static/" + mediaPath;
    fs.unlink(path, (err) => {
        if (err) {
            console.error(err)
        }
    })
};

module.exports = {
    getUserPostsID,
    getPostById,
    getUserByPost,
    storePost,
    storePostID,
    removePost,
    removeUsersPosts,
    removeFile
}