const Post = require("../../model/post");
const Comment = require("../../model/comment");
const User = require("../../model/user");
const userService = require("../../services/userService");
const postService = require("../../services/postService");

const getMyPost = async (req, res) => {
    try {
        const userId = res.locals.user.userId;
        const data = await Post.find({ userId: userId });

        res.status(200).json({
            myPost: data,
        });
    } catch (err) {
        res.send({ err: err.message });
    }
};

const getMyComment = async (req, res) => {
    try {
        const userId = res.locals.user.userId;
        const data = await Comment.find({ userId: userId, isDeleted: false });

        res.status(200).json({
            myComment: data,
        });
    } catch (err) {
        res.send({ err: err.message });
    }
};

const scrapping = async (req, res) => {
    try {
        const postNumber = parseInt(req.params.postNumber);

        const getPost = await postService.findPost(postNumber);
        if (!getPost) return res.status(500).send({ err: "게시글 번호 오류" });

        if (res.locals.user.userId != null) {
            const user = await userService.findUserById(res.locals.user.userId);
            const post = await postService.findPost(postNumber);
            const scrapStatus = await userService.scrapStatus(postNumber, res.locals.user.userId);

            if (scrapStatus) return res.send("이미 스크랩한 게시물");
            if (!post) return res.send("삭제된 게시물");

            await userService.scrapping(user, postNumber);
            res.status(200).send({ message: "스크랩 완료" });
        } else {
            return res.status(401).send("로그인을 해야 게시글을 스크랩할 수 있습니다.");
        }
    } catch (err) {
        res.send({ err: err.message });
    }
};

const getMyScrap = async (req, res) => {
    try {
        const user = await userService.findUserById(res.locals.user.userId);
        let exData = [];

        for (let element of user.scrap) {
            const post = await postService.findPost(element);
            await exData.push(post);
        }
        res.status(200).json({
            scraps: exData,
        });
    } catch (err) {
        res.send({ err: err.message });
    }
};

module.exports = {
    getMyPost,
    getMyComment,
    scrapping,
    getMyScrap,
};
