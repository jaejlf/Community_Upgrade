const { db } = require("../../model/post");
const PostModel = require("../../model/post");
const moment = require("../../controller/moment");

const createPost = (req, res) => {
  const name = res.locals.user.name;
  console.log("creator : " + name); //지금 로그인된 유저(작성자)의 정보 받아오기
  const { title, content } = req.body;
  if (!title || !content)
    return res.status(400).send("제목과 내용을 모두 입력해주세요.");

  db.collection("counter").findOne({ name: "postNumber" }, (err, data) => {
    const postNumber = data.postNumber + 1;
    new PostModel({
      title: title,
      content: content,
      postNumber: postNumber,
    }).save((err, result) => {
      if (err)
        return res.status(500).send("게시글 등록 시 오류가 발생했습니다.");
      res.status(201).json(result);
    });

    db.collection("counter").updateOne(
      { name: "postNumber" },
      { $inc: { postNumber: 1 } }
    );
  });
};

const getAllPost = (req, res) => {
  db.collection("posts")
    .find()
    .toArray(function (err, data) {
      if (err) return res.status(500).json({ error: error.message });

      res.status(200).json({
        allPost: data,
      });
    });
};

const getPost = async (req, res) => {
  const postNumber = parseInt(req.params.postNumber);
  PostModel.findOne({ postNumber: postNumber }, (err, result) => {
    if (err) return res.status(500).end();
    if (!result) return res.status(404).end();

    result.viewCnt++;
    result.save();
    res.status(200).json(result);
  });
};

const editPost = (req, res) => {
  const { title, content, postNumber } = req.body;
  db.collection("posts").updateOne(
    { postNumber: postNumber },
    {
      $set: {
        title: req.body.title,
        content: req.body.content,
        date: moment.dateNow(),
      },
    },
    function (err, data) {
      if (err) return res.status(500).json({ error: error.message });

      res.status(200).send({ message: "수정 완료" });
    }
  );
};

const deletePost = (req, res) => {
  const postNumber = parseInt(req.params.postNumber);
  db.collection("posts").deleteOne(
    { postNumber: postNumber },
    function (err, data) {
      if (err) return res.status(500).json({ error: error.message });

      db.collection("counter").updateOne(
        { name: "postNumber" },
        { $inc: { postNumber: -1 } }
      );

      res.status(200).send({ message: "삭제 완료" });
    }
  );
};

module.exports = {
  createPost,
  getAllPost,
  getPost,
  editPost,
  deletePost,
};
