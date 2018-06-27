'use strict';

var mongoose = require('mongoose'),
  Folder_doc = mongoose.model('Folder_Doc'),
  File_doc = mongoose.model('File_Doc'),
  config = require("../config/database");

var Helper = {
  upload: require('../Helpers/Download').upload,
  download_a_file: require('../Helpers/Download').download_a_file,
  delete_a_file: require('../Helpers/Download').delete_a_file,
  rename_a_file: require('../Helpers/Download').rename_a_file,
  findPath: require('../Helpers/Download').findPath
};

var im = require('imagemagick');

const dir = require("../Config/database").storageDir;
  
const h = require("../Helpers/Common");
const sendError = h.sendError,
  sendSuccess = h.sendSuccess;

exports.getPath = function(parentId, FileName, CallBack) {
  Folder_doc.findOne({ _id: parentId }, function (err, folder) {

    if (err || !folder ){
      if( !folder) CallBack("Folder not found !!", null); 
      CallBack(err, null); 
      return;
    }

    CallBack(null, folder.path + FileName);
  });
}

exports.list_all_files = function (folderId, CallBack) {
  File_doc.find({ parentId: folderId }, function (err, files) {
    if (err)  return CallBack(err, null);
    return CallBack(null, files);
  });
};

exports.create_a_file = function (req, res) {
  var new_file = new File_doc(req.body.file);
  if (!new_file.parentId || !new_file.name) 
    return sendError({err: "something is missing !!"}, res);

  new_file.owner = req.user.userId;

  Helper.upload(req.body.file.content, req.body.sourcePath + new_file.name, (ex) => {
    if(ex) return sendError(ex, res);
    const sourceFile = `${dir}${req.body.sourcePath}${new_file.name}[0]`;
    const destImg = `${dir}previews/${new_file._id}.png`;
    new_file.save(function(err, file) {
      if (err)  return sendError(err, res);
      res.json({success: true, data: {file}});
    });  
    // create preview
    im.convert(["-density", " 300", "-trim", sourceFile, "-quality", "100", destImg], (err, stdout) => {
      if (err) console.log(err.message);
    });
    // new_file.save(function(err, file) {
    //   if (err)  return sendError(err, res);
    //   res.json({success: true, data: {file}});
    // }); 
  });
};

exports.read_a_file = function (req, res) {
  File_doc.find({ _id: req.params.fileRef }, function (err, file) {
    if (err) return sendError(err, res);
    return res.json({success: true, data: {file}});
  });
};

exports.update_a_file = function (req, res) {
  File_doc.findOne( {$and: [{ _id: req.params.fileId }, {owner: req.user.userId}]},
    function (err, file) {
      if (err || !file) return sendError((err) ? err : "File Not Found !!", res);

      if(req.body.sourcePath && req.body.destPath)
        exports.moveFile(file, req, res);
      else if(req.body.name)
        exports.renameFile(file, req,res);
  });  
};

exports.renameFile = function(file, req, res){
  var oldPath = req.body.sourcePath + file.name;
  var newName = req.body.name + '.' + (file.name.split('.')[1]);
  var newPath = req.body.sourcePath + newName;
  Helper.rename_a_file(oldPath, 
    newPath, // get new Path with new Name
    (err) => {
      if(err) return sendError(err, res);
      file.name = newName;
      file.save((err) => {
        if(err || !file) return sendError( (err) ? err : "File not Found !!", res);
        return res.json({success:true, data: {file}});    
      });  
    });
}

exports.moveFile = function(file, req, res) {  
  Helper.rename_a_file(req.body.sourcePath + file.name, 
    req.body.destPath + file.name,
    (err) => {
      if(err) return sendError(err, res);
      
      file.parentId = req.body.parentId;
      file.save( (err) =>{
        if(err || !file) return sendError( (err) ? err : "File not Found !!", res);
        return res.json({success:true, data: {file}});    
      });  
    });      
};

exports.delete_a_file = function (req, res) {
  File_doc.findOne( {$and: [{ _id: req.params.fileId }, {owner: req.user.userId}]}, function (err, file) {
    if (err) return sendError(err, res);

    Helper.findPath(file.parentId, file.name, (err, path) => {
      Helper.delete_a_file(path, (err) => {
        if(err) return sendError(err, res);
        Helper.delete_a_file( `${config.storageDir}previews/${file._id}.png`, (err) => {
          file.remove((err) => {
            return res.json({ success: true, data: {file}});
          });
        });
      });
    });

  });
};

exports.download_a_file = function(req, res){
  File_doc.findOne( {$and: [{ _id: req.params.fileId }, {owner: req.user.userId}]}, function (err, file) {
    if(err || !file)
      return sendError((err) ? err : "file does not exists !!", res);

      Helper.findPath(file.parentId, file.name, (err, path) => {
        if(err) return sendError(err,res);
        return res.download( dir + path);
      });
  });
};

exports.view_a_file = function(req, res){
  File_doc.findOne({ _id: req.params.fileId }, function (err, file) {
    if(err || !file)
      return sendError((err) ? err : "file does not exists !!", res);

      Helper.findPath(file.parentId, file.name, (err, path) => {
        if(err) return sendError(err,res);
        return res.sendFile( dir + path);
      });
  });
};

exports.renameFilePath = function(oldPath, newName){
  oldPath = oldPath.split("/")
      .map( (val) => {return val.split(".")});
  var temp = oldPath.pop();

  temp[0] = newName;

  return {
    path:(oldPath.join("/") + "/" + temp.join('.')),
    ext: temp[1]
    };
}