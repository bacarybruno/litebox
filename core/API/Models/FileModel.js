'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FileSchema = new Schema({
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Folder_Doc'
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User_Doc',
    required: 'Owner must be speciefed !!'
  },
  name: {
    type: Schema.Types.String,
    required: 'FileName is required !!'
  },
  size: {
    type: Schema.Types.Number,
    default: 0
  },
  type: {
    type: Schema.Types.String
  },
  shared: {
    type: Schema.Types.Boolean,
    default: false
  },
  // createdDate: {   type: Schema.Types.Date,   default: Date.now },
  // lastModifiedDate: {   type: Schema.Types.Date,   default: Date.now }
}, {timestamps: true});

module.exports = mongoose.model('File_Doc', FileSchema);