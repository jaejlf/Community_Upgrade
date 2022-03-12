const BoardModel = require("../../model/post")
const CommentModel = require("../../model/comment")

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

module.exports = {
    getMyPost,
    getMyComment
};
