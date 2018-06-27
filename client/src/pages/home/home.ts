import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {NavController, AlertController, PopoverController, Platform, ToastController} from 'ionic-angular';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { ReadMode } from 'ngx-file-helpers';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { MenuComponent } from '../../components/menu/menu';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({selector: 'page-home', templateUrl: 'home.html', changeDetection: ChangeDetectionStrategy.OnPush})
export class HomePage implements OnInit {

  readMode = ReadMode.dataURL; 
  loading = false;
  docs = {
    folders: [],
    files: []
  };
  folderStack = [];
	user: {
    _id: String,
		displayName: String,
		email: String,
		password: String,
    photoURL: String,
    rootFolder: String,
		providerId: "facebook.com" | "google.com" | "app"
  };
  moving = {
    isMoving: false,
    type: null,
    value: null,
    sourcePath: null,
    destPath: null,
    parentId: null
  };

  constructor(public navCtrl : NavController, private alertCtrl : AlertController, private httpService: HttpServiceProvider, private authService: AuthServiceProvider, private popoverCtrl: PopoverController, private changeDetectorRef: ChangeDetectorRef, public snackbar: ToastController, private socialSharing: SocialSharing, private plt: Platform) { }

  ngOnInit(): void {
    this.httpService.getUserProfile().subscribe((res: any) => {
      this.user = res.data;
      this.createSnackbar("INFO_WELCOME_BACK", { displayName: this.user.displayName.split(" ")[0] });
      this.navigateToChild({_id: this.user.rootFolder, name: "default"});
    });
  }

  currentFolder = () => this.folderStack[this.folderStack.length - 1];

  currentPath() {
    let path = `${this.user._id}/`;
    this.folderStack.forEach(folder => {
      path += folder.name + "/";
    });
    return path;
  }

  folderIsRoot = () => this.folderStack.length === 1;

  folderEmpty = () => this.docs.files.length === 0 && this.docs.folders.length === 0;

  createFolder() {
    this.httpService.translate.get(["NEW_FOLDER", "FOLDER_NAME", "OPT_CANCEL", "OPT_CONFIRM"]).subscribe(res => {
      let prompt = this
        .alertCtrl
        .create({
          title: res.NEW_FOLDER,
          inputs: [
            {
              name: 'value',
              placeholder: res.FOLDER_NAME
            }
          ],
          buttons: [
            {
              text: res.OPT_CANCEL
            }, {
              text: res.OPT_CONFIRM,
              handler: data => {
                this.loading = true;
                this.httpService.createFolder(data.value, this.currentFolder()._id, this.currentPath())
                .subscribe(
                  (res: any) => {
                    this.docs.folders.push(res.data.folder);
                    this.loading = false;
                    this.changeDetectorRef.detectChanges();
                    this.createSnackbar("INFO_FOLDER_CREATED");
                  }, 
                  error => {
                    this.loading = false;
                    this.changeDetectorRef.detectChanges();
                  }
                );
              }
            }
          ]
        });
      prompt.present();
    });
  }

  filePick(file) {
    this.loading = true;
    this.httpService.sendFile(file, this.currentFolder()._id, this.currentPath())
    .subscribe(
      (res: any) => {
        this.docs.files.push(res.data.file);
        this.loading = false;
        this.changeDetectorRef.detectChanges();
        this.createSnackbar("INFO_FILE_UPLOADED");
      }, 
      error => {
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      }
    );
    this.changeDetectorRef.detectChanges();
  }

  navigateToParent() {  
    this.folderStack.pop();
    this.navigateTo();
  }

  navigateToChild(folder) {
    this.folderStack.push(folder);
    this.navigateTo();
  }

  refresh(refresher) {
    refresher.complete();
    let requestCount = 0;
    this.loading = true;
    this.httpService.getUserDocs(this.currentFolder()._id)
    .subscribe((res: any) => {
      if (res.success) {
        this.docs = res.data.result;
      } else {
        this.createSnackbar("ERR_REFRESH");
      }
      requestComplete();
    });

    this.httpService.getUserProfile().subscribe((res: any) => {
      this.user = res.data;
      requestComplete();
    });

    const requestComplete = () => {
      requestCount++;
      if (requestCount === 2) {
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      }
    }
  }

  navigateTo(refresher?) {
    this.loading = true;
    this.httpService.getUserDocs(this.currentFolder()._id)
    .subscribe((res: any) => {
      if (res.success) {
        this.docs = res.data.result;
      } else {
        this.createSnackbar("ERR_REFRESH");
      }
      if (refresher) refresher.complete();
      this.loading = false;
      this.changeDetectorRef.detectChanges();
    }, error => this.loading = false);
  }

