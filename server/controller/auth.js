//curUser = 현재 로그인된 유저(res.locals.user)
//userId = 컨텐츠의 작성자

const check = function (curUser, userId) {
    if (curUser == userId) {
        return true;
    }
    else return false;
}

module.exports = {
    check
}