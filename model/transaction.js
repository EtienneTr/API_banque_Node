var mongoose              = require('mongoose');
var Schema                = mongoose.Schema;

var Transaction = new Schema({
    date: Date,
    amount: Number,
    receiver: {type: Schema.Types.ObjectId, ref: 'Account', default: {}}
});

module.exports = mongoose.model('Transaction', Transaction);