const bcrypt = require("bcrypt")

const generatePassword = async (password) => {
    return await bcrypt.hash(password, 10)
}

generatePassword("oussama2024").then((data) => console.log(data))
