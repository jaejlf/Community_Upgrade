const { db } = require("../../model/post")
const PostModel = require("../../model/post")

const createPost = (req, res) => {
  const { title, content } = req.body
  if (!title || !content)
    return res.status(400).send("제목과 내용을 모두 입력해주세요.")

  db.collection("counter").findOne({ name: "postNumber" }, (err, data) => {
    const postNumber = data.postNumber
    new PostModel({
      title: title,
      content: content,
      postNumber: postNumber,
    }).save((err, result) => {
      if (err)
        return res.status(500).send("게시글 등록 시 오류가 발생했습니다.")
      res.status(201).json(result)
    })

    db.collection("counter").updateOne(
      { name: "postNumber" },
      { $inc: { postNumber: 1 } }
    )
  })
}

const getAllPost = (req, res) => {
  db.collection("posts").find().toArray(function (err, data) {
    if (err)
      return res.status(500).json({ error: error.message })

    res.status(200).json({
      allPost: data
    })
  })
}

module.exports = {
  createPost,
  getAllPost
}
