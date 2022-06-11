const query = require("../connections/mysql");
const bcrypt = require('bcrypt')

cryptPass = function(password) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, function(err, salt) {
            if (err)
                return reject(err);
                bcrypt.hash(password, salt, function(err, hash) {
                    return resolve(hash);
                });
            });
        });
    };

comparePass = function(plainPass, hashedPass) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainPass, hashedPass, function(err, isPasswordMatch) {
            return err == null ?  resolve(isPasswordMatch) : reject(err);
        });
    });
};

checkDuplicate = function (input){
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

register = function (input){
    return new Promise((resolve, reject) => {
        query("INSERT INTO users (name, age, email, password, gender, city) VALUES" +
            " ('" + input.name + "','"+ input.age + "','" + input.email + "','" + input.password + "','" + input.gender
            + "','" + input.city + "')",
            function (error, success) {
                if (error) {
                    return reject(error);
                }
                return resolve(success);
            });
    });
};

getById = function (id) {
    return new Promise((resolve, reject) => {
        query("SELECT * FROM users WHERE user_id = " + id,
            function (error, success) {
                if(error){
                    return reject(error);
                }
                return resolve(success);
            });
    });
};

getByEmail = function (email){
    return new Promise((resolve, reject) => {
        query("SELECT * FROM users WHERE email = '" + email + "'" ,  (error, elements)=>{
            if(error){
                return reject(error);
            }
            return resolve(elements[0]);
        });
    });
};

module.exports = {
    getById,
    checkDuplicate,
    getByEmail,
    register,
    comparePass,
    cryptPass
}
