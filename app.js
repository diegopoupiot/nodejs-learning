require('babel-register')
const {success, error} = require('./functions')
const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const config = require('./config')

const members = [
    {
        id: 1,
        name: 'John Doe'
    },
    {
        id: 2,
        name: 'Jane Doe'
    },
    {
        id: 3,
        name: 'Bob Smith'
    }
]

let MembersRouter = express.Router()

app.use(morgan('dev'))
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

MembersRouter.route('/:id')

    // Recupère un membre par son id
    .get((req, res) => {

        let index = getIndex(req.params.id)

        if (typeof(index) == 'string') {
            res.json(error(index))
        }
        else {
            res.json(success(members[index].name))
        }
    })

    // Modifie un membre par son id
    .put( (req, res) => {
        let index = getIndex(req.params.id)
        let same = false

        if (typeof(index) == 'string') {
            res.json(error(index))
        }
        else {

            members.forEach(member => {
                if (member.name === req.body.name && member.id !== req.params.id) {
                    same = true
                }
            })
        }

        if (same) {
            res.json(error('Member already exists'))
        } else {
            members[index].name = req.body.name // Update the name
            res.json(success(members[index]))
        }
    })

    // Supprime un membre par son id
    .delete((req, res) => {
        let index = getIndex(req.params.id)

        if (typeof(index) == 'string') {
            res.json(error(index))
        }
        else {
            members.splice(index, 1) // supprime l'élément à l'index
            res.json(success(members))
        }
    })

MembersRouter.route('/')

    // Recupère tous les membres
    .get( (req, res) => {
        if (req.query.max !== undefined && req.query.max > 0) {
            res.json(success(members.slice(0, req.query.max)))
        } else if (req.query.max !== undefined) {
            res.json(error('Wrong max value'))
        } else {
            res.json(success(members))
        }
    })

    // Ajoute un membre
    .post((req, res) => {

        let alreadyExists = false

        members.forEach(member => {
            if (member.name === req.body.name) {
                alreadyExists = true
                return res.json(error('Member already exists'))
            }
        })

        if (alreadyExists) return

        if (req.body.name) {
            let id = getLastId()
            let newMember = {
                id: id,
                name: req.body.name
            }

            members.push(newMember)
            res.json(success(newMember))
        } else res.json(error('Wrong data'))
    })

app.use(config.rootAPI + 'members', MembersRouter) // On laisse l'url a MembersRouter

app.listen(config.port, () => {
    console.log('Server is running on http://localhost:' + config.port)
})

function getIndex(id) {
    for (let i = 0; i < members.length; i++) {
        if (members[i].id == id) return i
    }
    return 'Wrong id'
}

function getLastId() {
    return members[members.length - 1].id + 1
}