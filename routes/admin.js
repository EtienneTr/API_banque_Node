const express     = require('express');
const router      = express.Router();
const User        = require('../model/user');
const verify      = require('./verify');

router.put('/:advisorId/:customerId', verify.verifyToken, verify.verifyAdmin, function (req, res) {
    User.findOne({'_id' : req.decoded._doc.username}).then(function (advisor) {
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

router.delete('/:advisorId/:customerId', verify.verifyToken, verify.verifyAdmin, function (req, res) {
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

router.get('/all', verify.verifyToken, verify.verifyAdmin, function(req, res) {
    User.find({'role' : 'customer'}).then(function (customers) {
        User.find({'role' : 'advisor'}).populate('advised').then(function (advisors) {
            res.json({customers: customers, advisors: advisors});
        }, function (err) {
            console.log(err);
        });
    }, function (err) {
        console.log(err);
    });
});

module.exports = router;