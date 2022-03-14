const { db } = require("../model/user");

const findUser = async function (userId) {
    
    return await db.collection("users").findOne({ userId: userId });
}

module.exports = {
    findUser
}