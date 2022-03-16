const { db } = require("../model/post");

const findPost = async function (postNumber) {

    return await db.collection("posts").findOne({ postNumber: postNumber });
}

module.exports = {
    findPost
}