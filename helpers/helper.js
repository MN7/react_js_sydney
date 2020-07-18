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

function checkArray(array, inpVal, fieldName) {
  switch (fieldName) {
    case "username": return array.find(r => r.username == inpVal);
    case "email": return array.find(r => r.email == inpVal);
    case "id": return array.find(r => r.id == inpVal);
  }
}

function filterArray(array, inpVal, fieldName) {
  switch (fieldName) {
    case "username": return array.filter(r => r.username == inpVal);
    case "email": return array.filter(r => r.email == inpVal);
    case "id": return array.filter(r => r.id == inpVal);
  }
}

function checkUserOrEmailExists(array, inpUserName, inpEmail) {
  return new Promise((resolve,reject) => {
    const rEmail = checkArray(array, inpEmail, "email");
    if (!rEmail) resolve(checkArray(array, inpUserName, "username"));
    else resolve(rEmail);
  })
}

function getUserAndEmail(array, inpUserName, inpEmail) {
  return new Promise((resolve, reject) => {
    const rName=checkArray(array, inpUserName, "username")
    const rEmail=checkArray(array, inpEmail, "email");
    resolve({"name":rName,"email":rEmail});
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
    getUserAndEmail,
    writeJSONFile
}
