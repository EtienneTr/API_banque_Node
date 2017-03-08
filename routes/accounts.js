const express     = require('express');
const router      = express.Router();
const User        = require('../model/user');
const Account     = require('../model/account');
const Transaction = require('../model/transaction');
const passport    = require('passport');
const verify      = require('./verify');

router.post('/transfer/:fromAccountId/:toAccountId', verify.verifyUser, verify.verifyUserAccount, function (req, res) {
    const amount = parseInt(req.body.amount);
    Account.findOne({'_id': req.params.fromAccountId}).then(function (fromAccount) {
        if(fromAccount.balance < amount){
            res.status(401).json({status: 401, message: 'You don\'t have enough money on your account'});
        }
        else{
            Account.findOne({'_id': req.params.toAccountId}).then(function (toAccount) {
                toAccount.balance   += amount;
                fromAccount.balance -= amount;

                let fromTransaction = new Transaction({
                    amount: -amount,
                    concerned: fromAccount._id
                });

                let toTransaction = new Transaction({
                    amount: amount,
                    concerned: fromAccount._id
                });

                fromTransaction.save(function (err) {
                    toTransaction.save(function (err) {
                        toAccount.history.push(toTransaction);
                        fromAccount.history.push(fromTransaction);

                        toAccount.save(function (err) {
                            if(err){
                                res.json(err);
                                return;
                            }
                            fromAccount.save(function (err) {
                                if(err){
                                    res.json(err);
                                    return;
                                }
                                res.status(200).json({status: 200, message: 'Transfer successful'});
                            })

                        });
                    })
                });
            });
        }
    });
});

router.get('/:accountId', verify.verifyUser, verify.verifyUserAccountGet, function (req, res) {
    Account.findOne({'_id': req.params.accountId}).populate('history').then(function (account) {
        res.status(200).json({status: 200, account: account});
    }, function (err) {
        res.json(err);
    })
});

module.exports = router;