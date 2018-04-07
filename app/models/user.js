/*jslint node: true */
'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  nickname: {type: String, required: true, index: true, unique: true}
});

userSchema.set('timestamps', true);
userSchema.plugin(uniqueValidator);

let User = mongoose.model('User', userSchema);

module.exports = User;