  onDeleteFile(fileId) {
    this.docs.files = this.docs.files.filter(f => f._id !== fileId);
    this.createSnackbar("INFO_FILE_DELETED");
  }

  onDeleteFolder(folderId) {
    this.docs.folders = this.docs.folders.filter(f => f._id !== folderId);
    this.createSnackbar("INFO_FOLDER_DELETED");
  }

  onRenameFile(data) {
    this.httpService.renameFile(data.id, data.value, this.currentPath()).subscribe((res: any) => {
      if (res.success) {
        this.docs.files.map(f => {
          if (f._id === data.id) f.name = `${data.value}.${data.extension}`;  
        });
        this.createSnackbar("INFO_FILE_RENAMED");
        this.changeDetectorRef.markForCheck();
      } else {
        this.createSnackbar("ERR_GENERIC");
      }
    });
  }

  onRenameFolder(data) {
    this.httpService.renameFolder(data.id, data.value, this.currentPath()).subscribe((res: any) => {
      if (res.success) {
        this.docs.folders.map(f => {
          if (f._id === data.id) f.name = data.value;  
          this.createSnackbar("INFO_FOLDER_RENAMED");
        });
        this.changeDetectorRef.markForCheck();
      } else {
        this.createSnackbar("ERR_GENERIC");
      }
    });
  }

  onMoveFile(fileId) {
    this.moving = {
      ...this.moving,
      isMoving: true,
      type: "file",
      sourcePath: this.currentPath(),
      value: fileId
    };
    this.changeDetectorRef.detectChanges();
  }

  onMoveFolder(folderId) {
    this.moving = {
      ...this.moving,
      isMoving: true,
      type: "folder",
      sourcePath: this.currentPath(),
      value: folderId
    };
    this.changeDetectorRef.detectChanges();
  }

  onStartDownload() {
    this.loading = true;
  }

  onEndDownload() {
    this.loading = false;
  }

  loginPage() {
    this.navCtrl.setRoot("UserLoginPage");
  }

  openMenu(event) {
    let popover = this.popoverCtrl.create(MenuComponent, { ...this.user });
    popover.present({ ev: event });
    popover.onDidDismiss(event => {
      if (!event) return;
      switch(event.type) {
        case "logout": 
          this.authService.signOut()
            .then(this.loginPage.bind(this))
            .catch(this.loginPage.bind(this)); 
          break;
        default: break;
      }
    })
  }

  move() {
    this.moving = {
      ...this.moving,
      destPath: this.currentPath(),
      parentId: this.currentFolder()._id,
      isMoving: false
    }
    this.changeDetectorRef.detectChanges();
    if (this.moving.type === "file") {
      this.httpService.moveFile(this.moving).subscribe((res: any) => {
        if (res.success) {
          this.createSnackbar("INFO_FILE_MOVED");
          this.navigateTo();
        } else {
          this.createSnackbar("ERR_GENERIC");
        }
      });
    } else {
      this.httpService.moveFolder(this.moving).subscribe((res: any) => {
        if (res.success) {
          this.createSnackbar("INFO_FOLDER_MOVED");
          this.navigateTo();
        } else {
          this.createSnackbar("ERR_GENERIC");
        }
      });
    }
  }

  onShare(url) {
    this.shareLink(url);
  }

  createSnackbar(message, params?, action?) {
    this.httpService.translate.get([message, "DISMISS"], params).subscribe(res => {
      this.snackbar.create({ 
        message: res[message], 
        closeButtonText: res["DISMISS"].toUpperCase(), 
        showCloseButton: true,
        duration: 3000
      }).present();
    });
  }

  shareLink(text) {
    if (this.plt.is("cordova")) {
      this.socialSharing.shareWithOptions({
        message: text,
        subject: "@LiteBox Share"
      }).then(() => {
        this.createSnackbar("INFO_URL_SHARED");
      });
    } else {
        // this.createSnackbar("INFO_URL_COPIED");
        this.presentPrompt(text);
    }
  }

  presentPrompt(placeholder) {
    this.httpService.translate.get(["OPT_CANCEL"]).subscribe(res => {
      this.alertCtrl.create({
        title: 'URL',
        inputs: [{ value: placeholder }],
        buttons: [{ text: res.OPT_CANCEL, role: 'cancel' }]
      }).present();
    });
  }
  
}