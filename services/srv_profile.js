const query = require('../connections/mysql')

showSpecific = function (id){
    return new Promise((resolve, reject) => {
        query('SELECT * FROM users WHERE user_id = ' + id,
            function (error, success) {
                if (error) {
                    return reject(error);
                }
                return resolve(success);
            });
    });
};

getPortion = function (offset, limit) {
    return new Promise((resolve, reject) => {
        query('SELECT * FROM users LIMIT ' + limit + ' OFFSET ' + offset,  (error, elements)=>{
            if(error){
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

getCount = function () {
    return new Promise((resolve, reject) => {
        query('SELECT COUNT(*) FROM users',  (error, elements)=>{
            if(error){
                return reject(error);
            }
            return resolve(elements[0]);
        });
    });
};

updateProfile = function (input) {
    query(
        'UPDATE users SET ? WHERE ?',
        [
            {
                name: input.name,
                age: input.age,
                password: input.password,
                gender: input.gender,
                city: input.city,
            },
            { email: input.email }
        ] ,
    )
};

checkExisting = function (input){
    return new Promise((resolve, reject) => {
        query("SELECT * FROM users WHERE email = '" + input.email + "'",
            function (error, success) {
                if (error) {
                    return reject(error);
                }
                return resolve(success);
            });
    });
};

remove = function (input){
    return new Promise((resolve, reject) => {
        query("DELETE FROM users WHERE email = '" + input.email + "'",
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
        query("DELETE FROM users_posts WHERE user_id = '" + id + "'",
            function (error, success) {
                if (error) {
                    return reject(error);
                }
                return resolve(success);
            });
    });
};

module.exports = {
    showSpecific,
    getPortion,
    getCount,
    updateProfile,
    checkExisting,
    remove,
    removeUsersPosts
}