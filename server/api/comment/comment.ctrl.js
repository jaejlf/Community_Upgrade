const Comment = require("../../model/comment");
const userService = require("../../services/userService");
const postService = require("../../services/postService");
const commentService = require("../../services/commentService");

const createComment = async (req, res) => {
    try {
        const postNumber = parseInt(req.params.postNumber);
        const content = req.body.content;
        if (!content) return res.status(400).send("내용을 입력해주세요.");

        const getPost = await postService.findPost(postNumber);
        if (!getPost) return res.status(500).send({ err: "게시글 번호 오류" });

        if (res.locals.user.userId != null) {
            const createComment = await commentService.createComment(postNumber, res.locals.user, content);
            res.status(201).send(createComment);
        } else {
            return res.status(401).send("로그인을 해야 게시글을 작성할 수 있습니다.");
        }
    } catch (err) {
        res.send({ err: err.message });
    }
};

const getAllComment = async (req, res) => {
    try {
        const postNumber = parseInt(req.params.postNumber);

        const getPost = await postService.findPost(postNumber);
        if (!getPost) return res.status(500).send({ err: "게시글 번호 오류" });

        const data = await Comment.find({ postNumber: postNumber });

        let exData = [];
        for (let element of data) {
            const auth = await userService.authCheck(res.locals.user.userId, element.userId);
            const user = await userService.findUserById(element.userId);

            let data = Object.assign({}, element)._doc;
            data.userRole = user.role;
            data.auth = auth;

            await exData.push(data);
        }

        res.status(200).json(exData);
    } catch (err) {
        res.send({ err: err.message });
    }
};

const getReplyComment = async (req, res) => {
    try {
        const parentId = req.params.parentId;

        const getComment = await commentService.findComment(parentId);
        if (!getComment) return res.status(500).send({ err: "댓글 아이디 오류" });

        const childComment = await Comment.find({
            parentId: parentId,
            depth: 2,
        });

        let exData = [];
        for (let element of childComment) {
            const auth = await userService.authCheck(res.locals.user.userId, element.userId);

            let data = Object.assign({}, element)._doc;
            data.auth = auth;

            await exData.push(data);
        }
        res.status(200).json(exData);
    } catch (err) {
        res.send({ err: err.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const id = req.params.id;

        const getComment = await commentService.findComment(id);
        if (!getComment) return res.status(500).send({ err: "댓글 아이디 오류" });

        await commentService.deleteComment(id);
        res.status(200).send({ message: "삭제 완료" });
    } catch (err) {
        res.send({ err: err.message });
    }
};

const replyComment = async (req, res) => {
    try {
        const parentId = req.params.parentId;
        const content = req.body.content;

        const getComment = await commentService.findComment(parentId);
        if (!getComment) return res.status(500).send({ err: "댓글 아이디 오류" });

        const postNumber = getComment.postNumber;

        if (res.locals.user.userId != null) {
            const createReplyComment = await commentService.createReplyComment(
                postNumber,
                res.locals.user,
                content,
                parentId
            );
            res.status(201).send(createReplyComment);
        } else {
            return res.status(401).send("로그인을 해야 게시글을 작성할 수 있습니다.");
        }
    } catch (err) {
        res.send({ err: err.message });
    }
};

module.exports = {
    createComment,
    getAllComment,
    getReplyComment,
    deleteComment,
    replyComment,
};