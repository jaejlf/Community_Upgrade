const Post = require("../../model/post");
const userService = require("../../services/userService");
const postService = require("../../services/postService");

const createPost = async (req, res) => {
    const name = res.locals.user.name;
    console.log("creator : " + name); //지금 로그인된 유저(작성자)의 정보 받아오기
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).send("제목과 내용을 모두 입력해주세요.");

    try {
        if (res.locals.user.userId != null) {
            const createPost = await postService.createPost(res.locals.user, title, content);
            res.status(201).send(createPost);
        } else {
            return res.status(401).send("로그인을 해야 게시글을 작성할 수 있습니다.");
        }
    } catch (err) {
        res.send({ err: err.message });
    }
};

const getAllPost = async (req, res) => {
    try {
        const data = await Post.find().sort({ _id: -1 }); //최신순

        res.json({
            allPost: data,
        });
    } catch (err) {
        console.log(err.message);
    }
};

const getPost = async (req, res) => {
    const postNumber = parseInt(req.params.postNumber);

    const getPost = await postService.findPost(postNumber);
    if (!getPost) return res.status(500).send({ err: "게시글 번호 오류" });

    await postService.incViewCnt(getPost);

    const auth = await userService.authCheck(res.locals.user.userId, getPost.userId);
    const user = await userService.findUserById(getPost.userId);
    const scrapStatus = await userService.scrapStatus(postNumber, res.locals.user.userId);
    const goodStatus = await userService.goodStatus(getPost.good, res.locals.user.userId);

    let exData = Object.assign({}, getPost)._doc;
    exData.userRole = user.role;
    exData.auth = auth;
    exData.userScrapStauts = scrapStatus;
    exData.userGoodStatus = goodStatus;
    exData.goodCnt = getPost.good.length;

    res.status(200).json(exData);
};

const editPost = async (req, res) => {
    const { title, content } = req.body;
    const postNumber = parseInt(req.params.postNumber);

    const getPost = await postService.findPost(postNumber);
    if (!getPost) return res.status(500).send({ err: "게시글 번호 오류" });

    await postService.editPost(postNumber, title, content);
    res.status(200).send({ message: "수정 완료" });
};

const deletePost = async (req, res) => {
    const postNumber = parseInt(req.params.postNumber);

    const getPost = await postService.findPost(postNumber);
    if (!getPost) return res.status(500).send({ err: "게시글 번호 오류" });

    await postService.deletePost(postNumber);
    res.status(200).send({ message: "삭제 완료" });
};

const pushGood = async (req, res) => {
    const postNumber = parseInt(req.params.postNumber);

    const getPost = await postService.findPost(postNumber);
    if (!getPost) return res.status(500).send({ err: "게시글 번호 오류" });

    let pushGoodList = eval({ goodUser: "", goodUserId: "", role: "" });
    pushGoodList.goodUser = res.locals.user.name;
    pushGoodList.goodUserId = res.locals.user.userId;
    pushGoodList.role = res.locals.user.role;

    const userId = res.locals.user.userId;

    const pushGood = await postService.pushGood(postNumber, userId, getPost, pushGoodList);
    if (pushGood) {
        res.status(200).send({ message: "좋아요 누름" });
    } else {
        res.status(200).send({ message: "좋아요 삭제" });
    }
};

const goodCnt = async (req, res) => {
    const postNumber = parseInt(req.params.postNumber);

    const getPost = await postService.findPost(postNumber);
    if (!getPost) return res.status(500).send({ err: "게시글 번호 오류" });

    const gootCntNum = await postService.goodCnt(postNumber);
    res.status(200).send({ goodCntNum: gootCntNum });
};

module.exports = {
    createPost,
    getAllPost,
    getPost,
    editPost,
    deletePost,
    pushGood,
    goodCnt,
};
