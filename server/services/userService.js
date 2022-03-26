const User = require("../model/user");
const cntService = require("./counterService");

//회원가입
const createUser = async function (name, role, email, hashedPW) {
    const userCnt = await cntService.userCnt();

    const user = new User({
        userId: userCnt + 1,
        name: name,
        role: role,
        email: email,
        password: hashedPW,
    });

    await cntService.userCntInc();

    return await user.save();
};

//find - User, token
const findUserByEmail = async function (email) {
    return await User.findOne({ email: email });
};

const findUserById = async function (userId) {
    return await User.findOne({ userId: userId });
};

const findToken = async function (_id, token) {
    return await User.findOne({ _id, token });
};

const updateToken = async function (_id, token) {
    return await User.findByIdAndUpdate(_id, { token });
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
        if (good[i].goodUserId == userId) {
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