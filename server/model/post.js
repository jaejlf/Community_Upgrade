const mongoose = require("mongoose");
const moment = require("../controller/moment");

const PostSchema = new mongoose.Schema(
  {
    postNumber: Number,
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: String, required: false },
    userId: { type: Number, required: false },
    writer: { type: String, required: false },
    viewCnt: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false }
);

PostSchema.pre("save", function () {
  this.date = moment.dateNow();
});

module.exports = mongoose.model("post", PostSchema);
