'use strict';

var mongoose = require('mongoose'),
  jwt = require("jsonwebtoken"),
  mkdirp = require('mkdirp'),
  secret = require("../config/database").secret,
  Folder_doc = mongoose.model('Folder_Doc'),
  File_Doc = mongoose.model('File_Doc'),
  User_doc = mongoose.model('User_Doc');

const h = require("../Helpers/Common");
const sendError = h.sendError,
  sendSuccess = h.sendSuccess;

const Helper = {
  make_a_dir: require('../Helpers/Download').make_a_dir,
  findPath: require('../Helpers/Download').findPath
};

const FolderController= {save_a_folder: require("./FoldersController").save_a_folder};

let generateToken = (userId) => jwt.sign({ userId }, secret, { expiresIn: '7d' });

exports.list_all_users = function (req, res) {
  User_doc.find({}, function (err, user) {
    if (err) return sendError(err, res);
    return sendSuccess(user, res);
  });
};

exports.login_a_user = function (req, res) {
  User_doc.findOne({ $and: [{ email: req.body.email }, { password: req.body.password }] }, function (err, user) {
    if (err || !user) return sendError( (err) ? err : "user not found !! ", res);
  
    let token = generateToken(user._id);
    return res.json({ success: true, data:{token}});
  });
};

exports.read_a_user = function (req, res) {
  User_doc.findOne({ _id: req.user.userId }, function (err, user) {
    if (err) return res.json({ success: false, data: { message: err } });
    if (!user) return res.json({ success: false, data: { message: "user not Found !!" } });    

    user.password = null;

    Folder_doc.findOne({ $and : [{owner: req.user.userId},{parentId: null}]}, function (err, folder) {
      if (err) return sendError(err, res);
      var result = JSON.parse(JSON.stringify(user));
      result.rootFolder = folder._id;

      File_Doc.find({ owner: req.user.userId }, (err, files) => {
        let currentSize = 0;
        files.forEach(f => {
          currentSize += f.size;
        });
        result.currentSize = currentSize;
        result.totalSize = 30 * 1024 * 1024 * 1024;
        return res.json({ success: true, data: result });
      });

    });

  });
};

exports.update_a_user = function (req, res) {
  User_doc.findOneAndUpdate({ _id: req.user.userId }, req.body, { new: true }, function (err, user) {
    if (err) return res.json({ success: false, data: { message: err } });
    res.json({ success: true, date: user });
  });
};

exports.delete_a_user = function (req, res) {
  User_doc.findOneAndRemove({ _id: req.params.userId }, function (err, user) {
    if (err) return res.json({ success: false, data: { message: err } });
    res.json({ success: true, message: 'user successfully deleted' });
  });
};

exports.create_a_user = function (req, res) {
  var new_user = new User_doc(req.body);
  User_doc.findOne({ email: new_user.email }, function (err, user) {

    if (user)
      return res.json({ success: false, data: { message: "mail adress already exists !!" } });

    new_user.save(function (err, user) {
      if (err) return res.json({ success: false, data: { message: err } });
      var new_folder = new Folder_doc({
        owner: user._id,
        name: "default"
      });
      
      FolderController.save_a_folder(new_folder, user._id + "/", user._id, (err, folder) => {            
        if(err || !folder) return sendError( (!folder) ? err : "Folder could not be created !!" , res);

        let token = generateToken(user._id);
        res.json({ success: true, data: { token } });
      });
    }); 
  });
};
