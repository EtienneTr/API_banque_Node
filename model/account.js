var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var Account = new Schema({
    type: {
        type: String,
        enum: ['Checking account', 'Savings account'],
        default: 'Checking account'
    },
    balance:{
        type: Number,
        default: 1000000
    },
    history: [{type: Schema.Types.ObjectId, ref: 'Transaction', default: []}]
});

module.exports = mongoose.model('Account', Account);