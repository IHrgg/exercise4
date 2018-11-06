const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const creditSchema = new Schema({
  amount: {type: Number, default: 0},
  lock: String,
  uuid: String,
  counter: Number
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Credit = mongoose.model('Credit', creditSchema);
module.exports = Credit;