const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg")

// storage multer config option
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4'){
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true)
    }
});

var upload = multer({storage: storage}).single("file");

//=================================
//             Video
//=================================

router.post('/uploadfiles', (req, res) => {
    //save the video from client
    upload(req, res, err => {
        if(err) {
            console.log("파일 업로드 요청 받음", req.files);
            return res.json({ success: false, err})
        }
        return res.json({ success : true, url: res.req.file.path, fileName: res.req.file.filename})
    })
});

router.post('/uploadVideo', (req, res) => {
    //save video information 
    const video = new Video(req.body)
    // sava to MongoDB
    video.save((err, doc)=>{
        if(err) return res.json({sucess:false, err})
            res.status(200).json({success:true})
    })
});

router.post('/thumbnail', (req, res) => {

    //generate thumbnail and get running time of the video

    //get video information
    ffmpeg.ffprobe(req.body.url, function(err, metadata){
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration;
    })

    ffmpeg(req.body.url)
    .on('filenames', function(filenames){
        console.log("Will generate" + filenames.join(','))
        console.log(filenames)

        filePath = "uploads/thumbnails/" + filenames[0]
    })
    .on('end', function(){
        console.log('Screenshot taken');
        return res.json({success: true, url:filePath, fileDuration:fileDuration})
    })
    .on('error', function (err) {
        console.log(err);
        return res.json({ success: false, err})
    })
    .screenshots({
        // Will take screens at 20%, 40%, 60% and 80% of the video
        count: 3,
        folder: 'uploads/thumbnails',
        size:'320x240',
        // %b input basename ( filename w/o extension )
        filename:'thumbnail-%b.png'
    });
    
});

module.exports = router;
