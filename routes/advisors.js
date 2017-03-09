const express     = require('express');
const router      = express.Router();
const User        = require('../model/user');
const verify      = require('./verify');

router.get('/advised/:customerId', verify.verifyToken, verify.verifyAdvisor, verify.verifyAdvisedGet, function (req, res) {
    User.findOne({'_id': req.params.customerId}).populate('accounts').then(function (user) {
        res.status(200).json({status: 200, user: user});
    }, function (err) {
        console.log(err);
    });
});

router.get('/customers', verify.verifyToken, verify.verifyAdvisor, function (req, res) {
    User.findOne({'_id': req.decoded._doc._id}).populate('advised').then(function (user) {
        res.status(200).json({status: 200, advised: user.advised});
    }, function (err) {
        console.log(err);
    });
});

module.exports = router;