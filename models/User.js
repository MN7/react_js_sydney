let users = require('../data/users.json')
const filename = './data/users.json'
const helper = require('../helpers/helper.js')

function getUsers() {
    return new Promise((resolve, reject) => {
        if (users.length === 0) {
            reject({
                message: 'No Users Exist',
                status: 202
            })
        }

        resolve(users)
    })
}

function getUser(inpVal, validateRegistration=false, inpUserName="") {
    return new Promise((resolve, reject) => {
        (validateRegistration ? helper.validateRegistration(users, inpUserName, inpVal) : helper.checkUserOrEmailExists(users, inpVal))
        .then(user => resolve(user))
        .catch(err => reject(err))
    })
}

function addUser(newUser) {
    return new Promise((resolve, reject) => {
        const id = { id: helper.getNewId(users) }
        const date = {
            createdAt: helper.newDate(),
            updatedAt: helper.newDate()
        }
        newUser = { ...id, ...date, ...newUser }
        users.push(newUser)
        helper.writeJSONFile(filename, users)
        resolve(newUser)
    })
}

function updateUser(id, newUser) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(users, id)
        .then(user => {
            const index = users.findIndex(u => u.id == user.id)
            id = { id: user.id }
            const date = {
                createdAt: user.createdAt,
                updatedAt: helper.newDate()
            }
            users[index] = { ...id, ...date, ...newUser }
            helper.writeJSONFile(filename, users)
            resolve(users[index])
        })
        .catch(err => reject(err))
    })
}

function removeUser(id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(users, id)
        .then(() => {
            users = users.filter(u => u.id !== id)
            helper.writeJSONFile(filename, users)
            resolve()
        })
        .catch(err => reject(err))
    })
}

module.exports = {
    getUsers,
    getUser,
    addUser,
    updateUser,
    removeUser
}
