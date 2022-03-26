const Post = require("../../model/post");
const cntService = require("../../services/counterService");

const paging = async (req, res) => {
    try {
        const { page } = req.query;
        const curPage = page ? parseInt(page) : 1; //쿼리스트링으로 받아온 값이 없다면 기본(1페이지)

        const totalPost = await cntService.postCnt();

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

        res.status(200).json({
            allPost: exData,
        });
    } catch (err) {
        res.send({ err: err.message });
    }
};

const counter = async (req, res) => {
    try {
        const data = await cntService.postCnt();

        res.status(200).json({
            totalPost: data,
        });
    } catch (err) {
        res.send({ err: err.message });
    }
};

module.exports = {
    paging,
    counter,
};