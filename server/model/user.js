const mongoose = require("mongoose");

//schema create
const UserSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: false
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },

  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    trim: true,
  },

  role: {
    type: Number,
    required: true,
    // default: 0, //0은 일반 사용자 1은 관리자
  },

  token: {
    type: String,
  },
  scrap: [ 
    { type: Number, required: false } //스크랩한 게시물 번호
  ]
});

//스키마를 통한 모델 객체 생성
//mongoose.model("모델 명", 스키마) -> 모델명s
module.exports = mongoose.model("user", UserSchema);
