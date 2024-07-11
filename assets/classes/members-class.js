const {error, success} = require("../functions");
let db, config

module.exports = (_db, _config) => {
    db = _db
    config = _config
    return Members
}

let Members = class {

    static getByID(id) {

        return new Promise((next) => {
            db.query('SELECT * FROM members WHERE id = ?', [id])
                .then(result => {
                    if (result.length > 0) {
                        next(result[0]);
                    } else {
                        next(new Error(config.errors.memberNotFound));
                    }
                })
                .catch(err => next(err));
        })
    }

    static getAll(max) {

        return new Promise((next) => {
            if (max !== undefined && max > 0) {

                db.query('SELECT * FROM members LIMIT 0, ?', [parseInt(max)])
                    .then((result) => next(result[0]))
                    .catch((err) => next(err))

            } else if (max !== undefined) {
                next(new Error(config.errors.wrongMaxValue))
            } else {

                db.query('SELECT * FROM members')
                    .then((result) => next(result[0]))
                    .catch((err) => next(err))
            }
        })
    }

    static add(name) {
        return new Promise((next) => {

            if (name !== undefined && name.trim() !== '') {
                name = name.trim()

                db.query('SELECT * FROM members WHERE name = ?', [name])
                    .then((result) => {
                        if (result[0].length > 0) {
                            next(new Error(config.errors.nameAlreadyExists))
                            console.log(error(result[0]))
                        } else {
                            console.log(success(result[0]))
                            return db.query('INSERT INTO members(name) VALUES(?)', [name])
                        }
                    })
                    .catch((err) => next(err))
                    .then(() => {
                        return db.query('SELECT * FROM members WHERE name = ?', [name])
                    })
                    .then((result) => {
                        next(result[0])
                    })
                    .catch((err) => next(err))
            }
        })
    }

    static modify(id, name) {
        return new Promise((next) => {
            if (name !== undefined && name.trim() !== '') {
                name = name.trim()

                db.query('SELECT * FROM members WHERE id = ?', [id])
                    .then((result) => {
                        if (result[0].length > 0) {
                            return db.query('SELECT * FROM members WHERE name = ? AND id != ?', [name, id])
                        } else {
                            next(new Error(config.errors.unknownID))
                        }
                    })
                    .catch((err) => next(err))
                    .then((result) => {
                        if (result[0].length > 0) {
                            next(new Error(config.errors.nameAlreadyExists))
                        } else {
                            return db.query('UPDATE members SET name = ? WHERE id = ?', [name, id])
                        }
                    })
                    .then(() => {
                        return db.query('SELECT * FROM members WHERE id = ?', [id])
                    })
                    .then((result) => {
                        next(result[0])
                    })
                    .catch((err) => next(err))
            } else {
                next(new Error(config.errors.noNameValue))
            }
        })
    }

    static delete(id) {
        return new Promise((next) => {
            db.query('SELECT * FROM members WHERE id = ?', [id])
                .then((result) => {
                    if (result[0].length > 0) {
                        return db.query('DELETE FROM members WHERE id = ?', [id])
                    } else {
                        next(new Error(config.errors.unknownID))
                    }
                })
                .catch((err) => next(err))
                .then(() => next(success(true)))
                .catch((err) => next(err))
        })
    }

}