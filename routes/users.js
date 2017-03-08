const express   = require('express');
const router    = express.Router();
const User      = require('../model/user');
const passport  = require('passport');
const verify    = require('./verify');
const Account   = require('../model/account');

router.get('/', function(req, res) {
    res.json({
        'status': 200,
        'message': 'Welcome to LTB bank !'
    });
});

router.get('/customers', verify.verifyUser, function(req, res) {
    User.find({'role' : 'customer'}).populate('accounts').then(function (customers) {
        res.json({customers: customers});
    }, function (err) {
        console.log(err);
    });
})

router.get('/all', verify.verifyUser, verify.verifyUserAdmin, function(req, res) {
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

router.get('/:username', verify.verifyUser, function(req, res) {
    User.findOne({'username': req.params.username}).populate('accounts').then(function (user) {
        res.status(200).json({status: 200, user: user});
    }, function (err) {
        console.log(err);
    });
});

router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        req.logIn(user, function (err) {
            if(err){
                res.status(401).json({status: 401, message: "Username or password invalid"});
                return;
            }
            let token = verify.getToken(user);
            res.status(200).json({status: 200, message: "Authorized", username: user.username, token: token});
        })
    })(req, res, next);
});

router.post('/register', function(req, res) {
    User.register(new User({
        mail: req.body.mail,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        role: req.body.role
    }), req.body.password, function (err, user) {
        if (err) {
            res.status(500).json({status: 500, message: err.message});
            return;
        }
        new Account({
            type: 'Checking account',
            balance: 5000,
            history: []
        }).save().then(function (account1) {
            new Account({
                type: 'Checking account',
                balance: 5000,
                history: []
            }).save().then(function (account2) {
                user.accounts = [account1, account2];
                user.save();
                res.status(200).json({status: 200, user: user});
            });

        });
    });
});

router.put('/:username', verify.verifyUser, function (req, res, next) {
    User.findOne({'username' : req.params.username}).then(function (user) {
        if(req.body.mail)      user.mail      = req.body.mail;
        if(req.body.firstname) user.firstname = req.body.firstname;
        if(req.body.lastname)  user.lastname  = req.body.lastname;
        if(req.body.username)  user.username  = req.body.username;

        user.save(function (err, user) {
            if(err) {
                res.json(err.message);
                return;
            }
            res.status(200).json({status: 200, message: "user successfully updated", user: user});
        });
    }, function (err) {
        console.log(err);
    });
});

module.exports = router;