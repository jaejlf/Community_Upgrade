const Post = require("../model/post");

const findPost = async function (postNumber) {
    return await Post.findOne({ postNumber: postNumber });
};

module.exports = {
    findPost,
};