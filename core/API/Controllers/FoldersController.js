'use strict';
var fs = require('fs');
var mongoose = require('mongoose'),
  Folder_doc = mongoose.model('Folder_Doc'),
  File_doc = mongoose.model('File_Doc');

mongoose.Promise = Promise;

var FileController = require("../Controllers/FilesController");

let Helper = {
  make_a_dir: require('../Helpers/Download').make_a_dir,
  delete_a_dir: require('../Helpers/Download').delete_a_dir,
  rename_a_folder: require('../Helpers/Download').rename_a_file,
  Download_a_folder: require('../Helpers/Download').Download_a_folder,
  findPath: require('../Helpers/Download').findPath
}

var dirTree = require('directory-tree');
  
const dir = require("../Config/database").storageDir;

const h = require("../Helpers/Common");
const sendError = h.sendError,
  sendSuccess = h.sendSuccess;

exports.getPath = function(ParentFolder, FolderName, CallBack) {
  Folder_doc.findOne({ _id: ParentFolder }, function (err, folder) {
    if (err) CallBack(err, null);
    CallBack(null, folder.path + "" + FolderName + "/");
  });
}

exports.list_all_folders = function (folderId, CallBack) {
  Folder_doc.find({ parentId: folderId }, function (err, folder) {
    if (err) return CallBack(err, null);
    return CallBack(null, folder);
  });
};

exports.create_a_folder = function (req, res) {
    var new_folder = new Folder_doc(req.body);
    if (!new_folder.parentId || !new_folder.name) 
      return sendError("Something went Worng", res);
    
    exports.save_a_folder(new_folder, req.body.sourcePath, req.user.userId, (err, folder) => {
      if(err) return sendError(err, res);
      return res.json({success: true, data: {folder}});
    });
};

exports.save_a_folder = function(folder, path, userId, CallBack){  
  Helper.make_a_dir(path + folder.name, (err, made) => {
    if(err) return CallBack(err, null);
    
    folder.owner = userId;
    // saving the folder
    folder.save(function (err, f) {
      if (err) return CallBack(err, null);        
      return CallBack(null, f);
    });
  
  });
}

exports.read_a_folder = function (req, res) {
  Folder_doc.findOne({ _id: req.params.folderRef }, function (err, folder) {
    if (err) return sendError(err, res);
    res.json({success: true, data: {folder}});
  });
};

exports.update_a_folder = function (req, res) {

  Folder_doc.findOne({ $and: [{ _id: req.params.folderId }, {owner: req.user.userId}] }, function (err, folder) {
    if (err) return sendError(err, res);
    if(req.body.name)
      return exports.renameFolder(folder, req, res);
    else if(req.body.sourcePath && req.body.destPath)
      return exports.moveFolder(folder, req, res);

  });

};

exports.renameFolder = function(folder, req, res){
  Helper.rename_a_folder(req.body.sourcePath + folder.name, req.body.sourcePath + req.body.name, (err) => {
    if (err) return sendError(err, res);
      
    folder.name = req.body.name;
    folder.save(function (err, folder) {
      if (err) return sendError(err, res);

      return res.json({success: true, data: {folder}});
    });
  });
}

exports.moveFolder = function(folder, req, res){
  Helper.rename_a_folder(req.body.sourcePath + folder.name, req.body.destPath + folder.name, (err) => {
    if(err) return sendError(err, res);

    folder.parentId = req.body.parentId;
    folder.save((err) => {
      return res.json({success: true, data: {folder}});
    });
  });

};

exports.delete_a_folder = function (req, res) {
  Folder_doc.findOne({ $and: [{ _id: req.params.folderId }, {owner: req.user.userId}] }, function (err, folder) { 
    if (err || !folder ) 
      return sendError( (err) ? err : "Folder not found !!", res);

    Helper.findPath(folder.parentId, folder.name, (err, path) => {
      Helper.delete_a_dir( path, (err) => {
        if(err) return sendError(err, res);
        exports.deleteOnCascade(folder._id, (err, status) => {
          if(err) return sendError(err, res);
          return res.json({success: true, data:{message: "Deletion was OK !!"}})
        });

      });
    });
  });
};

function findIdsOnCascade(folderId, files, folders, cb) {
  folders.push(folderId);
  let fileChildren = File_doc.find({parentId: folderId}).exec()
  .then(resFiles => {
    resFiles.forEach(file => {
      files.push(file._id);
    });
    return Folder_doc.find({parentId: folderId}).exec();    
  }).then(resFolder => {
    if (resFolder && resFolder.length === 0) cb();
    resFolder.forEach(folderChild => {
      findIdsOnCascade(folderChild._id, files, folders);
    });
  });

}

exports.deleteOnCascade = function(folderId, CallBack){
  let files = [];
  let folders = [];
  findIdsOnCascade(folderId, files, folders, () => {
    let filesPromise = File_doc.deleteMany({_id: {$in: files}}).exec();
    let folderPromise = Folder_doc.deleteMany({_id: {$in: folders}}).exec();

    Promise.all([filesPromise, folderPromise]).then(() => {
      CallBack(null, [files, folders]);
    }).catch((err) => {
      CallBack(err, null);
    });
  });
}

exports.get_childrens = function(req, res){
  var result = {folders:[], files:[]};
    
  exports.list_all_folders(req.params.folderId, (err, folders) => {
      if(err) return sendError(err, res);
      result.folders = folders; 

      FileController.list_all_files(req.params.folderId, (err, files) => {
          if(err) return sendError(err, res);
          result.files = files;
          return res.json({success: true, data: {result}});
      });
  });
}

exports.download_a_folder = function(req, res){
  Folder_doc.findOne( {$and: [{ _id: req.params.folderId }, {owner: req.user.userId}]}, function (err, folder) {
    if(err || !folder)
      return sendError((err) ? err : "folder does not exists !!", res);
    let folderName = folder.name + ".zip";
    if(folder.name.includes("default"))
      Helper.Download_a_folder(folder.owner + "/", folderName, (result) => {
        return res.download(result, (err) => {
          fs.unlink(result);
        });
      });
    else
      Helper.findPath(folder._id, folder.name, (err, path) => {
        console.log(path, path.slice(0, -folder.name.length));
        Helper.Download_a_folder(path.slice(0, -folder.name.length), folderName, (result) => {
          return res.download(result, folderName, (err) => {
            fs.unlink(result, () => {});
          });
        });
      });
  });
};
