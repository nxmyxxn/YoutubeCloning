const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({

    writer: {
        //id만 가지고 User 모델에서 모든 정보 불러올 수 있음
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type:String,
        maxlength: 50
    },
    description: {
        type: String,
    },
    privacy: {
        type: Number
    },
    filePath: {
        type:String
    },
    category:{
        type: String,
    },
    views: {
        type: Number,
        default: 0
    },
    duration: {
        type: String,
    },
    thumbnail: {
        type: String
    }

}, {timestamps: true})




const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }