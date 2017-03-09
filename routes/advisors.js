const express     = require('express');
const router      = express.Router();
const User        = require('../model/user');
const verify      = require('./verify');

router.put('/:customerId', verify.verifyToken, verify.verifyAdvisor, function (req, res) {
    User.findOne({'username' : req.decoded._doc.username}).then(function (advisor) {
        if (advisor.advised.indexOf(req.params.customerId) < 0) {
            advisor.advised.push(req.params.customerId);
            advisor.save(function (err, advisor) {
                res.status(200).json({
                    status: 200,
                    message: 'User successfully added to the advised list',
                    advisor: advisor
                });
            });
        }
        else {
            res.status(200).json({status: 200, message: 'User is already in the advised list'});
        }
    });
});

router.delete('/:customerId', verify.verifyToken, verify.verifyAdvisor, function (req, res) {
    User.findOne({'username' : req.decoded._doc.username}).then(function (advisor) {
        if (advisor.advised.indexOf(req.params.customerId) > 0) {
            advisor.advised.splice(advisor.advised.indexOf(req.params.customerId), 1);
            advisor.save(function (err, advisor) {
                res.status(200).json({
                    status: 200,
                    message: 'User successfully removed to the advised list',
                    advisor: advisor
                });
            });
        }
        else {
            res.status(200).json({status: 200, message: 'User isn`\'t in the advised list'});
        }
    });
});

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