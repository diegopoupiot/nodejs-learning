require('babel-register')
const http = require('http') // serveur http

http.createServer((req, res) => {

    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.write("<h1>Accueil</h1>")
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' })
        res.write("<span>Page not found</span>")
    }
    res.end()
}).listen(8081)