const db = require("mongoose").connection;

const postNum = async function(){
    const postNumber =  await db.collection("counter").findOne({ name: "postNumber" });

    return postNumber.postNumber;
}

const postCnt = async function () {
    const postCounter = await db.collection("counter").findOne({ name: "postCnt" });

    return postCounter.postCnt;
};

const userCnt = async function () {
    const userCounter = await db.collection("counter").findOne({ name: "userCnt" });

    return userCounter.userCnt;
};

const userCntInc = async function () {
    return await db.collection("counter").updateOne({ name: "userCnt" }, { $inc: { userCnt: 1 } });
};

const postCntInc = async function () {
    await db.collection("counter").updateOne({ name: "postNumber" }, { $inc: { postNumber: 1 } });
    await db.collection("counter").updateOne({ name: "postCnt" }, { $inc: { postCnt: 1 } });

    return;
};

const postCntDec = async function () {
    await db.collection("counter").updateOne({ name: "postCnt" }, { $inc: { postCnt: -1 } });

    return;
};

module.exports = {
    postNum,
    postCnt,
    userCnt,
    userCntInc,
    postCntInc,
    postCntDec
};