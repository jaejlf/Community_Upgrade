const db = require("mongoose").connection;
const Post = require("../../model/post");
const Comment = require("../../model/comment");
const moment = require("../../services/moment");
const userService = require("../../services/userService");

const createPost = (req, res) => {
  const name = res.locals.user.name;
  console.log("creator : " + name); //지금 로그인된 유저(작성자)의 정보 받아오기
  const { title, content } = req.body;
  if (!title || !content)
    return res.status(400).send("제목과 내용을 모두 입력해주세요.");

  db.collection("counter").findOne({ name: "postNumber" }, (err, data) => {
    const postNumber = data.postNumber + 1;
    if (res.locals.user.userId != null) {
      new Post({
        userId: res.locals.user.userId,
        writer: res.locals.user.name,
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
      db.collection("counter").updateOne(
        { name: "postCnt" },
        { $inc: { postCnt: 1 } }
      );
    } else {
      return res.status(401).send("로그인을 해야 게시글을 작성할 수 있습니다.");
    }
  });
};

const getAllPost = async (req, res) => {
    try {
        const data = await Post.find().sort({ _id: -1 });

        res.json({
            allPost: data,
        });
    } catch (err) {
        console.log(err.message);
    }
};

const getPost = async (req, res) => {
  const postNumber = parseInt(req.params.postNumber);
  Post.findOne({ postNumber: postNumber }, async (err, result) => {
    if (err) return res.status(500).end();
    if (!result) return res.status(404).end();

    result.viewCnt++;
    result.save();

    const auth = await userService.authCheck(res.locals.user.userId, result.userId);
    const user = await userService.findUserById(result.userId);
    const scrapStatus = await userService.scrapStatus(
      postNumber,
      res.locals.user.userId
    );
    const goodStatus = await userService.goodStatus(
      result.good,
      res.locals.user.userId
    );

    let exData = Object.assign({}, result)._doc;
    exData.userRole = user.role;
    exData.auth = auth;
    exData.userScrapStauts = scrapStatus;
    exData.userGoodStatus = goodStatus;
    exData.goodCnt = result.good.length;

    res.status(200).json(exData);
  });
};

const editPost = (req, res) => {
  const postNumber = parseInt(req.params.postNumber);
  const { title, content } = req.body;
  Post.findOne(
    { postNumber: postNumber },
    function (err, data) {
      if (err) return res.status(500).json({ error: error.message });

      Post.updateOne(
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
    }
  );
};

const deletePost = (req, res) => {
  const postNumber = parseInt(req.params.postNumber);
  Post.findOne(
    { postNumber: postNumber },
    function (err, data) {
      if (err) return res.status(500).json({ error: error.message });

      //게시글 삭제
      Post.deleteOne(
        { postNumber: postNumber },
        function (err, data) {
          if (err) return res.status(500).json({ error: error.message });

          db.collection("counter").updateOne(
            { name: "postCnt" },
            { $inc: { postCnt: -1 } }
          );
        }
      );

      //해당 게시글에 달린 댓글 삭제 (완전 삭제)
      Comment.deleteMany(
        { postNumber: postNumber },
        function (err, data) {
          if (err) return res.status(500).json({ error: error.message });
        }
      );
    }
  );

  res.status(200).send({ message: "삭제 완료" });
};

const pushGood = (req, res) => {
  const postNumber = parseInt(req.params.postNumber);
  console.log(postNumber);

  let pushGoodList = eval({ goodUser: "", gooodUserId: "", role: "" });
  pushGoodList.goodUser = res.locals.user.name;
  pushGoodList.gooodUserId = res.locals.user.userId;
  pushGoodList.role = res.locals.user.role;

  const userId = res.locals.user.userId;

  Post.findOne({ postNumber: postNumber }, (err, data) => {
    if (err) return res.status(500).json({ error: error.message });
    console.log(data.good);
    console.log(data.good.find((value) => value.gooodUserId === userId));

    const pushGoodFunction = (err, result) => {
      Post.updateOne(
        { postNumber: postNumber },
        {
          $push: {
            good: pushGoodList,
          },
        },
        (err, data) => {
          if (err) return res.status(500).json({ error: error.message });

          res.status(200).send({ message: "좋아요 누름" });
        }
      );
    };

    const deleteGoodFunction = (err, result) => {
      Post.updateOne(
        { postNumber: postNumber },
        {
          $pull: {
            good: { gooodUserId: userId },
          },
        },
        (err, data) => {
          if (err) return res.status(500).json({ error: error.message });

          res.status(200).send({ message: "좋아요 삭제" });
        }
      );
    };

    if (data.good.find((value) => value.gooodUserId === userId))
      deleteGoodFunction();
    else pushGoodFunction();
  });
};

const goodCnt = (req, res) => {
  const postNumber = parseInt(req.params.postNumber);
  console.log(postNumber);

  Post.findOne({ postNumber: postNumber }, (err, data) => {
    const good = data.good;
    console.log(good.length);
    const goodCntNum = good.length;
    res.send({ goodCntNum });
  });
};

module.exports = {
  createPost,
  getAllPost,
  getPost,
  editPost,
  deletePost,
  pushGood,
  goodCnt,
};
