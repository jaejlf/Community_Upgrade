const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../../services/userService");

//회원가입
const signup = async (req, res) => {
    const { name, role, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).send("필수값이 입력되지 않았습니다.(name, email, password");

    try {
        const user = await userService.findUserByEmail(email);
        if (user) return res.status(409).send("이미 사용중인 E-mail입니다.");

        //bcrypt : 단방향 해시함수
        const saltRounds = 10; //salt 자릿수
        const hashedPW = await bcrypt.hash(password, saltRounds);

        const createUser = await userService.createUser(name, role, email, hashedPW);

        res.status(200).send(createUser);
    } catch (err) {
        res.send({ err: err.message });
    }
};

//로그인
const login = async (req, res) => {
    const { role, email, password } = req.body;
    if (!email || !password || !role) return res.status(400).send("필수값이 입력되지 않았습니다.");

    try {
        const user = await userService.findUserByEmail(email);
        if (!user) return res.status(404).send("가입되지 않은 계정입니다.");

        if (role == user.role) {
            //password 정합성 체크 (암호화 된거끼리 비교)
            bcrypt.compare(password, user.password, async (err, isMatch) => {
                if (err) return res.status(500).send("암호화 처리 시 오류가 발생했습니다");
                if (!isMatch) return res.status(404).send("비밀번호가 올바르지 않습니다");

                //비밀번호가 맞다면 signed token생성 (json webtoken)
                const token = jwt.sign(user._id.toHexString(), "secretToken");
                const loginUser = await userService.updateToken(user._id, token);

                //토큰 저장 : cookie, local storage..
                console.log("로그인 성공 : " + token);
                res.cookie("token", token, { httpOnly: true });
                res.status(200).json(loginUser);
            });
        } else {
            return res.status(500).send("회원 종류를 다시 확인해 주세요.");
        }
    } catch (err) {
        res.send({ err: err.message });
    }
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
    jwt.verify(token, "secretToken", async (err, _id) => {
        if (err) {
            res.clearCookie("token");
            return res.send("clear Cookie");
        }

        //쿠키의 token, DB에 저장된 token비교
        const ckTokenUser = await userService.findToken(_id, token);
        if (!ckTokenUser) return res.send("토큰 값이 없습니다");

        res.locals.user = {
            userId: ckTokenUser.userId,
            name: ckTokenUser.name,
            email: ckTokenUser.email,
            role: ckTokenUser.role,
            token: ckTokenUser.token,
        };
        next();
    });
};

//로그아웃
const logout = (req, res) => {
    const token = req.cookies.token;
    jwt.verify(token, "secretToken", async (err, _id) => {
        if (err) return res.status(500).send("로그아웃 시 오류가 발생했습니다");

        await userService.updateToken(_id, "");
        res.clearCookie("token");
        res.clearCookie();
        res.redirect("/");
    });
};

module.exports = {
    signup,
    login,
    checkAuth,
    logout,
};
