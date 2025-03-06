const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");
const { Like } = require("../models/Like");
const { Dislike } = require("../models/Dislike");

//=================================
//             Like
//=================================

router.post('/getLikes', (req, res) => {
    let variable = {}

    if (req.body.videoId){
        variable= {videoId: req.body.videoId}
    }else {
        variable= {commentId: req.body.commentId}
    }
    
    Like.find(variable)
        .exec((err, likes)=>{
            if (err) return res.status(400).send(err)
            return res.status(200).json({success:true, likes})
        })
});

router.post('/getDislikes', (req, res) => {
    let variable = {}

    if (req.body.videoId){
        variable= {videoId: req.body.videoId}
    }else {
        variable= {commentId: req.body.commentId}
    }
    
    Dislike.find(variable)
        .exec((err, dislikes)=>{
            if (err) return res.status(400).send(err)
            return res.status(200).json({success:true, dislikes})
        })
});

router.post('/upLike', (req, res) => {
    let variable = {}

    if (req.body.videoId){
        variable= {videoId: req.body.videoId, userId: req.body.userId}
    }else {
        variable= {commentId: req.body.commentId, userId: req.body.userId}
    }
    
    //like collection에 클릭 정보 넣어주기
    const like = new Like(variable)
    like.save((err, likeresult)=>{
        if(err) return res.json({success:false, err})

            //dislike이 이미 클릭되어있을 때 dislike -1
            Dislike.findOneAndDelete(variable)
                .exec((err,dislikeResult)=>{
                    if(err) return res.status(400).json({success:false, err})
                    res.status(200).json({success:true})
                })
    }) 
});

router.post('/unLike', (req, res) => {
    let variable = {}

    if (req.body.videoId){
        variable= {videoId: req.body.videoId, userId: req.body.userId}
    }else {
        variable= {commentId: req.body.commentId, userId: req.body.userId}
    }

    Like.findOneAndDelete(variable)
        .exec((err, result) => {
            if(err) return res.status(400).json({success:false, err})
            res.status(200).json({success:true})
        })
    
    
});

router.post('/unDisike', (req, res) => {
        let variable = {}
    
        if (req.body.videoId){
            variable= {videoId: req.body.videoId, userId: req.body.userId}
        }else {
            variable= {commentId: req.body.commentId, userId: req.body.userId}
        }

        Dislike.findOneAndDelete(variable)
            .exec((err, result) => {
                if(err) return res.status(400).json({success:false, err})
                res.status(200).json({success:true})
            })
        
        
    }); 


    router.post('/upDislike', (req, res) => {
        let variable = {}
    
        if (req.body.videoId){
            variable= {videoId: req.body.videoId, userId: req.body.userId}
        }else {
            variable= {commentId: req.body.commentId, userId: req.body.userId}
        }

        //dislike collection에 클릭 정보 넣어주기
        const dislike = new Like(variable)
        dislike.save((err, dislikeresult)=>{
            if(err) return res.json({success:false, err})
    
                //like이 이미 클릭되어있을 때 like -1
                Like.findOneAndDelete(variable)
                    .exec((err,likeResult)=>{
                        if(err) return res.status(400).json({success:false, err})
                        res.status(200).json({success:true})
                    })
        }) 
    });

module.exports = router;
