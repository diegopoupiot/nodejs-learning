require('babel-register')
const {success, error} = require('./functions')
const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')

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

app.use(morgan('dev'))
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/api/v1/members/:id', (req, res) => {

    let index = getIndex(req.params.id)

    if (typeof(index) == 'string') {
        res.json(error(index))
    }
    else {
        res.json(success(members[index].name))
    }
})

app.get('/api/v1/members', (req, res) => {
    if (req.query.max !== undefined && req.query.max > 0) {
        res.json(success(members.slice(0, req.query.max)))
    } else if (req.query.max !== undefined) {
        res.json(error('Wrong max value'))
    } else {
        res.json(success(members))
    }
})

app.post('/api/v1/members', (req, res) => {

    let alreadyExists = false

    members.forEach(member => {
        if (member.name === req.body.name) {
            alreadyExists = true
            return res.json(error('Member already exists'))
        }
    })

    if (alreadyExists) return

    if (req.body.name) {
        let id = members.length + 1
        let newMember = {
            id: id,
            name: req.body.name
        }

        members.push(newMember)
        res.json(success(newMember))
    } else res.json(error('Wrong data'))
})

app.listen(8081, () => {
    console.log('Server is running on http://localhost:8081')
})

function getIndex(id) {
    for (let i = 0; i < members.length; i++) {
        if (members[i].id == id) return i
    }
    return 'Wrong id'
}
