const { db } = require("../../model/post");
const postInfo = require("../../controller/postInfo");

const paging = async (req, res) => {
    const { page } = req.query;
    var curPage = page ? parseInt(page) : 1; //쿼리스트링으로 받아온 값이 없다면 기본(1페이지)

    var postCounter = await db.collection("counter").findOne({ name: "postCnt" });
    var totalPost = postCounter.postCnt;

    const maxPost = 5;
    const totalPage = Math.ceil(totalPost / maxPost);

    if (curPage > totalPage) {
        return res.status(500).json({ message: "페이지 오류" })
    }
    
    var startNum = maxPost * (curPage - 1); //0부터 시작(배열 index)
    var lastNum = startNum + (maxPost - 1);

    var allPosts = await db.collection("posts").find().toArray();

    var exData = [];
    for (let i = startNum; i <= lastNum; i++) {
        if (allPosts[i]) {
            await exData.push(allPosts[i]);
        }
    }
    console.log(exData);
    res.status(200).json({
        allPost: exData,
    });
}

module.exports = {
    paging
};