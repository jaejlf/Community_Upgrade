const mongoose = require("mongoose");

//schema create
const UserSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: false,
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
        // default: 0, //1 : 일반 회원, 2 : 기업 회원
    },

    token: {
        type: String,
    },
    scrap: [
        { type: Number, required: false }, //스크랩한 게시물 번호
    ],
});

module.exports = mongoose.model("user", UserSchema);