const BoardModel = require("../../model/post");
const CommentModel = require("../../model/comment");
const UserModel = require("../../model/user");
const userInfo = require("../../controller/userinfo");
const postInfo = require("../../controller/postInfo");

const getMyPost = async (req, res) => {
    const userId = res.locals.user.userId;
    const data = await BoardModel.find({ userId: userId });

    res.status(200).json({
        myPost: data,
    });
};

const getMyComment = async (req, res) => {
    const userId = res.locals.user.userId;
    const data = await CommentModel.find({ userId: userId, isDeleted: false });

    res.status(200).json({
        myComment: data,
    });
};

const scrapping = async (req, res) => {
    const postNumber = parseInt(req.params.postNumber);
    if (res.locals.user.userId == null) return res.status(401).send("로그인을 해야 게시글을 스크랩할 수 있습니다.");

    var user = await userInfo.findUser(res.locals.user.userId);
    var post = await postInfo.findPost(postNumber);
    var scrapStatus = await userInfo.scrapStatus(postNumber, res.locals.user.userId);

    //백 테스트 - 예외
    if (scrapStatus) {
        return res.send("이미 스크랩한 게시물");
    }
    if (!post) {
        return res.send("삭제된 게시물");
    }

    var scraps = user.scrap;
    scraps.push(postNumber);

    UserModel.updateOne(
        { userId: res.locals.user.userId },
        {
            $set: {
                scrap: scraps,
            },
        },
        function (err, data) {
            if (err) return res.status(500).send(err);
            res.status(200).send({ message: "스크랩 완료" });
        }
    );
};

const getMyScrap = async (req, res) => {
    var user = await userInfo.findUser(res.locals.user.userId);
    var exData = [];

    for (let element of user.scrap) {
        var post = await postInfo.findPost(element);
        await exData.push(post);
    }
    res.status(200).json({
        scraps: exData,
    });
};

module.exports = {
    getMyPost,
    getMyComment,
    scrapping,
    getMyScrap,
};
