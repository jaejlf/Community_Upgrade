const db = require("mongoose").connection;
const User = require("../model/user");

//회원가입
const createUser = async function (name, role, email, hashedPW) {
    try {
        const userCnt = await db.collection("counter").findOne({ name: "userCnt" });

        const user = new User({
            userId: userCnt.userCnt + 1,
            name: name,
            role: role,
            email: email,
            password: hashedPW,
        });

        await db.collection("counter").updateOne({ name: "userCnt" }, { $inc: { userCnt: 1 } });

        return await user.save();
    } catch (err) {
        console.log(err.message);
    }
};

//find - User, token
const findUserByEmail = async function (email) {
    return await User.findOne({ email: email });
};

const findUserById = async function (userId) {
    return await User.findOne({ userId: userId });
};

const findToken = async function (_id, token) {
    try {
        return await User.findOne({ _id, token });
    } catch (err) {
        console.log(err.message);
    }
};

const updateToken = async function (_id, token) {
    try {
        return await User.findByIdAndUpdate(_id, { token });
    } catch (err) {
        console.log(err.message);
    }
};

//현재 유저 권한 체크
const authCheck = function (curUser, userId) {
    if (curUser == userId) {
        return true;
    } else return false;
};

//스크랩 상태
const scrapStatus = async function (postNumber, userId) {
    const data = await User.findOne({ userId: userId });

    let result = false;
    for (let element of data.scrap) {
        if (element == postNumber) {
            result = true;
            break;
        }
    }

    return result;
};

//좋아요 상태
const goodStatus = async function (good, userId) {
    let result = false;

    for (let i = 0; i < good.length; i++) {
        if (good[i].gooodUserId == userId) {
            result = true;
            break;
        }
    }

    return result;
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    findToken,
    updateToken,
    authCheck,
    scrapStatus,
    goodStatus,
};