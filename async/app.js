require('babel-register')


console.log('Début')

let p = new Promise((resolve, reject) => {

    setTimeout(() => {
        resolve('Success')
        reject(new Error('Error'))
    }, 1500)
})

.then((message) => console.log(message))
.catch((error) => console.log(error))

console.log('Fin')


// function getMember(next) {
//         setTimeout(() => {
//             next('Member 1')
//         }, 1500)}
//
// function getArticles(member, next) {
//     setTimeout(() => {
//         next(['Article 1', 'Article 2', 'Article 3'])
//     }, 1500)
// }

// Callbacks
// Promise
// Async / Await