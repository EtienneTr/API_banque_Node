var mongoose              = require('mongoose');
var Schema                = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var Account               = require('./account');
var extend                = require('mongoose-schema-extend');

var User = new Schema({
    mail: {
        type: String,
        unique: true
    },
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    phoneNumber: String,
    gender:  {
        type: String,
        enum: ['M', 'F']
    },
    birthDate : Date,
    role: {
        type: String,
        enum: ['admin', 'advisor', 'customer']
    }
});

User.plugin(passportLocalMongoose);

var Customer = User.extend({
    accounts: [{type: Schema.Types.ObjectId, ref: 'Account', default: []}]
});

var Advisor = User.extend({
    advised: [{type: Schema.Types.ObjectId, ref: 'Customer', default: []}]
});

var customerModel = mongoose.model('Customer', Customer);
var userModel     = mongoose.model('User', User);
var advisorModel  = mongoose.model('Advisor', Advisor);

customerModel.find({}).then(
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
                    var customer1 = new customerModel({
                        mail: 'toto@toto.toto',
                        firstName: 'Jean',
                        lastName: 'Burellier',
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
                    customerModel.register(customer1, 'azerty', function (err, customer1) {
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
                                customerModel.register(new customerModel({
                                    mail: 'tete@tete.tete',
                                    firstName: 'Jean',
                                    lastName: 'Burellier',
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
                                    advisorModel.register(new advisorModel({
                                        mail: 'tata@tata.tata',
                                        firstName: 'Sebouninet',
                                        lastName: 'Foray',
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
                firstName: 'Roger',
                lastName: 'Colvray',
                username: 'admin',
                password: 'azerty',
                phoneNumber: '0611223344',
                gender: 'F',
                birthDate: Date.now(),
                role: 'admin'
            }), 'azerty', function(){});
        }
    });

module.exports.User     = userModel;
module.exports.Customer = customerModel;
module.exports.Advisor  = advisorModel;