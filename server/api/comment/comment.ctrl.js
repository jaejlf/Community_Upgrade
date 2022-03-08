const CommentModel = require("../../model/comment")
const moment = require("../../controller/moment")
const { db } = require("../../model/post")

const createComment = async (req, res) => {
  const post = req.params.postId
  const content = req.body.content
  if (!content) return res.status(400).send("내용을 입력해주세요.")

  new CommentModel({
    post: post,
    content: content,
  }).save((err, result) => {
    if (err) return res.status(500).send(err)
    res.status(201).json(result)
  })
}

const getAllComment = async (req, res) => {
  const post = req.params.postId
  const data = await CommentModel.find({ post: post })
  res.status(200).json({ allComment: data })
}

module.exports = {
  createComment,
  getAllComment,
}
