const query = require("../connections/mysql");

addFollow = async function (id_1, id_2){
    return new Promise((resolve, reject) => {
        query('INSERT INTO `follows` (`follower_id`, `following_id`) VALUES (?)',
            [[
                id_1,
                id_2
            ]], function (error, elements) {
                if(error){
                    return reject(error);
                }
                return resolve(elements);
            });
    });
};

removeFollow = async function (id_1, id_2){
    return new Promise((resolve, reject) => {
        query('DELETE FROM `follows` WHERE follower_id = ? AND following_id = ?',
            [id_1,id_2],
            function (error, elements) {
                if(error){
                    return reject(error);
                }
                return resolve(elements);
            });
    });
};

getFollows = async function (id){
    return new Promise((resolve, reject) => {
        query('SELECT * FROM follows WHERE follower_id = ' + id ,  (error, elements)=>{
            if(error){
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

getFeedIds = async function (id){
    return new Promise((resolve, reject) => {
        query('SELECT * FROM users_posts WHERE user_id = ' + id ,  (error, elements)=>{
            if(error){
                return reject(error);
            }
            return resolve(elements);
        });
    });
}

generateFeed = async function (id){
    return new Promise((resolve, reject) => {
        query('SELECT * FROM users_posts WHERE user_id = ' + id ,  (error, elements)=>{
            if(error){
                return reject(error);
            }
            return resolve(elements);
        });
    });
}

module.exports = {
    addFollow,
    removeFollow,
    getFollows,
    getFeedIds,
}
