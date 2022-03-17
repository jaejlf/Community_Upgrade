const { db } = require("../model/user");

const findUser = async function (userId) {

    return await db.collection("users").findOne({ userId: userId });
}

const scrapStatus = async function(postNumber, userId){
    var data = await db.collection("users").findOne({ userId: userId });

    for(let element of data.scrap){
        console.log(element);
    }
    return true;
}

const goodStatus = async function(postNumber, userId){
    return true;
}

module.exports = {
    findUser,
    scrapStatus,
    goodStatus
}