let express   = require('express');
let router    = express.Router();
let User      = require('../model/user');
let passport  = require('passport');
let verify    = require('./verify');

router.get('/', function(req, res, next) {
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
});

router.get('/:username', verify.verifyUser, function(req, res) {
    User.find({'username': req.params.username}).then(function (user) {
        res.status(200).json({status: 200, user: user[0]});
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
    User.register( new User({
        mail: req.body.mail,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        role: req.body.role
    }), req.body.password, function (err, user) {
        if(err){
            res.status(500).json({status: 500, message: err.message});
            return;
        }
        res.status(200).json({status: 200, user: user});
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
            res.status(200).json({status: 200, message: "user succesfully updated", user: user});
        });
    }, function (err) {
        console.log(err);
    });
});

module.exports = router;