const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const { auth } = require("../middleware/auth");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");
const { Subscriber } = require('../models/Subscriber');

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
    video.save((err, video)=>{
        if(err) return res.json({sucess:false, err})
            res.status(200).json({success:true})
    })
});

router.get('/getVideos', (req, res) => {
    //get videos from DB and send to client 
    Video.find()
        .populate('writer')
        .exec((err, videos)=> {
            if(err) return res.status(400).send(err);
            res.status(200).json({success:true, videos})
        })

});

router.post('/getVideoDetail', (req, res) => {
    Video.findOne({"_id": req.body.videoId})
    .populate("writer")
    .exec((err, video)=>{
        if (err) {
            console.error("DB 조회 오류:", err);
            return res.status(500).send(err);
        }
        if (!video) {
            console.log("해당 videoId에 대한 비디오 없음"); // ✅ video가 null일 때 로그
            return res.json({ success: false, video: null });
        }
        return res.status(200).json({ success: true, video });
        // if(err) return res.status(400).sendStatus(err);
        // res.status(200).json({success:true, video})

        console.log("요청된 videoId:", req.body.videoId);

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

router.post('/getSubscriptionVideos', (req, res) => {

    //Need to find all of the Users that I am subscribing to From Subscriber Collection 
    
    Subscriber.find({ 'userFrom': req.body.userFrom })
    .exec((err, subscribers)=> {
        if(err) return res.status(400).send(err);

        let subscribedUser = [];

        subscribers.map((subscriber, i)=> {
            subscribedUser.push(subscriber.userTo)
        })


        //Need to Fetch all of the Videos that belong to the Users that I found in previous step. 
        Video.find({ writer: { $in: subscribedUser }})
            .populate('writer')
            .exec((err, videos) => {
                if(err) return res.status(400).send(err);
                res.status(200).json({ success: true, videos })
            })
    })
    
});

module.exports = router;
