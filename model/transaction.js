const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const Transaction = new Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    amount: Number,
    concerned: {type: Schema.Types.ObjectId, ref: 'Account', default: []}
});

module.exports = mongoose.model('Transaction', Transaction);