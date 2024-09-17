const mysql = require('mysql2')

// mySQL connection
const connection = mysql.createConnection({ 
    host: 'localhost',
    database: 'crypto_db',
    user: 'root',
    password: 'tiger',
    //port: 5432,
});

module.exports = connection;