const db = require("mongoose").connection;
const Post = require("../../model/post");

const paging = async (req, res) => {
    const { page } = req.query;
    const curPage = page ? parseInt(page) : 1; //쿼리스트링으로 받아온 값이 없다면 기본(1페이지)

    const postCounter = await db.collection("counter").findOne({ name: "postCnt" });
    const totalPost = postCounter.postCnt;

    const maxPost = 10;
    const totalPage = Math.ceil(totalPost / maxPost);

    if (curPage > totalPage) {
        return res.status(500).json({ message: "페이지 오류" });
    }

    const startNum = maxPost * (curPage - 1); //0부터 시작(배열 index)
    const lastNum = startNum + (maxPost - 1);

    const allPosts = await Post.find().sort({ _id: -1 });

    let exData = [];
    for (let i = startNum; i <= lastNum; i++) {
        if (allPosts[i]) {
            await exData.push(allPosts[i]);
        } else {
            break;
        }
    }

    console.log(exData);
    res.status(200).json({
        allPost: exData,
    });
};

const counter = async (req, res) => {
    const postCounter = await db.collection("counter").findOne({ name: "postCnt" });
    const totalPost = postCounter.postCnt;

    res.status(200).json({
        totalPost: totalPost,
    });
};

module.exports = {
    paging,
    counter,
};