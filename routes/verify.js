let User    = require('../model/user');
let Account = require('../model/account');
let jwt     = require('jsonwebtoken');
let config  = require('../config');

exports.getToken = function(user) {
	return jwt.sign(user, config.secretKey);
};

exports.verifyUser = function(req, res, next) {
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