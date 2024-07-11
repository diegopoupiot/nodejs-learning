require('babel-register')
const {checkAndChange} = require('./assets/functions')
const mysql = require("mysql2/promise");
const express = require('express')
const app = require('express')
const morgan = require('morgan')('dev')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./assets/swagger.json')
const config = require('./assets/config')

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

    const app = express()
    app.use(morgan)

    app.use(bodyParser.json()) // for parsing application/json
    app.use(bodyParser.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded
    app.use(config.rootAPI + 'api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    //http://localhost:8080/api/v1/api-docs/

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
