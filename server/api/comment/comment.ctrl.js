const CommentModel = require("../../model/comment")
const moment = require("../../controller/moment")

const createComment = async (req, res) => {
  //const post = req.params.postId
  const postNumber = parseInt(req.params.postNumber);
  const content = req.body.content
  if (!content) return res.status(400).send("내용을 입력해주세요.")

  if (res.locals.user.userId != null) {
    new CommentModel({
      //post: post,
      postNumber: postNumber,
      userId: res.locals.user.userId,
      writer: res.locals.user.name,
      content: content,
    }).save((err, result) => {
      if (err) return res.status(500).send(err)
      res.status(201).json(result)
    })
  }
  else {
    return res.status(501).send("로그인을 해야 댓글을 작성할 수 있습니다.");
  }
}

const getAllComment = async (req, res) => {
  //const post = req.params.postId
  const postNumber = parseInt(req.params.postNumber);
  const data = await CommentModel.find({ postNumber: postNumber })
  res.status(200).json({ allComment: data })
}

module.exports = {
  createComment,
  getAllComment,
}
