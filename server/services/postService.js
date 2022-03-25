const Post = require("../model/post");
const cntService = require("./counterService");
const commentService = require("./commentService");
const moment = require("./moment");
const userService = require("./userService");

const createPost = async function (user, title, content) {
    try {
        const postNumber = (await cntService.postNum()) + 1;

        const post = new Post({
            userId: user.userId,
            writer: user.name,
            title: title,
            content: content,
            postNumber: postNumber,
        });

        await cntService.postCntInc();

        return await post.save();
    } catch (err) {
        console.log(err.message);
    }
};

const editPost = async function (postNumber, title, content) {
    try {
        await Post.updateOne(
            { postNumber: postNumber },
            {
                $set: {
                    title: title,
                    content: content,
                    date: moment.dateNow(),
                },
            }
        );

        return;
    } catch (err) {
        console.log(err.message);
    }
};

const deletePost = async function (postNumber) {
    try {
        await Post.deleteOne({ postNumber: postNumber });
        await cntService.postCntDec();
        await commentService.deleteChildComment(postNumber);

        return;
    } catch (err) {
        console.log(err.message);
    }
};

const findPost = async function (postNumber) {
    return await Post.findOne({ postNumber: postNumber });
};

const incViewCnt = async function (post) {
    await post.viewCnt++;
    await post.save();

    return;
};

const pushGood = async function (postNumber, userId, post, pushGoodList) {
    try {
        const pushGoodFunction = function () {
            Post.updateOne(
                { postNumber: postNumber },
                {
                    $push: {
                        good: pushGoodList,
                    },
                }
            );
        };

        const deleteGoodFunction = function () {
            Post.updateOne(
                { postNumber: postNumber },
                {
                    $pull: {
                        good: { goodUserId: userId },
                    },
                }
            );
        };

        const goodStatus = await userService.goodStatus(post.good, userId);

        if (goodStatus) {
            await deleteGoodFunction();
            return false;
        } else {
            await pushGoodFunction();
            return true;
        }
    } catch (err) {
        console.log(err.message);
    }
};

const goodCnt = async function (postNumber) {
    const post = await Post.findOne({ postNumber: postNumber });

    return post.good.length;
};

module.exports = {
    createPost,
    editPost,
    deletePost,
    findPost,
    incViewCnt,
    pushGood,
    goodCnt,
};
