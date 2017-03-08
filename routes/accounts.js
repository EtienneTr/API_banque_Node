let express     = require('express');
let router      = express.Router();
let User        = require('../model/user');
let Account     = require('../model/account');
let Transaction = require('../model/transaction');
let passport    = require('passport');
let verify      = require('./verify');

router.get('/:accountId', verify.verifyUser, function (req, res) {

});

router.post('/transfer/:fromAccountId/:toAccountId', verify.verifyUserAccount, verify.verifyUserAccount, function (req, res) {
    Account.find({'_id': req.params.fromAccountId}).then(function (fromAccount) {
       if(fromAccount.balance < req.body.amount){
           res.status(401).json({status: 401, message: 'You don\'t have enough money on your account'});
       }
       else{
           Account.find({'_id': req.params.toAccountId}).then(function (toAccount) {
               toAccount.balance   += req.amount;
               fromAccount.balance -= req.amount;

               toAccount.save(function (err, fromAccount) {
                   if(err){
                       res.json(err);
                       return;
                   }
                   fromAccount.save(function (err, toAccount) {
                       if(err){
                           res.json(err);
                           return;
                       }
                       res.status(200).json({status: 200, message: 'Transfer successful'});
                   })

               });
           });
       }
    });
});

module.exports = router;