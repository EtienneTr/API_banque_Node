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

router.get('/:username', verify.verifyToken, function(req, res) {
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
            res.status(200).json({status: 200, message: "Authorized", username: user.username, role: user.role, token: token});
        })
    })(req, res, next);
});

router.post('/register', function(req, res) {
    User.register(new User({
        mail: req.body.mail,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        role: 'customer'
    }), req.body.password, function (err, user) {
        if (err) {
            res.status(500).json({status: 500, message: err.message});
            return;
        }
        new Account({
            type: 'Checking account',
            releaseDate: Date.now(),
            balance: 5000,
            history: []
        }).save().then(function (account1) {
            new Account({
                type: 'Savings account',
                releaseDate: Date.now(),
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

router.put('/:username', verify.verifyToken, function (req, res, next) {
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

router.post('/upgrade', verify.verifyToken, verify.verifyAdmin, function (req, res) {
   User.find({'_id': req.body.customerId}).then(function (user) {
       if(user.role !== 'user'){
           res.status(401).json({status: 401, message: 'Only customers can only be upgraded to advisor'});
           return;
       }
       user.role = 'advisor';
       user.accounts = [];
       user.save(function (err, user) {
          res.status(200).json({status: 200, user: user});
       });

   }, function (err) {
       console.log(err);
   })
});

module.exports = router;