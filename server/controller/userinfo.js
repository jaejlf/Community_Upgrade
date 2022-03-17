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
    for (let element of good) {
        if (element.userId == userId) {
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