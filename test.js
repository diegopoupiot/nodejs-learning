let testMsg = 'Hello World';

console.log("Début")
start()
console.log("Fin")

function getMessage() {
    return new Promise(resolve =>
    setTimeout(() => resolve(testMsg), 1000)
        );
}

async function start() {
    console.log(await getMessage())
}