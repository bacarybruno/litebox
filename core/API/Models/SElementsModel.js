'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SElementsSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User_Doc",
    required: "owner is required !!!"
  },
  elementId: {
    type: Schema.Types.ObjectId,
    required: "id is required !!!"
  },
  type: {
    type: Schema.Types.String,
    required: "type is required !!!"
  }
});

module.exports = mongoose.model('SElements_Doc', SElementsSchema);