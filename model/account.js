const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const Account = new Schema({
    type: {
        type: String,
        enum: ['Checking account', 'Savings account'],
        default: 'Checking account'
    },
    balance:{
        type: Number,
        default: 1000000
    },
    releaseDate: Date,
    history: [{type: Schema.Types.ObjectId, ref: 'Transaction', default: []}]
});

module.exports = mongoose.model('Account', Account);