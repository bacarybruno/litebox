var router = require('express').Router();

var authenticatedRoutes = require("./authenticated");
var unAuthenticatedRoutes = require("./unauthenticated");
var SElementsHandler = require("./SharedElements");

router.use("/authenticated", authenticatedRoutes);
router.use("/unauthenticated", unAuthenticatedRoutes);
router.use("/share", SElementsHandler);

module.exports = router;

/*
app.route('/moderator/Users')
  .get(Users_coll.list_all_users)
  .delete(Users_coll.delete_a_user);

app.route('/authenticated/User/profile')
  .put(Users_coll.update_a_user)
  .get(Users_coll.read_a_user)

app.route('/unauthenticated/user/login/')
  .get(Users_coll.login_a_user)

app.route('/unauthenticated/user/register/')
  .post(Users_coll.create_a_user)

// Download File
app.route('/API/File/Download')
  .post(Download_Addon.Download_a_file);
app.route('/API/File/Upload')
  .post(Download_Addon.Upload_a_file);

// FilesList Routes
app.route('/API/Files/:folderRef')
  .get(Files_Coll.list_all_files);

app.route('/API/File/:fileRef')
  .get(Files_Coll.read_a_file)
  .put(Files_Coll.update_a_file)
  .post(Files_Coll.create_a_file)
  .delete(Files_Coll.delete_a_file);

// FoldersList Routes
  !
// Download Folder (zipped)
app.route('/API/Folder/Download/:folderRef')
.post(Download_Addon.Download_a_folder);

app.route('/API/Folders/:Owner')
.get(Folders_Coll.list_all_folders)

app.route('/API/Folder/:folderRef')
.get(Folders_Coll.read_a_folder)
.put(Folders_Coll.update_a_folder)
.post(Folders_Coll.create_a_folder)
.delete(Folders_Coll.delete_a_folder);

app.route('/API/Folder/Child/:folderRef')
.get(Folders_Coll.list_all_children)
//.delete(Folders_Coll.delete_a_Child)
//.post(Folders_Coll.add_a_Child);

// SharedElements Routes
app.route('/API/Elements')
  .get(SElements_Coll.list_all_elements)
  .post(SElements_Coll.add_an_element);

app.route('/API/Elements/:elementId')
  .get(SElements_Coll.find_an_element)
  .put(SElements_Coll.update_an_element)
  .delete(SElements_Coll.delete_an_element);

  */