let mongoose              = require('mongoose');
let Schema                = mongoose.Schema;

let Transaction = new Schema({
    date: Date,
    amount: Number,
    receiver: {type: Schema.Types.ObjectId, ref: 'Account', default: {}}
});

module.exports = mongoose.model('Transaction', Transaction);