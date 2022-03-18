const { db } = require("../model/user");
const postInfo = require("./postInfo");

const findUser = async function (userId) {

    return await db.collection("users").findOne({ userId: userId });
}

const scrapStatus = async function (postNumber, userId) {
    var data = await db.collection("users").findOne({ userId: userId });

    var result = false;
    for (let element of data.scrap) {
        if (element == postNumber){
            result = true;
            break;
        }
    }

    return result;
}

const goodStatus = async function (good, userId) {
    var result = false;

    for (let i = 0; i < good.length; i++){
        if(good[i][0].gooodUserId == userId){
            result = true;
            break;
        }
    }

    return result;
}

module.exports = {
    findUser,
    scrapStatus,
    goodStatus
}