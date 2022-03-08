const mongoose = require("mongoose")
const moment = require("../controller/moment")

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    //date: { type: Date, default: Date.now() },
    date : { type: String, required: false },
    postNumber: Number,
  },
  { versionKey: false }
)

PostSchema.pre("save", function () {
  this.date = moment.dateNow()
})

module.exports = mongoose.model("post", PostSchema)
