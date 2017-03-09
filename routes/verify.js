let User    = require('../model/user');
let Account = require('../model/account');
let jwt     = require('jsonwebtoken');
let config  = require('../config');

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey);
};

exports.verifyToken = function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.secretKey, function(err, decoded) {
            if(err) {
                res.json(err);
            }
            else {
                req.decoded = decoded;
                next();
            }
        })
    }
    else {
        res.status(401).json({status: 401, message: "Unauthorized"});
    }
};

exports.verifyCustomer = function(req, res, next) {
    if (req.decoded._doc.role !== 'customer') {
        res.status(401).json({status: 401, message: "Unauthorized"});
    }
    else {
        next();
    }
};

exports.verifyAdvisedGet = function(req, res, next) {
    if (req.decoded._doc.advised.indexOf(req.params.customerId) < 0) {
        res.status(401).json({status: 401, message: "This user is not in your advised user"});
    }
    else {
        next();
    }
};

exports.verifyAdvisor = function(req, res, next) {
    console.log(req.decoded._doc);
    if (req.decoded._doc.role !== 'advisor') {
        res.status(401).json({status: 401, message: "Unauthorized"});
    }
    else {
        next();
    }
};

exports.verifyAdmin = function(req, res, next) {
    if(req.decoded._doc.role !== 'admin'){
        next();
    }
    else {
        res.status(401).json({status: 401, message: "Unauthorized"});
    }
};

exports.verifyUserAccount = function(req, res, next) {
    User.findOne({'username' : req.decoded._doc.username}).populate('accounts').then(function (user) {
        let accountOwned = false;
        for(let account of user.accounts){
            if(account._id == req.params.fromAccountId){
                accountOwned = true;
                next();
            }
        }
        if(!accountOwned) {
            res.status(401).json({
                status: 401,
                message: 'You are not allowed to transfer from an account that you don\'t own'
            });
        }
    }, function (err) {
        console.log(err);
    });
};

exports.verifyAccountGet = function(req, res, next) {
    console.log(req.decoded._doc);
    switch (req.decoded._doc.role) {
        case 'customer':
            User.findOne({'username': req.decoded._doc.username}).populate('accounts').then(function (user) {
                let accountOwned = false;
                for (let account of user.accounts) {
                    if (account._id == req.params.accountId) {
                        accountOwned = true;
                        next();
                    }
                }
                if (!accountOwned) {
                    res.status(401).json({
                        status: 401,
                        message: 'You don\'t own this account'
                    });
                }
            }, function (err) {
                console.log(err);
            });
            break;
        case 'advisor':
            User.findOne({'username': req.decoded._doc.username}).populate('advised').then(function (advisor) {
                let authorized = false;
                for (let user of advisor.advised) {
                    for (let accountId of user.accounts) {
                        if (req.params.accountId == accountId) {
                            accountOwned = true;
                            next();
                        }
                    }
                }
                if (!accountOwned) {
                    res.status(401).json({
                        status: 401,
                        message: 'You don\'t own this account'
                    });
                }
            });
            break;

        default:
            res.status(401).json({
                status: 401,
                message: 'You don\'t own this account'
            });
    }
};