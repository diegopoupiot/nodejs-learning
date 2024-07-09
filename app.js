require('babel-register')
const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(morgan('dev'))

app.get('/api', (req, res) => {
    res.send('Root API')
})

app.get('/api/v1', (req, res) => {
    res.send('API version 1')
})

app.get('/api/v1/books/:id', (req, res) => {
    res.send(`Book ID: ${req.params.id}`)
})
app.get('/api/v1/books/:id/:chapter', (req, res) => {
    res.send(`Book ID: ${req.params.id}, Chapter: ${req.params.chapter}`)
})

app.listen(8081, () => {
    console.log('Server is running on http://localhost:8081')
})
