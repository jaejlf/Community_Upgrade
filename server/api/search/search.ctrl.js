const Post = require("../../model/post");

const getTitle = (req, res) => {
    try {
        const keyword = req.params.keyword;
        console.log("keyworld in search : " + keyword);
        Post.find({ title: { $regex: req.params.keyword } }, (err, result) => {
            if (err) return res.status(500).end();
            if (!result) return res.status(404).send("검색 결과가 없습니다.");

            return res.status(200).json(result);
        });
    } catch (err) {
        res.send({ err: err.message });
    }
};

const getContent = (req, res) => {
    try {
        const keyword = req.params.keyword;
        console.log("keyworld in search : " + keyword);
        Post.find({ content: { $regex: req.params.keyword } }, (err, result) => {
            if (err) return res.status(500).end();
            if (!result) return res.status(404).send("검색 결과가 없습니다.");

            return res.status(200).json(result);
        });
    } catch (err) {
        res.send({ err: err.message });
    }
};

const getUser = (req, res) => {
    try {
        const keyworld = req.params.keyword;
        console.log("keyworld in search : " + keyworld);
        Post.find({ writer: { $regex: req.params.keyword } }, (err, result) => {
            if (err) return res.status(500).end();
            if (!result) return res.status(404).send("검색 결과가 없습니다.");

            return res.status(200).json(result);
        });
    } catch (err) {
        res.send({ err: err.message });
    }
};

module.exports = {
    getTitle,
    getContent,
    getUser,
};