var express   = require('express');
var router    = express.Router();
var Customer  = require('../model/user').Customer;
var passport  = require('passport');
var verify    = require('../verify');

router.get('/', function(req, res, next) {
    res.json({
       'status': 200,
        'message': 'Welcome !'
    });
});
router.get('/all', function(req, res, next) {
    Customer.find({}).populate('accounts').then(function (customers) {
        res.json({customers: customers});
    }, function (err) {
        console.log(err);
    });
});

router.post('/login', function (req, res, next) {
    Customer.findOne({$or : [{'username': 'burellier'}]}).then(function (customer) {
       // console.log(customer);
    }, function (err) {
        console.log(err);
    });

    passport.authenticate('local', function (err, user, info) {
        req.logIn(user, function (err) {
            if(err){
                res.json("Invalid credentials");
                return;
            }
            var token = verify.getToken(user);
            res.json(token);
        })
    })(req, res, next);
});

router.post('/', function(req, res, next) {
    var user = new User({
        userName: req.body.username,
        password: req.body.password,
        mail: req.body.mail,
        age: req.body.age
    }).save();
});

// router.post('/', function(req, res, next) {
//     User.register( new User({
//         username: req.body.username,
//         mail: req.body.mail,
//         age: req.body.age
//     }), req.body.password, function (err, user) {
//         console.log(err);
//         res.json(user);
//     });
// });

module.exports = router;
