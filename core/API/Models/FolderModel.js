'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FolderSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User_Doc',
    required: 'Owner must be speciefed !!'
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Folder_Doc'
  },
  name: {
    type: Schema.Types.String,
    required: 'Folder Name is required !!'
  },
  size: {
    type: Schema.Types.Number,
    default: 0
  },
  shared: {
    type: Schema.Types.Boolean,
    default: false
  },
  // createdDate: {   type: Schema.Types.Date,   default: Date.now },
  // lastModifiedDate: {   type: Schema.Types.Date,   default: Date.now }
}, {timestamps: true});

module.exports = mongoose.model('Folder_Doc', FolderSchema);