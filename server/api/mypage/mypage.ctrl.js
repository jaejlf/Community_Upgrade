const BoardModel = require("../../model/post")
const CommentModel = require("../../model/comment")
const UserModel = require("../../model/user");
const userInfo = require("../../controller/userinfo");

const getMyPost = async (req, res) => {
    const userId = res.locals.user.userId;
    await BoardModel.find({ userId: userId }, function (err, data) {
        if (err) return res.status(500).json({ error: error.message });

        res.status(200).json({
            myPost: data
        });
    });
}

const getMyComment = async (req, res) => {
    const userId = res.locals.user.userId;
    await CommentModel.find({ userId: userId }, function (err, data) {
        if (err) return res.status(500).json({ error: error.message });

        res.status(200).json({
            myComment: data
        });
    });
}

const scrapping = async (req, res) => {
    const postNumber = parseInt(req.params.postNumber);
    if (res.locals.user.userId == null) return res.status(501).send("로그인을 해야 게시글을 스크랩할 수 있습니다.");

    var user = await userInfo.findUser(res.locals.user.userId);
    var scraps = user.scrap;
    scraps.push(postNumber);

    UserModel.updateOne(
        { userId: res.locals.user.userId },
        {
            $set: {
                scrap: scraps
            },
        },
        function (err, data) {
            if (err) return res.status(500).json({ error: error.message });

            res.status(200).send({ message: "스크랩 완료" });
        }
    );
}

module.exports = {
    getMyPost,
    getMyComment,
    scrapping
};
