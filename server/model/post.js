const mongoose = require("mongoose")

let db = mongoose.connection

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now() },
    postNumber: Number,
  },
  { versionKey: false }
)

module.exports = mongoose.model("post", PostSchema)
