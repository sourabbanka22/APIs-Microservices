'use strict'

const shortid = require('shortid');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: [20, 'username too long']
  },
  _id: {
    type: String,
    default: shortid.generate
  }
});

module.exports = mongoose.model('NewUser', userSchema);
