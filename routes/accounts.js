const express     = require('express');
const router      = express.Router();
const User        = require('../model/user');
const Account     = require('../model/account');
const Transaction = require('../model/transaction');
const verify      = require('./verify');


router.get('/all', verify.verifyUser, function (req, res) {
    User.find({}).populate('accounts').then(function (users) {
        let resArray = [];
        for(let user of users){
            for(let account of user.accounts){
                if(account.type == "Checking account"){
                    resArray.push({accountId: account._id, user: user.lastname + ', ' + user.firstname});
                }
            }
        }

        res.status(200).json({status: 200, accounts: resArray});
    });
});

router.get('/:accountId', verify.verifyUser, verify.verifyUserAccountGet, function (req, res) {
    Account.findOne({'_id': req.params.accountId}).populate('history').then(function (account) {
        res.status(200).json({status: 200, account: account});
    }, function (err) {
        res.json(err);
    })
});

router.post('/transfer/:fromAccountId/:toAccountId', verify.verifyCustomer, verify.verifyUser, verify.verifyUserAccount, function (req, res) {
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

module.exports = router;