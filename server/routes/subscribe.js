const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");
const { Subscriber } = require("../models/Subscriber");


//=================================
//             Subscribe
//=================================

router.post('/subscriberNumber', (req, res) => {
    
    Subscriber.find({'userTo': req.body.userTo})
    .exec((err,subscribe)=>{
        if(err) return res.status(400).send(err);
        return res.status(200).json({success:true, subscriberNumber:subscribe.length})
    })
});

router.post('/subscribed', (req, res) => {
    
    Subscriber.find({'userTo':req.body.userTo, 'userFrom':req.body.userFrom})
    .exec((err, subscribe)=>{
        if(err) return res.status(400).send(err);
        let result = false
        if(subscribe.length !==0){
            result = true
        }
        res.status(200).json({success:true, subscribed:result})
    })
});


router.post('/unsubscribe', (req, res) => {
    
    Subscriber.findOneandDelete({userTo:req.body.userTo, userFrom:req.body.userFrom})
    .exec((err, doc)=>{
        if(err)return res.status(400).json({success:false, err})
        res.status(200).json({success:true, doc})
    })
});

router.post('/subscribe', (req, res) => {
    
    //make instance to save the subscriber
    const subscribe = new Subscriber(req.body)
    subscribe.save((err, doc)=>{
        if(err) return res.status(400).json({success:false, err})
        res.status(200).json({success:true})
    })
});


module.exports = router;
