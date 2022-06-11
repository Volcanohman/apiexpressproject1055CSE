const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'ip_api_project_1055_cse'
});

function query (sql, callback){
    connection.query(sql, callback);
}

module.exports = query;

