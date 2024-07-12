// Modules
require('babel-register')
const bodyParser = require('body-parser')
const express = require('express')
const {response} = require("express");
const morgan = require('morgan')('dev')
const axios = require('axios')

// Variables globales
const app = express()
const port = 8081
const fetch = axios.create({
    baseURL: "http://localhost:8080/api/v1"
})

// Middleware
app.use(morgan)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Routes
// - Page d'accueil
app.get('/', (req, res) => {
    res.redirect('members')
})

// - Page des membres
app.get('/members', (req, res) => {
    apiCall(req.query.max ? '/members?max=' + req.query.max : 'members', 'get', {}, res, (result) => {
        res.render('members.twig', {
            members: result
        })
    })
})

// - Page d'un membre spécifique
app.get('/members/:id', (req, res) => {
    apiCall('/members/' + req.params.id, 'get', {}, res, (result) => {
        res.render('member.twig', {
            member: result[0]
        })
    })
})

// - Page pour modifier le nom d'un membre spécifique
app.get('/edit/:id', (req, res) => {
    apiCall('/members/' + req.params.id, 'get', {}, res, (result) => {
        res.render('edit.twig', {
            member: result[0]
        })
    })
})

// -- Méthode pour modifier le nom d'un membre
app.post('/edit/:id', (req, res) => {
    apiCall('/members/' + req.params.id, 'put', {name: req.body.name}, res, () => {
        res.redirect("/members")
    })
})

// -- Méthode pour supprimer un membre
app.post('/delete', (req, res) => {
    apiCall('/members/' + req.body.id, 'delete', {}, res, () => {
        res.redirect("/members")
    })
})

// - Page pour ajouter un membre spécifique
app.get('/insert', (req, res) => {
    res.render('insert.twig')
})

// -- Méthode pour ajouter un membre
app.post('/insert', (req, res) => {
    apiCall('/members', 'post', {name: req.body.name}, res, () => res.redirect('/members'))
})


// Lancement de l'app
app.listen(port, () => console.log('Started on port ' + port))

// Fonctions

function renderError(res, errMsg) {
    return res.render('error.twig', {
        errorMsg: errMsg
    })
}

function apiCall(url, method, data, res, next) {
    fetch({
        method: method,
        url: url,
        data: data
    }).then((response) => {
        if (response.data.status === 'success') {
            next(response.data.result)
        } else {
            renderError(res, response.data.message)
        }
    }).catch((err) => (renderError(res, err.message)))
}