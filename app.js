require('babel-register')
const {success, error} = require('./assets/functions')
const express = require('express')
const app = express()
const morgan = require('morgan')('dev')
const bodyParser = require('body-parser')
const config = require('./assets/config')
const mysql = require("mysql2/promise");

const db = mysql.createConnection({
    host: config.db.host,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password,
    ssl: {
        rejectUnauthorized: false,
    },
}).then((db) => {
    console.log('connected as id ' + db.threadId)

    let MembersRouter = express.Router()
    let Members = require('./assets/classes/members-class')(db, config)

    console.log(Members.getConfig())

    app.use(morgan)
    app.use(bodyParser.json()) // for parsing application/json
    app.use(bodyParser.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded

    MembersRouter.route('/:id')

        // Recupère un membre par son id
        .get((req, res) => {

            db.query('SELECT * FROM members WHERE id = ?', [req.params.id], (err, result) => {
                if (err) {
                    console.error(err)
                } else if (result[0] === undefined) {
                    res.json(error('Unknown id'))
                } else {
                    res.json(success(result))
                }
            })
        })

        // Modifie un membre par son id
        .put((req, res) => {

            if (req.body.name) {

                db.query('SELECT * FROM members WHERE id = ?', [req.params.id], (err, result) => {
                    if (err) {
                        res.json(error(err))
                    } else {
                        if (result[0] !== undefined) {
                            db.query('SELECT * FROM members WHERE name = ? AND id != ?', [req.body.name, req.params.id], (err, result) => {
                                if (err) {
                                    res.json(error(err))
                                } else {
                                    if (result[0] !== undefined) {
                                        res.json(error('Member already exists'))
                                    } else {
                                        db.query('UPDATE members SET name = ? WHERE id = ?', [req.body.name, req.params.id], (err, result) => {
                                            if (err) {
                                                res.json(error(err))
                                            } else {
                                                res.json(success(result))
                                            }
                                        })
                                    }

                                }
                            })
                        } else {
                            res.json(error('Unknown id'))
                        }
                    }
                })

            }

        })

        // Supprime un membre par son id
        .delete((req, res) => {
            db.query('SELECT * FROM members WHERE id = ?', [req.params.id], (err, result) => {
                if (err) {
                    res.json(error(err))
                } else if (result[0] !== undefined) {
                    db.query('DELETE FROM members WHERE id = ?', [req.params.id], (err, result) => {
                        if (err) {
                            res.json(error(err))
                        } else {
                            res.json(success(result))
                        }
                    })
                } else {
                    res.json(error('Wrong id'))
                }
            })
        })

    MembersRouter.route('/')

        // Recupère tous les membres
        .get((req, res) => {
            if (req.query.max !== undefined && req.query.max > 0) {

                db.query('SELECT * FROM members LIMIT 0, ?', [req.query.max], (err, result) => {
                    if (err) {
                        console.error(err)
                    } else {
                        res.json(success(result))
                    }
                })

            } else if (req.query.max !== undefined) {
                res.json(error('Wrong max value'))
            } else {

                db.query('SELECT * FROM members', (err, result) => {
                    if (err) {
                        console.error(err)
                    } else {
                        res.json(success(result))
                    }
                })
            }
        })

        // Ajoute un membre
        .post((req, res) => {

            let alreadyExists = false

            db.query('SELECT * FROM members WHERE name = ?', [req.body.name], (err, result) => {
                if (err) {
                    res.json(error(err))
                } else if (result[0] !== undefined) {
                    alreadyExists = true
                    return res.json(error('Member already exists'))
                } else {
                    if (req.body.name) {
                        db.query('INSERT INTO members(name) VALUES(?)', [req.body.name], (err, result) => {
                            if (err) {
                                console.error(err)
                            } else {
                                db.query('SELECT * FROM members WHERE name = ?', [req.body.name], (err, result) => {
                                    if (err) {
                                        res.json(error(err.message))
                                    } else {
                                        res.json(success(result))
                                    }
                                })
                            }
                        })
                    } else res.json(error('Wrong data'))
                }
            })


        })

    app.use(config.rootAPI + 'members', MembersRouter) // On laisse l'url a MembersRouter

    app.listen(config.port, () => {
        console.log('Server is running on http://localhost:' + config.port)
    })
}).catch((err) => {
    console.error('error connecting: ' + err)
})
