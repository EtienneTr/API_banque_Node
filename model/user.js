var mongoose              = require('mongoose');
var Schema                = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var Account               = require('./account');

var User = new Schema({
    mail: {
        type: String,
        unique: true
    },
    firstname: String,
    lastname: String,
    username: {
        type: String,
        unique: true
    },
    password: String,
    role: {
        type: String,
        enum: ['admin', 'advisor', 'customer']
    },
    accounts: [{type: Schema.Types.ObjectId, ref: 'Account', default: []}],
    advised: [{type: Schema.Types.ObjectId, ref: 'Customer', default: []}]
});

User.plugin(passportLocalMongoose);

var userModel     = mongoose.model('User', User);

userModel.find({}).then(
    function(customers) {

        if (customers.length == 0) {
            new Account({
                type: 'Checking account',
                balance: 1,
                history: []
            }).save().then(function(account1){
                new Account({
                    type: 'Checking account',
                    balance: 1,
                    history: []
                }).save().then(function(account2){
                    var customer1 = new userModel({
                        mail: 'toto@toto.toto',
                        firstname: 'Jean',
                        lastname: 'Burellier',
                        username: 'burellier',
                        phoneNumber: '0611223344',
                        gender: 'M',
                        birthDate: Date.now(),
                        role: 'customer',
                        accounts: [
                            account1,
                            account2
                        ]
                    });
                    // console.log(customer1);
                    userModel.register(customer1, 'azerty', function (err, customer1) {
                        new Account({
                            type: 'Checking account',
                            balance: 1,
                            history: []
                        }).save().then(function(account1){
                            new Account({
                                type: 'Checking account',
                                balance: 1,
                                history: []
                            }).save().then(function(account2){
                                userModel.register(new userModel({
                                    mail: 'tete@tete.tete',
                                    firstname: 'Jean',
                                    lastname: 'Burellier',
                                    username: 'jean',
                                    phoneNumber: '0611223344',
                                    gender: 'M',
                                    birthDate: Date.now(),
                                    role: 'customer',
                                    accounts: [
                                        account1,
                                        account2
                                    ]
                                }), 'azerty', function(err, customer2){
                                    userModel.register(new userModel({
                                        mail: 'tata@tata.tata',
                                        firstname: 'Sebouninet',
                                        lastname: 'Foray',
                                        username: 'miniForay',
                                        phoneNumber: '0611223344',
                                        gender: 'M',
                                        advised: [customer1, customer2],
                                        birthDate: Date.now(),
                                        role: 'advisor'
                                    }), 'azerty', function () {});

                                });
                            })
                        });
                    });
                })
            });

            userModel.register(new userModel({
                mail: 'tutu@tutu.tutu',
                firstname: 'Roger',
                lastname: 'Colvray',
                username: 'admin',
                phoneNumber: '0611223344',
                gender: 'F',
                birthDate: Date.now(),
                role: 'admin'
            }), 'admin', function(){});
        }
    });

module.exports = userModel;