// var User = require('./users');
var jwt = require('jsonwebtoken');
var config = require('../config');

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
		res.status(401).json({status: 401, message: "Unauthorized", information: "my message"});
	}
};