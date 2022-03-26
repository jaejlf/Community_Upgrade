const Comment = require("../model/comment");
const { ObjectId } = require("mongodb");

const findComment = async function (id) {
    return await Comment.findOne({ _id: id });
};

const createComment = async function (postNumber, user, content) {
    const comment = new Comment({
        _id: ObjectId().toString(),
        postNumber: postNumber,
        userId: user.userId,
        writer: user.name,
        content: content,
    });

    return await comment.save();
};

const createReplyComment = async function (postNumber, user, content, parentId) {
    const comment = new Comment({
        _id: ObjectId().toString(),
        postNumber: postNumber,
        userId: user.userId,
        writer: user.name,
        content: content,
        parentId: parentId,
        depth: 2,
    });

    return await comment.save();
};

const deleteComment = async function (id) {
    return await Comment.updateOne(
        { _id: id },
        {
            $set: {
                isDeleted: true,
            },
        }
    );
};

const deleteChildComment = async function (postNumber) {
    return await Comment.deleteMany({ postNumber: postNumber });
};

module.exports = {
    findComment,
    createComment,
    createReplyComment,
    deleteComment,
    deleteChildComment,
};