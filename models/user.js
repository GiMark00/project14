const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    match: /https:\/\/\w+.\w+/i,
  },
  email: {
    type: String,
    required: true,
    match: /\w+@\w+.\w+/i,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
    match: /\w{10,}/i,
  },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);
