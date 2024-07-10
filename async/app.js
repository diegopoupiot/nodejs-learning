require('babel-register')


console.log('Début')

let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('p1')
    }, 1500)
})

let p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('p2')
    }, 3000)
})


Promise.race([p1, p2]).then((results) => console.log(results))

//race = la première promesse qui se termine
//all = toutes les promesses se terminent

console.log('Fin')
