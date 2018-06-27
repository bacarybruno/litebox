'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  displayName: {
    type: Schema.Types.String,
    required: 'name to be displayed is required !!'
  },
  email: {
    type: Schema.Types.String,
    required: 'email is required !!'
  },
  password: {
    type: Schema.Types.String,
    required: 'password is required !!'
  },
  photoURL: {
    type: Schema.Types.String
  },
  providerId: {
    type: Schema.Types.String,
    default: "app"
  }
}, {timestamps: true});

module.exports = mongoose.model('User_Doc', UserSchema);