const UserModel = require("../../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { db } = require("../../model/user");

//회원가입
// - 성공 : 201 응답 (Created), 생성된 User객체 반환
// - 실패 :필수 입력값이 누락 시 400 리턴 (Bad Request)
//        email이 중복된 경우 409 리턴 (Conflict)
const signup = (req, res) => {
    const { name, role, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).send("필수값이 입력되지 않았습니다.(name, email, password");

    UserModel.findOne({ email }, (err, result) => {
        if (err) return res.status(500).send("회원가입 시 오류가 발생했습니다.");
        if (result) return res.status(409).send("이미 사용중인 E-mail입니다."); //이메일 중복 방지

        //bcrypt : 단방향 해시함수
        const saltRounds = 10; //salt 자릿수
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) return res.status(500).send("암호화 처리 시 오류가 발생했습니다");

            db.collection("counter").findOne({ name: "userCnt" }, (err, data) => {
                const userCnt = data.userCnt + 1;
                const user = new UserModel({
                    userId: userCnt,
                    name: name,
                    role: role,
                    email: email,
                    password: hash,
                });
                user.save((err, result) => {
                    if (err) return res.status(500).send("등록 시 오류가 발생했습니다.");
                    res.status(201).json(result);
                });

                db.collection("counter").updateOne({ name: "userCnt" }, { $inc: { userCnt: 1 } });
            });
        });
    });
};

//로그인
// - 성공 : email, password가 일치하면 성공(200)
// - 실패 : 필수 입력값이 없는 경우 400 (Bad Request)
//         없는 email인 경우 404 (Not Found)
//         password가 틀린경우 500 ( Server Error )

const login = (req, res) => {
    const { role, email, password } = req.body;
    console.log(role);
    if (!email || !password || !role) return res.status(400).send("필수값이 입력되지 않았습니다.");
    UserModel.findOne({ email }, (err, user) => {
        if (err) return res.status(500).send("사용자 조회 시 오류가 발생했습니다.");
        if (!user) return res.status(404).send("가입되지 않은 계정입니다.");
        console.log(user.role);
        if (role === user.role) {
            //password 정합성 체크 (암호화 된거끼리 비교)
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) return res.status(500).send("암호화 처리 시 오류가 발생했습니다");
                if (!isMatch) return res.status(404).send("비밀번호가 올바르지 않습니다");

                //비밀번호가 맞다면 signed token생성 (json webtoken)
                const token = jwt.sign(user._id.toHexString(), "secretToken");

                UserModel.findByIdAndUpdate(user._id, { token }, (err, result) => {
                    if (err) return res.status(500).send("로그인 시 에러가 발생했습니다.");

                    //토큰 저장 : cookie, local storage..
                    console.log("로그인 성공 : " + token);
                    res.cookie("token", token, { httpOnly: true });
                    res.json(result);
                });
            });
        } else return res.status(500).send("회원 종류를 다시 확인해 주세요.");
    });
};

//모든 요청에 대해 token 정합성 체크
const checkAuth = (req, res, next) => {
    //모든 화면에서 공통으로 보여지는 값이 있는 경우
    res.locals.user = null;

    //쿠키에서 토큰 가져오기
    const token = req.cookies.token;

    console.log("checkAuth - token test : " + token);

    if (!token) {
        //정상적으로 토큰이 없는 경우
        if (req.url === "/" || req.url === "/user/signup" || req.url === "/user/login" || req.url === "/board/posts" || req.url.indexOf("/board/?page") == 0 || req.url === "/board/counter") return next();
        // 비정상적으로 토큰이 없는 경우
        // else return res.json({
        //   error : error
        // });
        else
            return res.json({
                // error: error,
            });
    }

    //토큰이 있는 경우
    //토큰 적합성 체크

    jwt.verify(token, "secretToken", (err, _id) => {
        if (err) {
            res.clearCookie("token");
            return res.send("clear Cookie");
        }

        //쿠키의 token, DB에 저장된 token비교
        UserModel.findOne({ _id, token }, (err, result) => {
            if (err) return res.status(500).send("사용자 인증 시 오류가 발생했습니다");
            if (!result) return res.send("토큰 값이 없습니다");
            res.locals.user = {
                userId: result.userId,
                name: result.name,
                email: result.email,
                role: result.role,
                token: result.token,
            };
            next();
        });
    });
};

const logout = (req, res) => {
    const token = req.cookies.token;
    jwt.verify(token, "secretToken", (err, _id) => {
        if (err) return res.status(500).send("로그아웃 시 오류가 발생했습니다");
        UserModel.findByIdAndUpdate(_id, { token: "" }, (err, result) => {
            if (err) return res.status(500).send("로그아웃 시 오류가 발생했습니다");
            res.clearCookie("token");
            res.clearCookie();
            res.redirect("/");
        });
    });
};

module.exports = {
    signup,
    login,
    checkAuth,
    logout,
};