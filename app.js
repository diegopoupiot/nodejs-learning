require('babel-register')
const os = require('os') // infos sur le système d'exploitation
const fs = require('fs') // gestion des fichiers
const http = require('http') // serveur http

console.log(os.arch())
console.log(os.hostname())

fs.readFile('test.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error('Impossible de lire le fichier')
    } else {
        console.log(data)
        fs.writeFile('test.txt', 'Hello World', (err) => {

            fs.readFile('test.txt', 'utf-8', (err, data) => {
                console.log(data)
            })
        })
    }
})