const CommentModel = require("../../model/comment")
const moment = require("../../controller/moment")
const { ObjectId } = require("mongodb")
const { db } = require("../../model/comment")
const auth = require("../../controller/auth")
const userInfo = require("../../controller/userinfo")

const createComment = async (req, res) => {
  //const post = req.params.postId
  console.log("댓글 작성")
  const postNumber = parseInt(req.params.postNumber)
  const content = req.body.content
  if (!content) return res.status(400).send("내용을 입력해주세요.")

  if (res.locals.user.userId != null) {
    new CommentModel({
      //post: post,
      _id: ObjectId().toString(),
      postNumber: postNumber,
      userId: res.locals.user.userId,
      writer: res.locals.user.name,
      content: content,
    }).save((err, result) => {
      if (err) return res.status(500).send(err)
      res.status(201).json(result)
    })
  } else {
    return res.status(501).send("로그인을 해야 댓글을 작성할 수 있습니다.")
  }
}

const getAllComment = async (req, res) => {
  //const post = req.params.postId
  const postNumber = parseInt(req.params.postNumber)
  const result = await CommentModel.find({ postNumber: postNumber })
  // res.status(200).json({ allComment: data })

  var exData = []
  var authCk = false
  for (let element of result) {
    authCk = auth.check(res.locals.user.userId, element.userId)
    var user = await userInfo.findUser(element.userId)

    const data = {
      _id: element._id,
      userId: element.userId,
      userRole: user.role,
      writer: element.writer,
      postNumber: element.postNumber,
      content: element.content,
      isDeleted: element.isDeleted,
      depth: element.depth,
      date: element.date,
      auth: authCk,
    }
    await exData.push(data)
  }

  res.status(200).json(exData)
}

const editComment = (req, res) => {
  const id = req.params.id
  db.collection("comments").findOne({ _id: id }, function (err, data) {
    console.log(data)
    if (err) return res.status(500).json({ error: error.message })
    //if (data.userId != res.locals.user.userId) return res.status(501).json({ error: "작성자만 댓글을 수정할 수 있습니다." });

    db.collection("comments").updateOne(
      { _id: id },
      {
        $set: {
          content: req.body.content,
          date: moment.dateNow(),
        },
      },
      function (err, data) {
        if (err) return res.status(500).json({ error: error.message })

        res.status(200).send({ message: "수정 완료" })
      }
    )
  })
}

const deleteComment = (req, res) => {
  const id = req.params.id
  db.collection("comments").findOne({ _id: id }, function (err, data) {
    console.log(data)
    if (err) return res.status(500).json({ error: error.message })
    //if (data.userId != res.locals.user.userId) return res.status(501).json({ error: "작성자만 댓글을 삭제할 수 있습니다." });

    db.collection("comments").updateOne(
      { _id: id },
      {
        $set: {
          isDeleted: true,
        },
      },
      function (err, data) {
        if (err) return res.status(500).json({ error: error.message })

        res.status(200).send({ message: "삭제 완료" })
      }
    )
  })
}

const replyComment = async (req, res) => {
  console.log("대댓글 작성")
  const parentId = req.params.parentId
  const parentComment = await CommentModel.findOne({ _id: parentId })
  const postNumber = parentComment.postNumber
  const content = req.body.content
  const depth = parentComment.depth + 1

  if (res.locals.user.userId != null) {
    new CommentModel({
      _id: ObjectId().toString(),
      parentId: parentId,
      postNumber: postNumber,
      content: content,
      depth: depth,
      userId: res.locals.user.userId,
      writer: res.locals.user.name,
    }).save((err, result) => {
      if (err) return res.status(500).send(err)
      res.status(201).json(result)
    })
  } else {
    return res.status(501).send("로그인을 해야 댓글을 작성할 수 있습니다.")
  }
}

module.exports = {
  createComment,
  getAllComment,
  editComment,
  deleteComment,
  replyComment,
}
