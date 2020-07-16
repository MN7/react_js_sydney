const fs = require('fs')

const getNewId = (array) => {
    if (array.length > 0) {
        return array[array.length - 1].id + 1
    } else {
        return 1
    }
}

const newDate = () => new Date().toString()

function mustBeInArray(array, id) {
    return new Promise((resolve, reject) => {
        const row = array.find(r => r.id == id)
        if (!row) {
            reject({
                message: 'ID is not good',
                status: 404
            })
        }
        resolve(row)
    })
}

function checkUserOrEmailExists(array, inpVal) {
    return new Promise((resolve, reject) => {
        const rowEmail = array.find(r => r.email == inpVal);
        const rowUser = array.find(r => r.username == inpVal);

        if (rowEmail && !rowUser) resolve(rowEmail);
        if (!rowEmail && rowUser) resolve(rowUser);

        if (rowEmail && rowUser) {
          console.log("WARNING: checkUserOrEmailExists() --> input-val matches both username: "+rowUser.username+" and email: "+rowEmail.email);
          resolve(rowEmail);
        }

        if (!rowEmail && !rowUser) {
          console.log("checkUserOrEmailExists() --> inpVal: "+inpVal+" match not found on email or username.");
          resolve();
        }
    })
}

function validateRegistration(array, username, email) {
    return new Promise((resolve, reject) => {
        const rowEmail = array.find(r => r.email == email);
        const rowUser = array.find(r => r.username == username);

        if (!rowEmail && !rowUser) {
          resolve();
        } else {
          !rowUser ? resolve(rowEmail) : resolve(rowUser);
        }
    })
}

function writeJSONFile(filename, content) {
    fs.writeFileSync(filename, JSON.stringify(content), 'utf8', (err) => {
        if (err) {
            console.log(err)
        }
    })
}

module.exports = {
    getNewId,
    newDate,
    mustBeInArray,
    checkUserOrEmailExists,
    validateRegistration,
    writeJSONFile
}
