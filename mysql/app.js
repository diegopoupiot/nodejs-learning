require('babel-register')

const mysql = require('mysql2')
const {error} = require("../functions");

const db = mysql.createConnection({
    host: 'localhost',
    database: 'nodejs',
    user: 'user',
    password: 'password',
    ssl: {
        rejectUnauthorized: false,
    }
})

db.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err)
    } else {
        console.log('connected as id ' + db.threadId)

        db.query('SELECT * FROM members', (err, result) => {
            if (err) {
                console.error(err)
            } else {
                console.log(result[0].name)
            }
        })
    }
})