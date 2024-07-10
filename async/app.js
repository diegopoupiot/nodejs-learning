require('babel-register')


console.log('Début')

getMember()
    .then((member) => getArticles(member))
    .then((articles) => console.log(articles))
    .catch((err) => console.log(err.message))

function getMember() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // console.log('Member 1')
            // resolve('Member 1')

            reject(new Error('Erreur'))
        }, 1500)

    })
}

function getArticles(member) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(['Article 1', 'Article 2', 'Article 3'])
        }, 1500)
    })
}

console.log('Fin')
