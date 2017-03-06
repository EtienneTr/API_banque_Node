var express   = require('express');
var router    = express.Router();
var User      = require('../model/user');
var passport  = require('passport');
var verify    = require('./verify');

router.get('/', function(req, res, next) {
    res.json({
        'status': 200,
        'message': 'Welcome to LTB bank !'
    });
});

router.get('/all', verify.verifyUser, function(req, res, next) {
    User.find({'role' : 'customer'}).populate('accounts').then(function (customers) {
        res.json({customers: customers});
    }, function (err) {
        console.log(err);
    });
});

router.get('/user/:userName', verify.verifyUser, function(req, res, next) {
    User.find({'username': req.params.userName}).then(function (user) {
        res.status(200).json({status: 200, user: user});
    }, function (err) {
        console.log(err);
    });
});

router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        console.log(user);
        req.logIn(user, function (err) {
            console.log(err);
            var token = verify.getToken(user);
            res.status(200).json({status: 200, message: "Authorized", username: user.username, token: token});
        })
    })(req, res, next);
});

router.post('/register', function(req, res, next) {
    User.register( new User({
        mail: req.body.mail,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password,
        role: req.body.role
    }), req.body.password, function (err, user) {
        if(err){
            res.status(500).json({status: 500, message: err.message});
            return;
        }
        res.status(200).json({status: 200, user: user});
    });
});


module.exports = router;