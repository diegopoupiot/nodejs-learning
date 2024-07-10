require('babel-register')


console.log('Début')
getMember((member) => {
    console.log(member)
    getArticles(member, (articles) => {
        console.log(articles)
    })
})
console.log('Fin')

function getMember(next) {
        setTimeout(() => {
            next('Member 1')
        }, 1500)}

function getArticles(member, next) {
    setTimeout(() => {
        next(['Article 1', 'Article 2', 'Article 3'])
    }, 1500)
}

// Callbacks
// Promise
// Async / Await