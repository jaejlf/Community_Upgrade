const Comment = require("../model/comment");
const moment = require("./moment");

const deleteChildComment = async function (postNumber) {
    return await Comment.deleteMany({ postNumber: postNumber });
};

module.exports = {
    deleteChildComment,
};
