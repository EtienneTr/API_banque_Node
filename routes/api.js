var express  = require('express');
var router   = express.Router();
var User     = require('../model/user');
var passport = require('passport');
var verify   = require('../verify');

/*router.all('/*', verify.verifyUser, function (req, res, next) {
    next();
 });*/

router.get('/', function(req, res, next) {
    res.json({
       'status': 200,
        'message': 'Welcome !'
    });
});
router.get('/all', function(req, res, next) {
    User.find({}).then(function (user) {
        res.json({users: user});
    }, function (err) {
        console.log(err);
    });
});

router.post('/login', function (req, res, next) {
    console.log("toto");
    passport.authenticate('local', function (err, user, info) {
        console.log(err);
        req.logIn(user, function (err) {
            console.log(err);
            var token = verify.getToken(user);
            res.json(token);
        })
    })(req, res, next);
});

// router.post('/', function(req, res, next) {
//     var user = new User({
//         userName: req.body.username,
//         password: req.body.password,
//         mail: req.body.mail,
//         age: req.body.age
//     }).save();
// });

router.post('/', function(req, res, next) {
    User.register( new User({
        username: req.body.username,
        mail: req.body.mail,
        age: req.body.age
    }), req.body.password, function (err, user) {
        console.log(err);
        res.json(user);
    });
});

module.exports = router;
