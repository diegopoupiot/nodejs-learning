require('babel-register')
const {success, error, checkAndChange} = require('./assets/functions')
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

    app.use(morgan)
    app.use(bodyParser.json()) // for parsing application/json
    app.use(bodyParser.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded

    MembersRouter.route('/:id')

        // Recupère un membre par son id
        .get(async (req, res) => {
            let member = await Members.getByID(req.params.id)
            res.json(checkAndChange(member))
        })

        // Modifie un membre par son id
        .put(async (req, res) => {
            let updateMember = await Members.modify(req.params.id, req.body.name)
            res.json(checkAndChange(updateMember))
        })

        // Supprime un membre par son id
        .delete(async (req, res) => {
            let deleteMember = await Members.delete(req.params.id)
            res.json(checkAndChange(deleteMember))
        })

    MembersRouter.route('/')

        // Recupère tous les membres
        .get(async (req, res) => {
            let allMembers = await Members.getAll(req.query.max)
            res.json(checkAndChange(allMembers))
        })

        // Ajoute un membre
        .post(async (req, res) => {
            let addMember = await Members.add(req.body.name)
            res.json(checkAndChange(addMember))
        })

    app.use(config.rootAPI + 'members', MembersRouter) // On laisse l'url a MembersRouter

    app.listen(config.port, () => {
        console.log('Server is running on http://localhost:' + config.port)
    })
}).catch((err) => {
    console.error('error connecting: ' + err)
})
